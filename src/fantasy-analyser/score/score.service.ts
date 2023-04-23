import { Inject, Injectable, Logger } from '@nestjs/common';
import { PointsCalculatorService } from '../../points-calculator';
import { GeneratePointsDto, PlayerDetails } from '../../cricket/dto/calculate-points.dto';
import { MatchType } from '../../cricket/enum/match-type.enum';
import { StrategyType } from '../../cricket/enum/strategy-type.enum';
import { CricketResponse } from '../../cricket/interface/cricket-response.interface';
import { unsupportedStrategyError } from './score.error';
import { DreamTeamService } from '../../player-analyser/dream-team';

@Injectable()
export class ScoreService {
  private readonly logger = new Logger(ScoreService.name, { timestamp: true });

  constructor(
    @Inject(PointsCalculatorService)
    private readonly pointCalculatorService: PointsCalculatorService,
    @Inject(DreamTeamService) private readonly dreamTeamService: DreamTeamService,
  ) {}

  public calculate(matchId: number, playerPerformance: PlayerDetails[]): any {
    this.logger.debug(`Calculating scores for ${JSON.stringify(playerPerformance)}`);
    let fantasyScores = this.getFantasyScores(matchId, playerPerformance);
    fantasyScores = this.dreamTeamService.calculate(fantasyScores);
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

  private getFantasyScores(matchId: number, players: PlayerDetails[]) {
    const fantasyScores = [];
    const strategy = StrategyType.dream11;
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
