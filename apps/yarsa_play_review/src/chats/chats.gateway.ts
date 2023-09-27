import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';
import {
  BroadcastAllDto,
  ChatDto,
  JoinRoomDto,
  MessageRoomDto,
} from './Dto/chat.dto';
import { CommonUtils } from '../utils/common.utils';

export interface ClientIds {
  id: string;
}
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class ChatsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly prisma: PrismaService,
    private utils: CommonUtils,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const decodedToken = await this.verifyUser(client);
      const player = await this.prisma.player.findFirst({
        where: { email: decodedToken.email },
      });
      if (player || player.active == true) {
        client.data.user = player;
        await this.cacheManager.set(player.id, client.id, 86399980);
      } else throw new BadRequestException('connection cannot be established');
    } catch (error) {
      console.log('inside error ');
      client.disconnect(true);
    }
  }

  @SubscribeMessage('privateMessage')
  @AsyncApiPub({
    channel: 'privateMessage',
    operationId: 'privateMessage',
    summary: 'privateMessage',
    description: 'it uses user id to send message to other connected users',
    message: {
      payload: ChatDto,
      headers: {
        auth: {
          description: 'inside audth provide access token in token field',
          token: { description: 'access token' },
        },
      },
    },
  })
  async handlePrivateMessage(
    client: Socket,
    data: { recipientId: string; message: string },
  ): Promise<void> {
    const { recipientId, message } = data;
    const sender = client.data.user;
    const recipientSocket: string = await this.cacheManager.get(recipientId);
    this.server
      .to([recipientSocket, client.id])
      .emit('privateMessage', { message: message, sender: sender.id });

    await this.prisma.chats.create({
      data: {
        sender_id: sender.id,
        receiver_id: recipientId,
        message: message,
      },
    });
  }

  @SubscribeMessage('join_room')
  @AsyncApiSub({
    channel: 'join_room',
    summary: 'join_room',
    operationId: 'join_room',
    description: 'it joins a user to a room using the room name',
    message: {
      payload: JoinRoomDto,
      headers: {
        auth: { description: 'Send access token inside a token variable' },
      },
    },
  })
  async joinRoom(client: Socket, data: { roomName: string }) {
    const { roomName } = data;
    this.server.in(client.id).socketsJoin(roomName);
    return { message: roomName + ' joined successfully' };
  }

  @SubscribeMessage('message_room')
  @AsyncApiPub({
    channel: 'message_room',
    summary: 'message_room',
    operationId: 'message_room',
    description:
      'provide room name and message to broadcast the message to all the users in the room',
    message: {
      payload: MessageRoomDto,
      headers: {
        auth: { description: 'Send access token inside a token variable' },
      },
    },
  })
  async sendMsgRoom(
    client: Socket,
    data: {
      roomName: string;
      message: string;
    },
  ) {
    const { roomName, message } = data;
    const sender = client.data.user;
    this.server
      .to(roomName)
      .emit('message_room', { message: message, sender: sender.id, roomName });
  }

  @SubscribeMessage('message_all')
  @AsyncApiPub({
    channel: 'message_all',
    summary: 'message_all',
    operationId: 'message_all',
    description: 'used to broadcast message to all the subscribed users',
    message: {
      payload: BroadcastAllDto,
      headers: {
        auth: {
          description: 'Send access token inside a token variable',
        },
      },
    },
  })
  async broadCastToAll(client: Socket, data: { message: string }) {
    const { message } = data;
    const sender = client.data.user;

    this.server.emit('message', { message: message, sender: sender.id });
  }

  async handleDisconnect(client: Socket) {
    const player = client.data.user;
    await this.cacheManager.del(player.id);
  }
  async verifyUser(client: Socket) {
    const token = client.handshake.auth.token;
    return this.utils.decodeAccessToken(token);
  }
}
