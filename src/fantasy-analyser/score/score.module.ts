import { Module } from '@nestjs/common';
import { ScoreService } from './score.service';
import { PointsCalculatorModule } from '../../points-calculator';

@Module({
  imports: [PointsCalculatorModule],
  providers: [ScoreService],
  exports: [ScoreService],
})
export class ScoreModule {}
