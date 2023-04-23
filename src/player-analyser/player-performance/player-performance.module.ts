import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerPerformanceService } from './player-performance.service';
import { PlayersPerformance } from './player-performance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlayersPerformance])],
  providers: [PlayerPerformanceService],
  exports: [PlayerPerformanceService],
})
export class PlayerPerformanceModule {}
