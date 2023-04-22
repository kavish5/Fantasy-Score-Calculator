import { Inject, Injectable, Logger } from '@nestjs/common';
import { PointsCalculatorService } from '../../points-calculator';
import { GeneratePointsDto, PlayerDetails } from '../../cricket/dto/calculate-points.dto';
import { MatchType } from '../../cricket/enum/match-type.enum';
import { StrategyType } from '../../cricket/enum/strategy-type.enum';
import { CricketResponse } from '../../cricket/interface/cricket-response.interface';
import { unsupportedStrategyError } from './score.error';

@Injectable()
export class ScoreService {
  private readonly logger = new Logger(ScoreService.name, { timestamp: true });

  constructor(
    @Inject(PointsCalculatorService)
    private readonly pointCalculatorService: PointsCalculatorService,
  ) {}

  public calculate(playerPerformance: PlayerDetails[]): any {
    this.logger.debug(`Calculating scores for ${JSON.stringify(playerPerformance)}`);
    const fantasyScores = this.getFantasyScores(playerPerformance);
    return { fantasyScores };
  }

  public getCalculatedPoints(matchDetails: GeneratePointsDto): CricketResponse {
    if (matchDetails.strategy === StrategyType.dream11) {
      const response = this.pointCalculatorService.calculateCricketPoints(matchDetails);
      return response;
    } else {
      throw unsupportedStrategyError(matchDetails.strategy);
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
