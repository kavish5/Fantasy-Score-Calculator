import { Module } from '@nestjs/common';
import { PlayerPerformanceService } from './player-performance.service';

@Module({
  imports: [],
  providers: [PlayerPerformanceService],
  exports: [PlayerPerformanceService],
})
export class PlayerPerformanceModule {}
