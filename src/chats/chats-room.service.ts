// src/chat-room.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatRoomService {
  private rooms: Map<string, string[]> = new Map(); // Map to store users in each room

  addUserToRoom(userId: string, roomId: string) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, []);
    }

    const usersInRoom = this.rooms.get(roomId);
    usersInRoom.push(userId);

    this.rooms.set(roomId, usersInRoom);
  }

  getUsersInRoom(roomId: string): string[] {
    return this.rooms.get(roomId) || [];
  }
}
