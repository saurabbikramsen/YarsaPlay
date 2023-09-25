import { NestFactory } from '@nestjs/core';
import { SseImplementationModule } from './sse_implementation.module';

async function bootstrap() {
  const app = await NestFactory.create(SseImplementationModule);
  await app.listen(3000);
}
bootstrap();
