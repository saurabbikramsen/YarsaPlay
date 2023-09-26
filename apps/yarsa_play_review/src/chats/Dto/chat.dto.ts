import { ApiProperty } from '@nestjs/swagger';

export class ChatDto {
  @ApiProperty()
  recipientId: string;
  @ApiProperty()
  message: string;
}

export class JoinRoomDto {
  @ApiProperty()
  roomName: string;
}
export class MessageRoomDto {
  @ApiProperty()
  roomName: string;

  @ApiProperty()
  message: string;
}
export class BroadcastAllDto {
  @ApiProperty()
  message: string;
}
