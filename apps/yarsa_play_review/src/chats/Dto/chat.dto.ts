import { ApiProperty } from '@nestjs/swagger';

export class ChatDto {
  @ApiProperty()
  recipientId: string;
  @ApiProperty()
  message: string;
}
