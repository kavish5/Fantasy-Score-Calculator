import { Injectable, Logger } from '@nestjs/common';
import _ from 'lodash';

@Injectable()
export class DreamTeamService {
  private readonly logger = new Logger(DreamTeamService.name, { timestamp: true });

  constructor() {}

  public calculate(matchDetails: Record<string, any>): any {
    this.logger.debug(`Calculating captain/vice-captain dream team performance for match`);
    const { fantasyScores } = matchDetails;
    for (const strategy of fantasyScores) {
      strategy.fantasyScore.players = this.checkAccumulatedPoints(strategy.fantasyScore.players);
    }
    return { fantasyScores };
  }

  private checkAccumulatedPoints(players: Record<string, any>) {
    const sortPlayersByPoints = _.orderBy(players, 'accumulatedPoints', 'desc');
    const maxCapCount = 3;
    const maxDtCount = 11;
    let index = 0;
    for (const player of sortPlayersByPoints) {
      player.isTopPerformer = index <= maxCapCount;
      player.isInDt = index <= maxDtCount;
      index += 1;
    }
    return _.orderBy(sortPlayersByPoints, ['bat_first', 'batting_position'], ['desc', 'asc']);
  }
}
