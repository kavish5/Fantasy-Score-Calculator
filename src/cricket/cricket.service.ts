import { Inject, Injectable, Logger } from '@nestjs/common';
import { PlayerPerformanceService } from '../player-analyser/performance';
import { GeneratePointsDto } from './dto/calculate-points.dto';
import { CricketResponse } from './interface/cricket-response.interface';
import { AnalyzeMatchDto } from './dto/analyze-match.dto';
import { ScoreService } from '../fantasy-analyser/score';
import { OverByOverService } from '../match-analyser/over-by-over';
import { PhaseService } from '../match-analyser/phase-wise';
import { H2hAnalyserService } from '../player-analyser/h2h-analyser';
import { BaseInfoService } from '../match-analyser/base-info';

@Injectable()
export class CricketService {
  private readonly logger = new Logger(CricketService.name, {
    timestamp: true,
  });

  constructor(
    @Inject(PlayerPerformanceService) private readonly playerPerformanceService: PlayerPerformanceService,
    @Inject(ScoreService) private readonly scoreService: ScoreService,
    @Inject(OverByOverService) private readonly overByOverService: OverByOverService,
    @Inject(PhaseService) private readonly phaseService: PhaseService,
    @Inject(H2hAnalyserService) private readonly h2hAnalyzerService: H2hAnalyserService,
    @Inject(BaseInfoService) private readonly baseInfoService: BaseInfoService,
  ) {}

  public calculatePoints(matchDetails: GeneratePointsDto): CricketResponse {
    try {
      const cricketDocument = this.scoreService.getCalculatedPoints(matchDetails);
      return cricketDocument;
    } catch (error) {
      this.logger.error(`Error occurred in calculatePoints function: `, error);
      throw error;
    }
  }

  public async analyzeMatch(matchDetails: AnalyzeMatchDto): Promise<CricketResponse> {
    try {
      const players = this.playerPerformanceService.calculate(matchDetails);
      const fantasyScores = this.scoreService.calculate(players);
      matchDetails.innings = this.overByOverService.calculate(matchDetails.innings);
      matchDetails = this.phaseService.calculate(matchDetails);
      matchDetails = this.baseInfoService.calculate(matchDetails);
      const h2hDetails = this.h2hAnalyzerService.calculate(matchDetails);
      return { ...matchDetails, ...fantasyScores, players, h2hDetails };
    } catch (error) {
      this.logger.error(`Error occurred in analyzeMatch function: `, error);
      throw error;
    }
  }
}
