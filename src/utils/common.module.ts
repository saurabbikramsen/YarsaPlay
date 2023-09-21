import { Global, Module } from '@nestjs/common';
import { CommonUtils } from './common.utils';

@Global()
@Module({
  providers: [CommonUtils],
  exports: [CommonUtils],
})
export class CommonModule {}
