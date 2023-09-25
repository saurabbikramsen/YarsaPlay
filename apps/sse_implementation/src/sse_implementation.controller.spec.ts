import { Test, TestingModule } from '@nestjs/testing';
import { SseImplementationController } from './sse_implementation.controller';
import { SseImplementationService } from './sse_implementation.service';

describe('SseImplementationController', () => {
  let sseImplementationController: SseImplementationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SseImplementationController],
      providers: [SseImplementationService],
    }).compile();

    sseImplementationController = app.get<SseImplementationController>(SseImplementationController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(sseImplementationController.getHello()).toBe('Hello World!');
    });
  });
});
