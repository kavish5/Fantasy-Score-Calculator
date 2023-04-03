import { Module } from '@nestjs/common';
import { BaseInfoService } from './base-info.service';

@Module({
  imports: [],
  providers: [BaseInfoService],
  exports: [BaseInfoService],
})
export class BaseInfoModule {}
