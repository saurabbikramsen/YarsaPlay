import { Body, Controller, Get, Post, Response } from '@nestjs/common';
import { SseService } from './sse.service';
import { MessageDto } from './Dto/message.dto';

@Controller('sse')
export class SseController {
  constructor(private sseService: SseService) {}

  @Get('event')
  sseEvents(@Response() res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sseObservable = this.sseService.stream();
    sseObservable.subscribe((message) => {
      res.write(`data: ${message}\n\n`);
    });
  }
  @Post('trigger')
  triggerEvent(@Body() data: MessageDto) {
    console.log(data);
    this.sseService.send(data.message);
  }
}
