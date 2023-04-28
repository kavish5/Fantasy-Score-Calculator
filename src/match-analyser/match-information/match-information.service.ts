import { Injectable, Logger } from '@nestjs/common';
import { AnalyzeMatchDto, InfoDetails } from '../../cricket/dto/analyze-match.dto';
import { MatchInformation } from './match-information.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CricketResponse } from '../../cricket/interface/cricket-response.interface';

@Injectable()
export class MatchInformationService {
  private readonly logger = new Logger(MatchInformationService.name, { timestamp: true });

  constructor(
    @InjectRepository(MatchInformation)
    private matchInformationRepository: Repository<MatchInformation>,
  ) {}

  public calculate(matchDetails: AnalyzeMatchDto): any {
    this.logger.debug(`Generating base information for match`);
    matchDetails.info = this.deriveMatchInformation(matchDetails.info);
    return matchDetails;
  }

  public createMatchInformation(insights: CricketResponse): MatchInformation {
    const { meta, info, innings } = insights;
    const matchInformation: MatchInformation = {
      match_id: meta.match_number,
      is_processed: false,
      city: info.city,
      venue: info.venue,
      event_name: info.event?.name,
      event_stage: info.event?.stage,
      gender: info.gender,
      match_type: info.match_type,
      overs: info.overs,
      season: info.season,
      team_type: info.team_type,
      toss_decision: info.toss.decision,
      match_at: new Date(info.dates[0]),
      month: new Date(info.dates[0]).getMonth(),
      first_team: info.teams[0],
      second_team: info.teams[1],
      first_powerplay_runs: innings[0].powerplay.phase_total_score,
      first_powerplay_wickets: innings[0].powerplay.phase_wickets,
      first_middleovers_runs: innings[0].middleovers.phase_total_score,
      first_middleovers_wickets: innings[0].middleovers.phase_wickets,
      first_deathovers_runs: innings[0].deathovers.phase_total_score,
      first_deathovers_wickets: innings[0].deathovers.phase_wickets,
      first_total_runs: innings[0].total.phase_total_score,
      first_total_wickets: innings[0].total.phase_wickets,
      second_powerplay_runs: innings[1].powerplay.phase_total_score,
      second_powerplay_wickets: innings[1].powerplay.phase_wickets,
      second_middleovers_runs: innings[1].middleovers.phase_total_score,
      second_middleovers_wickets: innings[1].middleovers.phase_wickets,
      second_deathovers_runs: innings[1].deathovers.phase_total_score,
      second_deathovers_wickets: innings[1].deathovers.phase_wickets,
      second_total_runs: innings[1].total.phase_total_score,
      second_total_wickets: innings[1].total.phase_wickets,
    };
    return matchInformation;
  }

  public async storeMatch(data: Record<string, any>): Promise<MatchInformation> {
    const player = await this.insertMatchInformation(data);
    return player;
  }

  private async insertMatchInformation(data: Record<string, any>): Promise<MatchInformation> {
    const matchInformation = this.matchInformationRepository.create(data);
    await this.matchInformationRepository.save(matchInformation);
    return matchInformation;
  }

  public async updateMatchInformation(data: Record<string, any>): Promise<MatchInformation> {
    const matchInformation = await this.matchInformationRepository.preload(data);
    if (!matchInformation) {
      throw new Error(`Match information with ID ${data.id} not found`);
    }
    await this.matchInformationRepository.save(matchInformation);
    return matchInformation;
  }

  private deriveMatchInformation(info: InfoDetails) {
    const matchDate = new Date(info.dates[0]);
    const details: any = {
      event_name: info.event?.name,
      event_stage: info.event?.stage,
      toss_decision: info.toss?.decision,
      toss_winner: info.toss?.winner,
      created_at: matchDate,
      days_till: Math.ceil((Date.now() - matchDate.getTime()) / (1000 * 3600 * 24)),
      date: matchDate.getDate(),
      day: matchDate.getDay() + 1,
      month: matchDate.getMonth() + 1,
      first_team: info.teams[0],
      second_team: info.teams[1],
    };
    return { ...info, ...details };
  }
}
