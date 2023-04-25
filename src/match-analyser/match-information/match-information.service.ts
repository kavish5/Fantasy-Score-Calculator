import { Injectable, Logger } from '@nestjs/common';
import { AnalyzeMatchDto, InfoDetails } from '../../cricket/dto/analyze-match.dto';

@Injectable()
export class MatchInformationService {
  private readonly logger = new Logger(MatchInformationService.name, { timestamp: true });

  constructor() {}

  public calculate(matchDetails: AnalyzeMatchDto): any {
    this.logger.debug(`Generating base information for match`);
    matchDetails.info = this.deriveMatchInformation(matchDetails.info);
    return matchDetails;
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
