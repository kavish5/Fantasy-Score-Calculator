import { Module } from '@nestjs/common';
import { PhaseService } from './phase-wise.service';

@Module({
  imports: [],
  providers: [PhaseService],
  exports: [PhaseService],
})
export class PhaseModule {}
