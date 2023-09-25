import { Module } from '@nestjs/common';
import { SseImplementationController } from './sse_implementation.controller';
import { SseImplementationService } from './sse_implementation.service';

@Module({
  imports: [],
  controllers: [SseImplementationController],
  providers: [SseImplementationService],
})
export class SseImplementationModule {}
