import { Module } from '@nestjs/common';
import { OverByOverService } from './over-by-over.service';

@Module({
  imports: [],
  providers: [OverByOverService],
  exports: [OverByOverService],
})
export class OverByOverModule {}
