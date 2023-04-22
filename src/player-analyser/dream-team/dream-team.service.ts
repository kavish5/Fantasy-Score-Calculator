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
      strategy.fantasyScore.players = this.rankPlayers(strategy.fantasyScore.players);
    }
    return { fantasyScores };
  }

  private rankPlayers(players: Record<string, any>) {
    const sortedPlayers = _.orderBy(players, 'accumulatedPoints', 'desc');
    const maxCapCount = 3;
    const maxDtCount = 11;

    sortedPlayers.forEach((player, index) => {
      player.isTopPerformer = index <= maxCapCount;
      player.isInDt = index <= maxDtCount;
      player.rank = index;
    });

    return _.orderBy(sortedPlayers, ['bat_first', 'batting_position'], ['desc', 'asc']);
  }
}
