import { Injectable, Logger } from '@nestjs/common';
import { FieldingDetails } from '../../../cricket/dto/calculate-cricket-points.dto';

@Injectable()
export class FieldingPointsCalculatorService {
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
    if (fielding.runout?.direct && fielding.runout.direct > 0) {
      points += fielding.runout.direct * pointsConfigurations.runout.direct;
    }
    if (fielding.runout?.indirect && fielding.runout.indirect > 0) {
      points += fielding.runout.indirect * pointsConfigurations.runout.indirect;
    }
    if (fielding.stumpings && fielding.stumpings > 0) {
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

  private getSlot(slots: any, value: number) {
    const slot = slots.find((item: any) => {
      let flag = false;
      if (item.above && item.below) {
        if (item.above <= value && item.below >= value) {
          flag = true;
        }
      } else {
        if (item.above && item.above <= value) {
          flag = true;
        }
        if (item.below && item.below >= value) {
          flag = true;
        }
      }
      return flag;
    });
    return slot;
  }
}
