import { Module } from '@nestjs/common';
import {
  BattingPointsCalculatorService,
  BowlingPointsCalculatorService,
  FieldingPointsCalculatorService,
  PlayingPointsCalculatorService,
  RolePointsCalculatorService,
} from './helpers';
import { DefaultPointsCalculatorService } from './default-points-calculator.service';

@Module({
  providers: [
    DefaultPointsCalculatorService,
    BattingPointsCalculatorService,
    BowlingPointsCalculatorService,
    FieldingPointsCalculatorService,
    PlayingPointsCalculatorService,
    RolePointsCalculatorService,
  ],
  exports: [DefaultPointsCalculatorService],
})
export class DefaultPointsCalculatorModule {}
