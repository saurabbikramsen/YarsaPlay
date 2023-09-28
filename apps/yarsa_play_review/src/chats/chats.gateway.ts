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
  ConnectionDto,
  JoinRoomDto,
  MessageRoomDto,
} from './Dto/chat.dto';
import { CommonUtils } from '../utils/common.utils';

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

  @AsyncApiSub({
    channel: 'connect',
    summary: 'connect',
    operationId: 'connect',
    description: 'it is used to connect to the server using socket',
    message: {
      payload: ConnectionDto,
      headers: {
        authorization: {
          description: 'access token of the user',
        },
      },
    },
  })
  async handleConnection(client: Socket) {
    try {
      const decodedToken = await this.verifyUser(client);
      const player = await this.prisma.player.findFirst({
        where: { email: decodedToken.email },
      });
      if (player && player.active == true) {
        client.data.user = player;
        await this.cacheManager.set(player.id, client.id, 86399980);
      } else throw new BadRequestException('you are not eligible');
    } catch (error) {
      console.log('inside error');
      client.disconnect(true);
      return 'disconnected';
    }
  }

  @SubscribeMessage('privateMessage')
  @AsyncApiPub({
    channel: 'privateMessage',
    operationId: 'privateMessage',
    summary: 'privateMessage',
    description:
      'it uses recipient id to send message to other connected users and returns senders id and message',
    message: {
      payload: ChatDto,
    },
  })
  async handlePrivateMessage(
    client: Socket,
    data: { recipientId: string; message: string },
  ) {
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
    return { message: 'i am hero' };
  }

  @SubscribeMessage('join_room')
  @AsyncApiSub({
    channel: 'join_room',
    summary: 'join_room',
    operationId: 'join_room',
    description: 'it joins a user to a room using the room name',
    message: {
      payload: JoinRoomDto,
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
    },
  })
  async broadCastToAll(client: Socket, data: { message: string }) {
    const { message } = data;
    const sender = client.data.user;

    this.server.emit('message', { message: message, sender: sender.id });
  }

  async handleDisconnect(client: Socket) {
    const player = client.data.user;
    if (player) await this.cacheManager.del(player.id);
  }
  async verifyUser(client: Socket) {
    const token = client.handshake.headers.authorization;
    const realToken = token.slice(7, token.length);
    return this.utils.decodeAccessToken(realToken);
  }
}
