import { Module } from '@nestjs/common';
import { ScoreService } from './score.service';
import { PointsCalculatorModule } from '../../points-calculator';
import { DreamTeamModule } from '../../player-analyser/dream-team';

@Module({
  imports: [PointsCalculatorModule, DreamTeamModule],
  providers: [ScoreService],
  exports: [ScoreService],
})
export class ScoreModule {}
