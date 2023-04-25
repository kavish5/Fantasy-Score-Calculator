import { Inject, Injectable, Logger } from '@nestjs/common';
import { PlayerPerformanceService } from '../player-analyser/player-performance';
import { GeneratePointsDto } from './dto/calculate-points.dto';
import { CricketResponse } from './interface/cricket-response.interface';
import { AnalyzeMatchDto } from './dto/analyze-match.dto';
import { ScoreService } from '../fantasy-analyser/score';
import { OverByOverService } from '../match-analyser/over-by-over';
import { PhaseService } from '../match-analyser/phase-wise';
import { H2hAnalyserService } from '../player-analyser/h2h-analyser';
import { MatchInformationService } from '../match-analyser/match-information';
import { PlayerService } from '../player-analyser/player';
import { VenueService } from '../match-analyser/venue';
import { ZipProcessorService } from '../zip-processor';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CricketService {
  private readonly logger = new Logger(CricketService.name, { timestamp: true });

  constructor(
    @Inject(ZipProcessorService) private readonly zipProcessorService: ZipProcessorService,
    @Inject(PlayerPerformanceService) private readonly playerPerformanceService: PlayerPerformanceService,
    @Inject(ScoreService) private readonly scoreService: ScoreService,
    @Inject(OverByOverService) private readonly overByOverService: OverByOverService,
    @Inject(PhaseService) private readonly phaseService: PhaseService,
    @Inject(H2hAnalyserService) private readonly h2hAnalyzerService: H2hAnalyserService,
    @Inject(MatchInformationService) private readonly matchInformationService: MatchInformationService,
    @Inject(PlayerService) private readonly playerService: PlayerService,
    @Inject(VenueService) private readonly venueService: VenueService,
  ) {}

  public calculatePoints(matchDetails: GeneratePointsDto): CricketResponse {
    return this.tryWrapper(() => {
      return this.scoreService.getCalculatedPoints(matchDetails);
    });
  }

  public processCricsheet(url: string): CricketResponse {
    return this.tryWrapper(async () => {
      const filePath = '../cricket-files/';
      await this.zipProcessorService.downloadAndExtractZip(url, filePath);
      const response = await this.processJsonFiles(filePath);
      return response;
    });
  }

  public async analyzeMatch(matchDetails: AnalyzeMatchDto): Promise<CricketResponse> {
    return this.tryWrapper(async () => {
      const matchId = matchDetails.meta.match_number;
      const players = this.playerPerformanceService.calculate(matchDetails);
      const fantasyScores = this.scoreService.calculate(matchId, players);
      matchDetails.innings = this.overByOverService.calculate(matchDetails.innings);
      matchDetails = this.phaseService.calculate(matchDetails);
      matchDetails = this.matchInformationService.calculate(matchDetails);
      const h2hDetails = this.h2hAnalyzerService.calculate(matchDetails);
      return { ...matchDetails, ...fantasyScores, players, h2hDetails };
    });
  }

  public async processMatch(matchDetails: AnalyzeMatchDto): Promise<CricketResponse> {
    return this.tryWrapper(async () => {
      // TODO: check if match is processed, if not add data to table, if yes return
      const [players] = await Promise.all([this.playerService.getPlayers()]);
      const matchVenue = matchDetails.info.venue;
      const venueDetails = await this.venueService.getMatchingVenue(matchVenue);
      matchDetails.info.venue = venueDetails.name;
      matchDetails.info.city = venueDetails.city;

      const insights = await this.analyzeMatch(matchDetails);
      const matchNumber = insights.meta.match_number;
      const matchDate = insights.info.dates[0];

      await this.h2hAnalyzerService.processMatchWiseH2h(insights.h2hDetails, players, matchNumber, matchDate);
      await this.playerPerformanceService.processMatchWisePlayerPerformance(
        insights.info,
        insights.players,
        players,
        matchNumber,
      );
      // TODO: update phase wise score in table
      // TODO: mark it processed

      return { insights, players, venueDetails };
    });
  }

  private async processJsonFiles(dir: string): Promise<any> {
    const response: any = {};
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      if (path.extname(file) === '.json') {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const matchNumber = file.split('.json')[0];
        data.meta.match_number = matchNumber;
        await this.processMatch(data);
        response[file.split('.json')[0]] = true;
      }
      fs.unlinkSync(filePath);
    }
    return response;
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
