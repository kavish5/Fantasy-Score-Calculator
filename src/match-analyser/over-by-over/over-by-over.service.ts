import { Injectable, Logger } from '@nestjs/common';
import { InningsDetails, OversDetails } from 'src/cricket/dto/analyze-match.dto';

@Injectable()
export class OverByOverService {
  private readonly logger = new Logger(OverByOverService.name, { timestamp: true });

  constructor() {}

  public calculate(innings: InningsDetails[]): any {
    this.logger.debug(`Calculating over-wise analysis for match`);
    let firstInning: OversDetails[] = innings[0] ? innings[0].overs : [];
    let secondInning: OversDetails[] = innings[1] ? innings[1].overs : [];
    if (firstInning.length > 0) {
      firstInning = this.calculateOverScore(firstInning);
    }
    if (secondInning.length > 0) {
      secondInning = this.calculateOverScore(secondInning);
    }
    return innings;
  }

  private calculateOverScore(inningsDetail: OversDetails[]) {
    for (const over of inningsDetail) {
      const { deliveries } = over;
      const overTotalScore = deliveries.reduce(
        (score: any, delivery: Record<string, any>) => score + delivery.runs.total,
        0,
      );
      const extrasScore = deliveries.reduce(
        (score: any, delivery: Record<string, any>) => score + delivery.runs.extras,
        0,
      );
      const totalBalls = deliveries.length;
      const batterZeroes = deliveries.reduce(
        (score: any, delivery: Record<string, any>) => score + (delivery.runs.batter === 0),
        0,
      );
      const batterOnes = deliveries.reduce(
        (score: any, delivery: Record<string, any>) => score + (delivery.runs.batter === 1),
        0,
      );
      const batterTwos = deliveries.reduce(
        (score: any, delivery: Record<string, any>) => score + (delivery.runs.batter === 2),
        0,
      );
      const batterThrees = deliveries.reduce(
        (score: any, delivery: Record<string, any>) => score + (delivery.runs.batter === 3),
        0,
      );
      const batterFours = deliveries.reduce(
        (score: any, delivery: Record<string, any>) => score + (delivery.runs.batter === 4),
        0,
      );
      const batterSixes = deliveries.reduce(
        (score: any, delivery: Record<string, any>) => score + (delivery.runs.batter === 6),
        0,
      );
      const teamZeroes = deliveries.reduce(
        (score: any, delivery: Record<string, any>) => score + (delivery.runs.total === 0),
        0,
      );
      const teamOnes = deliveries.reduce(
        (score: any, delivery: Record<string, any>) => score + (delivery.runs.total === 1),
        0,
      );
      const teamTwos = deliveries.reduce(
        (score: any, delivery: Record<string, any>) => score + (delivery.runs.total === 2),
        0,
      );
      const teamThrees = deliveries.reduce(
        (score: any, delivery: Record<string, any>) => score + (delivery.runs.total === 3),
        0,
      );
      const teamFours = deliveries.reduce(
        (score: any, delivery: Record<string, any>) => score + (delivery.runs.total === 4),
        0,
      );
      const teamSixes = deliveries.reduce(
        (score: any, delivery: Record<string, any>) => score + (delivery.runs.total === 6),
        0,
      );
      const wickets = deliveries.reduce(
        (score: any, delivery: Record<string, any>) => (delivery.wickets ? score + delivery.wickets.length : score),
        0,
      );
      over.over_score = overTotalScore;
      over.over_extras = extrasScore;
      over.over_batsman_score = overTotalScore - extrasScore;
      over.over_balls = totalBalls;
      over.team_zeroes = teamZeroes;
      over.team_ones = teamOnes;
      over.team_twos = teamTwos;
      over.team_threes = teamThrees;
      over.team_fours = teamFours;
      over.team_sixes = teamSixes;
      over.batter_zeroes = batterZeroes;
      over.batter_ones = batterOnes;
      over.batter_twos = batterTwos;
      over.batter_threes = batterThrees;
      over.batter_fours = batterFours;
      over.batter_sixes = batterSixes;
      over.wickets = wickets;
    }
    return inningsDetail;
  }
}
