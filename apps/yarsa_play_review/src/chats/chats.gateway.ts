import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Injectable } from '@nestjs/common';
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
      client.data.user = await this.prisma.player.findFirst({
        where: { email: decodedToken.email },
      });
      await this.cacheManager.set(client.data.user.id, client.id, 86399980);
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
        auth: { description: 'Bearer access token inside a token variable' },
      },
    },
  })
  async handlePrivateMessage(
    client: Socket,
    data: { recipientId: string; message: string },
  ): Promise<void> {
    const sender = await this.verifyUser(client);
    const { recipientId, message } = data;

    const recipientSocket: string = await this.cacheManager.get(recipientId);
    const senderSocket: string = await this.cacheManager.get(sender.id);

    console.log('receiver Socket is : ', recipientSocket);
    if (recipientSocket || senderSocket) {
      this.server
        .to([recipientSocket, senderSocket])
        .emit('privateMessage', message);
    }
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
        auth: { description: 'Bearer access token inside a token variable' },
      },
    },
  })
  async joinRoom(client: Socket, data: { roomName: string }) {
    const sender = await this.verifyUser(client);

    const { roomName } = data;
    const socketId: string = await this.cacheManager.get(sender.id);
    this.server.in(socketId).socketsJoin(roomName);
    return 'joined successfully';
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
        auth: { description: 'Bearer access token inside a token variable' },
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
    const sender = await this.verifyUser(client);
    const { roomName, message } = data;
    this.server.to(roomName).emit('message_room', message);
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
          description: 'Bearer access token inside a token variable',
        },
      },
    },
  })
  async broadCastToALl(
    client: Socket,
    data: { message: string },
  ): Promise<void> {
    const { message } = data;
    this.server.emit('message', message);
  }

  async verifyUser(client: Socket) {
    const token = client.handshake.auth.token;
    return this.utils.decodeRefreshToken(token);
  }
}
