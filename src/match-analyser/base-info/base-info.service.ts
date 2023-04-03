import { Injectable, Logger } from '@nestjs/common';
import { AnalyzeMatchDto, InfoDetails } from '../../cricket/dto/analyze-match.dto';

@Injectable()
export class BaseInfoService {
  private readonly logger = new Logger(BaseInfoService.name, { timestamp: true });

  constructor() {}

  public calculate(matchDetails: AnalyzeMatchDto): any {
    this.logger.debug(`Generating base info for match`);
    matchDetails.info = this.deriveBaseInfo(matchDetails.info);
    return matchDetails;
  }

  private deriveBaseInfo(info: InfoDetails) {
    let details: any = {};
    details.event_name = info.event?.name;
    details.event_stage = info.event?.stage;
    details.toss_decision = info.toss?.decision;
    details.toss_winner = info.toss?.winner;
    details.created_at = info.dates[0];
    details.days_till = Math.ceil((new Date().getTime() - new Date(info.dates[0]).getTime()) / (1000 * 3600 * 24));
    details.date = new Date(info.dates[0]).getDate();
    details.day = new Date(info.dates[0]).getDay() + 1;
    details.month = new Date(info.dates[0]).getMonth() + 1;
    details.first_team = info.teams[0];
    details.second_team = info.teams[1];
    return { ...info, ...details };
  }
}
