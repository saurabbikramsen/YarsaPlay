import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { ChatRoomService } from './chats-room.service';

@Module({
  providers: [EventsGateway, ChatRoomService],
})
export class EventsModule {}
