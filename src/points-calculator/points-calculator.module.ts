import { Module } from '@nestjs/common';
import { PointsCalculatorService } from './points-calculator.service';
import { DefaultPointsCalculatorModule } from './default-points-calculator';

@Module({
  imports: [DefaultPointsCalculatorModule],
  providers: [PointsCalculatorService],
  exports: [PointsCalculatorService],
})
export class PointsCalculatorModule {}
