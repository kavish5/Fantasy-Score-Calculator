import { Inject, Injectable, Logger } from '@nestjs/common';
import { PlayerPerformanceService } from '../player-analyser/player-performance';
import { GeneratePointsDto } from './dto/calculate-points.dto';
import { CricketResponse } from './interface/cricket-response.interface';
import { AnalyzeMatchDto } from './dto/analyze-match.dto';
import { ScoreService } from '../fantasy-analyser/score';
import { OverByOverService } from '../match-analyser/over-by-over';
import { PhaseService } from '../match-analyser/phase-wise';
import { H2hAnalyserService } from '../player-analyser/h2h-analyser';
import { BaseInfoService } from '../match-analyser/base-info';
import { PlayerService } from '../player-analyser/player';
import { VenueService } from '../match-analyser/venue';

@Injectable()
export class CricketService {
  private readonly logger = new Logger(CricketService.name, { timestamp: true });

  constructor(
    @Inject(PlayerPerformanceService) private readonly playerPerformanceService: PlayerPerformanceService,
    @Inject(ScoreService) private readonly scoreService: ScoreService,
    @Inject(OverByOverService) private readonly overByOverService: OverByOverService,
    @Inject(PhaseService) private readonly phaseService: PhaseService,
    @Inject(H2hAnalyserService) private readonly h2hAnalyzerService: H2hAnalyserService,
    @Inject(BaseInfoService) private readonly baseInfoService: BaseInfoService,
    @Inject(PlayerService) private readonly playerService: PlayerService,
    @Inject(VenueService) private readonly venueService: VenueService,
  ) {}

  public calculatePoints(matchDetails: GeneratePointsDto): CricketResponse {
    return this.tryWrapper(() => {
      return this.scoreService.getCalculatedPoints(matchDetails);
    });
  }

  public async analyzeMatch(matchDetails: AnalyzeMatchDto): Promise<CricketResponse> {
    return this.tryWrapper(async () => {
      const players = this.playerPerformanceService.calculate(matchDetails);
      const fantasyScores = this.scoreService.calculate(players);
      matchDetails.innings = this.overByOverService.calculate(matchDetails.innings);
      matchDetails = this.phaseService.calculate(matchDetails);
      matchDetails = this.baseInfoService.calculate(matchDetails);
      const h2hDetails = this.h2hAnalyzerService.calculate(matchDetails);
      return { ...matchDetails, ...fantasyScores, players, h2hDetails };
    });
  }

  public async processMatch(matchDetails: AnalyzeMatchDto): Promise<CricketResponse> {
    return this.tryWrapper(async () => {
      const [players, venues] = await Promise.all([this.playerService.getPlayers(), this.venueService.getVenues()]);
      const insights = await this.analyzeMatch(matchDetails);
      await this.h2hAnalyzerService.processMatchWiseH2h(
        insights.h2hDetails,
        players,
        insights.meta.match_number,
        insights.info.dates[0],
      );
      return { insights, players, venues };
    });
  }

  private tryWrapper<T>(fn: () => Promise<T> | T): T | Promise<T> {
    try {
      return fn();
    } catch (error) {
      this.logger.error(`Error occurred in ${fn.name} function: `, error);
      throw error;
    }
  }
}
