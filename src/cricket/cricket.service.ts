import { Injectable, Logger } from '@nestjs/common';
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
import { MatchInformation } from '../match-analyser/match-information/match-information.entity';
import { formatLogicUnavailableError } from './cricket.error';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CricketService {
  private readonly logger = new Logger(CricketService.name, { timestamp: true });

  constructor(
    private readonly zipProcessorService: ZipProcessorService,
    private readonly playerPerformanceService: PlayerPerformanceService,
    private readonly scoreService: ScoreService,
    private readonly overByOverService: OverByOverService,
    private readonly phaseService: PhaseService,
    private readonly h2hAnalyzerService: H2hAnalyserService,
    private readonly matchInformationService: MatchInformationService,
    private readonly playerService: PlayerService,
    private readonly venueService: VenueService,
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
      return this.createCricketResponse(matchDetails);
    });
  }

  public async processMatch(matchDetails: AnalyzeMatchDto): Promise<CricketResponse> {
    return this.tryWrapper(async () => {
      const matchType = matchDetails.info?.match_type;
      let response: any = {};
      switch (matchType) {
        case 'T20':
          response = await this.processT20Match(matchDetails);
          break;
        default:
          throw formatLogicUnavailableError(matchType);
      }
      return response;
    });
  }

  private async processT20Match(matchDetails: AnalyzeMatchDto) {
    const insights = await this.createCricketResponse(matchDetails);
    await this.processCricketResponse(insights);
    return insights;
  }

  private async createCricketResponse(matchDetails: AnalyzeMatchDto): Promise<CricketResponse> {
    const matchId = matchDetails.meta.match_number;
    const players = this.playerPerformanceService.calculate(matchDetails);
    const fantasyScores = this.scoreService.calculate(matchId, players);
    matchDetails.innings = this.overByOverService.calculate(matchDetails.innings);
    matchDetails = this.phaseService.calculate(matchDetails);
    matchDetails = this.matchInformationService.calculate(matchDetails);
    const h2hDetails = this.h2hAnalyzerService.calculate(matchDetails);
    return { ...matchDetails, ...fantasyScores, players, h2hDetails };
  }

  private async processCricketResponse(insights: CricketResponse) {
    const matchNumber = insights.meta.match_number;
    const matchDate = insights.info.dates[0];
    const players = await this.playerService.getPlayers();
    const matchVenue = insights.info.venue;
    const venueDetails = await this.venueService.getMatchingVenue(matchVenue);
    insights.info.venue = venueDetails.name;
    insights.info.city = venueDetails.city;

    const matchInformation = await this.storeMatchInformation(insights);
    await this.h2hAnalyzerService.processMatchWiseH2h(insights.h2hDetails, players, matchNumber, matchDate);
    await this.playerPerformanceService.processMatchWisePlayerPerformance(
      insights.info,
      insights.players,
      players,
      matchNumber,
    );
    await this.updateMatchInformation(matchInformation);
  }

  private async storeMatchInformation(insights: CricketResponse) {
    const matchInformation: MatchInformation = this.matchInformationService.createMatchInformation(insights);
    return this.matchInformationService.storeMatch(matchInformation);
  }

  private async updateMatchInformation(matchInformation: MatchInformation) {
    matchInformation.is_processed = true;
    const response = await this.matchInformationService.updateMatchInformation(matchInformation);
    return response;
  }

  private async processJsonFiles(dir: string): Promise<any> {
    const response: any = {};
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      try {
        if (path.extname(file) === '.json') {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          const matchNumber = file.split('.json')[0];
          const numericMatchNumber = matchNumber.replace(/\D/g, ''); // Remove all non-numeric characters
          data.meta.match_number = numericMatchNumber;
          await this.processMatch(data);
          response[file.split('.json')[0]] = true;
        }
      } catch (error) {
        this.logger.error(`Error occured in processing ${filePath} ${JSON.stringify(error)} ${error}`);
        response[file.split('.json')[0]] = false;
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
