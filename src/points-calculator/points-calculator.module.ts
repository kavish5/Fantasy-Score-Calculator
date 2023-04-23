import { Module } from '@nestjs/common';
import { PointsCalculatorService } from './points-calculator.service';
import { DefaultPointsCalculatorModule } from './default-points-calculator';
import { ConfigReaderModule } from '../config-reader';

@Module({
  imports: [DefaultPointsCalculatorModule, ConfigReaderModule],
  providers: [PointsCalculatorService],
  exports: [PointsCalculatorService],
})
export class PointsCalculatorModule {}
