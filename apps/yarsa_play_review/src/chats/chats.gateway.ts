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
import { ChatDto } from './Dto/chat.dto';
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
    const token = client.handshake.auth.token;
    try {
      const decodedToken = await this.utils.decodeRefreshToken(token);
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
    summary: 'Send private message to other users',
    description: 'it uses user id to send message to other connected users',
    message: { payload: ChatDto },
  })
  async handlePrivateMessage(
    client: Socket,
    data: { recipientId: string; message: string },
  ): Promise<void> {
    const sender = client.data.user;
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
    summary: 'Join a room new room',
    description: 'it joins a user to a room using the room name',
    message: { payload: ChatDto },
  })
  async joinRoom(client: Socket, data: { userId: string; roomName: string }) {
    const { userId, roomName } = data;
    console.log('roomName: ', roomName);
    const socketId: string = await this.cacheManager.get(userId);
    this.server.in(socketId).socketsJoin(roomName);
    return 'joined success fully';
  }

  @SubscribeMessage('message_room')
  async sendMsgRoom(
    client: Socket,
    data: {
      userId: string;
      roomName: string;
      message: string;
    },
  ) {
    const { userId, roomName, message } = data;
    console.log('this is data:', message);
    this.server.to(roomName).emit('message_room', message);
    const sockets = await this.server.in(roomName).fetchSockets();
    console.log(sockets);
    return userId;
  }

  @SubscribeMessage('message')
  async handleChatMessage(
    client: Socket,
    data: { recipientId: string; message: string },
  ): Promise<void> {
    const sender_Id = client.id;
    const { recipientId, message } = data;
    console.log(sender_Id);
    console.log('recipient', recipientId);

    this.server.emit('message', message);
  }
}
