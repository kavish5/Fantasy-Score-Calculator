import { Injectable, Logger } from '@nestjs/common';
import { BattingDetails } from '../../../cricket/dto/calculate-points.dto';
import { RoleType } from '../../../cricket/enum/role-type.enum';

@Injectable()
export class BattingPointsCalculatorService {
  private readonly logger = new Logger(BattingPointsCalculatorService.name, { timestamp: true });

  public calculate(batting: BattingDetails, role: string, pointsConfigurations: Record<string, any>): number {
    try {
      let points: number = 0;
      if (!pointsConfigurations || !batting) {
        return points;
      }
      const defaultPoints: number = this.calculateDefaultPoints(batting, role, pointsConfigurations);
      const bonusPoints: number = this.calculateBonusPoints(batting, role, pointsConfigurations);
      points = defaultPoints + bonusPoints;
      return points;
    } catch (error) {
      this.logger.error(`Error occurred for calculate batting points calculation: ${error} ${JSON.stringify(error)}`);
      throw error;
    }
  }

  private calculateDefaultPoints(
    batting: BattingDetails,
    role: string,
    pointsConfigurations: Record<string, any>,
  ): number {
    let points = 0;
    if (pointsConfigurations.run && batting.runs && batting.runs > 0) {
      points += batting.runs * pointsConfigurations.run;
    }
    if (pointsConfigurations.four && batting.fours && batting.fours > 0) {
      points += batting.fours * pointsConfigurations.four;
    }
    if (pointsConfigurations.six && batting.sixes && batting.sixes > 0) {
      points += batting.sixes * pointsConfigurations.six;
    }
    if (pointsConfigurations.duck && batting.isDismissed && batting.runs === 0 && role !== RoleType.BOWL) {
      points += pointsConfigurations.duck;
    }
    return points;
  }

  private calculateBonusPoints(batting: BattingDetails, role: string, pointsConfigurations: Record<string, any>) {
    let points = 0;
    if (
      role !== RoleType.BOWL &&
      pointsConfigurations.bonus?.strikeRate &&
      pointsConfigurations.bonus?.strikeRate?.minimumBalls <= batting.balls &&
      (!pointsConfigurations.bonus?.strikeRate?.minimumRuns ||
        pointsConfigurations.bonus?.strikeRate?.minimumRuns <= batting.runs)
    ) {
      const strikeRate = this.calculateStrikeRate(batting);
      const slot = this.getSlot(pointsConfigurations.bonus?.strikeRate?.slots, strikeRate);
      if (slot) {
        points += slot.points;
      }
    }
    if (pointsConfigurations.bonus?.runs) {
      const slot = this.getSlot(pointsConfigurations.bonus?.runs?.slots, batting.runs);
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

  private calculateStrikeRate(batting: BattingDetails) {
    const runs = batting.runs || 0;
    const balls = batting.balls || 0;
    return (runs / balls) * 100;
  }
}
