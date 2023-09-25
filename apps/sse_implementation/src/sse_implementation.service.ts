import { Injectable } from '@nestjs/common';

@Injectable()
export class SseImplementationService {
  getHello(): string {
    return 'Hello World!';
  }
}
