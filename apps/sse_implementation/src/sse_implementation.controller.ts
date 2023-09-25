import { Controller, Get } from '@nestjs/common';
import { SseImplementationService } from './sse_implementation.service';

@Controller()
export class SseImplementationController {
  constructor(private readonly sseImplementationService: SseImplementationService) {}

  @Get()
  getHello(): string {
    return this.sseImplementationService.getHello();
  }
}
