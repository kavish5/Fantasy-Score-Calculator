import { Injectable, Logger } from '@nestjs/common';
import { FieldingDetails } from '../../../cricket/dto/calculate-points.dto';
import { BasePointsCalculatorService } from './base-points-calculator.service';

@Injectable()
export class FieldingPointsCalculatorService extends BasePointsCalculatorService {
  private readonly logger = new Logger(FieldingPointsCalculatorService.name, { timestamp: true });

  public calculate(fielding: FieldingDetails, pointsConfigurations: Record<string, any>): number {
    try {
      let points: number = 0;
      if (!pointsConfigurations || !fielding) {
        return points;
      }
      const defaultPoints: number = this.calculateDefaultPoints(fielding, pointsConfigurations);
      const bonusPoints: number = this.calculateBonusPoints(fielding, pointsConfigurations);
      points = defaultPoints + bonusPoints;
      return points;
    } catch (error) {
      this.logger.error(`Error occurred for calculate fielding points calculation: ${error} ${JSON.stringify(error)}`);
      throw error;
    }
  }

  private calculateDefaultPoints(fielding: FieldingDetails, pointsConfigurations: Record<string, any>): number {
    let points = 0;
    if (fielding.catches && fielding.catches > 0) {
      points += fielding.catches * pointsConfigurations.catch;
    }
    if (pointsConfigurations.runout?.direct && fielding.runout?.direct && fielding.runout.direct > 0) {
      points += fielding.runout.direct * pointsConfigurations.runout.direct;
    }
    if (pointsConfigurations.runout?.indirect && fielding.runout?.indirect && fielding.runout.indirect > 0) {
      points += fielding.runout.indirect * pointsConfigurations.runout.indirect;
    }
    if (pointsConfigurations.stumping && fielding.stumpings && fielding.stumpings > 0) {
      points += fielding.stumpings * pointsConfigurations.stumping;
    }
    return points;
  }

  private calculateBonusPoints(fielding: FieldingDetails, pointsConfigurations: Record<string, any>) {
    let points = 0;
    if (pointsConfigurations.bonus?.catches) {
      const slot = this.getSlot(pointsConfigurations.bonus?.catches?.slots, fielding.catches);
      if (slot) {
        points += slot.points;
      }
    }
    return points;
  }
}
