import { Inject, Injectable, Logger } from '@nestjs/common';
import { PointsCalculatorService } from '../../points-calculator';
import { GeneratePointsDto, PlayerDetails } from '../../cricket/dto/calculate-points.dto';
import { MatchType } from '../../cricket/enum/match-type.enum';
import { StrategyType } from '../../cricket/enum/strategy-type.enum';
import { CricketResponse } from '../../cricket/interface/cricket-response.interface';

@Injectable()
export class ScoreService {
  private readonly logger = new Logger(ScoreService.name, { timestamp: true });

  constructor(@Inject(PointsCalculatorService) private readonly pointCalculatorService: PointsCalculatorService) {}

  public calculate(playerPerformance: PlayerDetails[]): any {
    this.logger.debug(`Calculating scores for ${JSON.stringify(playerPerformance)}`);
    const fantasyScores = this.getFantasyScores(playerPerformance);
    return { fantasyScores };
  }

  public getCalculatedPoints(matchDetails: GeneratePointsDto): CricketResponse {
    try {
      switch (matchDetails.strategy) {
        default:
          const response = this.pointCalculatorService.defaultCricketPointsCalculation(matchDetails);
          return response;
      }
      return matchDetails;
    } catch (error) {
      this.logger.error(
        `Error occured on calculating cricket match points for ${JSON.stringify(matchDetails)}: ${error}`,
      );
      throw error;
    }
  }

  private getFantasyScores(players: PlayerDetails[]) {
    const fantasyScores = [];
    const strategy = StrategyType.dream11;
    const matchId = Math.round(Math.random() * 1000000);
    const fantasyData: GeneratePointsDto = {
      matchId,
      players,
      strategy,
      type: MatchType.T20,
    };
    const fantasyScore = this.getCalculatedPoints(fantasyData);
    fantasyScores.push({ strategy, fantasyScore });
    return fantasyScores;
  }
}
