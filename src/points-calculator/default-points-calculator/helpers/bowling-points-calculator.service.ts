import { Injectable, Logger } from '@nestjs/common';
import { BowlingDetails } from '../../../cricket/dto/calculate-cricket-points.dto';

@Injectable()
export class BowlingPointsCalculatorService {
  private readonly logger = new Logger(BowlingPointsCalculatorService.name, { timestamp: true });

  public calculate(bowling: BowlingDetails, pointsConfigurations: Record<string, any>): number {
    try {
      let points: number = 0;
      if (!pointsConfigurations || !bowling) {
        return points;
      }
      const defaultPoints: number = this.calculateDefaultPoints(bowling, pointsConfigurations);
      const bonusPoints: number = this.calculateBonusPoints(bowling, pointsConfigurations);
      points = defaultPoints + bonusPoints;
      return points;
    } catch (error) {
      this.logger.error(`Error occurred for calculate bowling points calculation: ${error} ${JSON.stringify(error)}`);
      throw error;
    }
  }

  private calculateDefaultPoints(bowling: BowlingDetails, pointsConfigurations: Record<string, any>): number {
    let points = 0;
    if (pointsConfigurations.wicket && bowling.wickets && bowling.wickets > 0) {
      points += bowling.wickets * pointsConfigurations.wicket;
    }
    if (pointsConfigurations.maiden && bowling.maidens && bowling.maidens > 0) {
      points += bowling.maidens * pointsConfigurations.maiden;
    }
    if (pointsConfigurations.bowled && bowling.bowled && bowling.bowled > 0) {
      points += bowling.bowled * pointsConfigurations.bowled;
    }
    if (pointsConfigurations.lbw && bowling.lbws && bowling.lbws > 0) {
      points += bowling.lbws * pointsConfigurations.lbw;
    }
    return points;
  }

  private calculateBonusPoints(bowling: BowlingDetails, pointsConfigurations: Record<string, any>) {
    let points = 0;
    if (pointsConfigurations.bonus?.economy && pointsConfigurations.bonus?.economy?.minimumBalls <= bowling.balls) {
      const ballsPerOver = pointsConfigurations.bonus?.economy?.ballsPerOver || 6;
      const economy = this.calculateEconomy(bowling, ballsPerOver);
      const slot = this.getSlot(pointsConfigurations.bonus?.economy?.slots, economy);
      if (slot) {
        points += slot.points;
      }
    }
    if (pointsConfigurations.bonus?.wickets) {
      const slot = this.getSlot(pointsConfigurations.bonus?.wickets?.slots, bowling.wickets);
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

  private calculateEconomy(bowling: BowlingDetails, ballsPerOver: number) {
    const runs = bowling.runs || 0;
    const balls = bowling.balls || 0;
    return (runs / balls) * ballsPerOver;
  }
}
