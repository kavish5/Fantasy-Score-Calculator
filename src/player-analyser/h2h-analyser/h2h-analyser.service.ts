import { Injectable, Logger } from '@nestjs/common';
import { InsertResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AnalyzeMatchDto } from '../../cricket/dto/analyze-match.dto';
import { H2hMatchWise } from './h2h-match-wise.entity';
import { H2hMatchDto } from './dto/h2h-details.dto';

@Injectable()
export class H2hAnalyserService {
  private readonly logger = new Logger(H2hAnalyserService.name, { timestamp: true });

  constructor(
    @InjectRepository(H2hMatchWise)
    private h2hMatchWiseRepository: Repository<H2hMatchWise>,
  ) {}

  public calculate(matchDetails: AnalyzeMatchDto): any {
    this.logger.debug(`Calculating head to head performance for match`);
    const { innings, info } = matchDetails;
    let h2hDetails = this.generateH2hPlayerJson(info.players, info.registry);
    h2hDetails = this.getH2hScores(h2hDetails, innings, info.registry);
    return Object.values(h2hDetails);
  }

  public async processMatchWiseH2h(
    h2hDetails: H2hMatchDto[],
    players: Record<string, any>,
    matchId: number,
    matchDate: string,
  ): Promise<any> {
    const h2h: H2hMatchWise[] = [];
    for (const item of h2hDetails) {
      const data = H2hMatchWise.createInstance(item, players, matchId, matchDate);
      h2h.push(data);
    }
    const response = await this.createH2hMatchWiseRecords(h2h);
    return response;
  }

  private generateH2hPlayerJson(players: Record<string, any>, registry: Record<string, any>) {
    const playerJson: Record<string, any> = {};
    const teams = Object.keys(players);
    const firstTeam = players[teams[0]];
    const secondTeam = players[teams[1]];
    for (const firstTeamPlayer of firstTeam) {
      const firstTeamPlayerId = registry.people[firstTeamPlayer];
      for (const secondTeamPlayer of secondTeam) {
        const secondTeamPlayerId = registry.people[secondTeamPlayer];
        playerJson[`${firstTeamPlayerId}-${secondTeamPlayerId}`] = {
          batterId: firstTeamPlayerId,
          batterName: firstTeamPlayer,
          bowlerId: secondTeamPlayerId,
          bowlerName: secondTeamPlayer,
          runs: 0,
          balls: 0,
          wicket: 0,
        };
      }
    }
    for (const secondTeamPlayer of secondTeam) {
      const secondTeamPlayerId = registry.people[secondTeamPlayer];
      for (const firstTeamPlayer of firstTeam) {
        const firstTeamPlayerId = registry.people[firstTeamPlayer];
        playerJson[`${secondTeamPlayerId}-${firstTeamPlayerId}`] = {
          batterId: secondTeamPlayerId,
          batterName: secondTeamPlayer,
          bowlerId: firstTeamPlayerId,
          bowlerName: firstTeamPlayer,
          runs: 0,
          balls: 0,
          wicket: 0,
        };
      }
    }
    return playerJson;
  }

  private getH2hScores(h2hDetails: Record<string, any>, innings: Record<string, any>, registry: Record<string, any>) {
    let firstInning = innings[0] ? innings[0].overs : [];
    let secondInning = innings[1] ? innings[1].overs : [];
    if (firstInning.length > 0) {
      h2hDetails = this.calculateH2hScore(h2hDetails, firstInning, registry);
    }
    if (secondInning.length > 0) {
      h2hDetails = this.calculateH2hScore(h2hDetails, secondInning, registry);
    }
    h2hDetails = this.discardEmptyMatchups(h2hDetails);
    return h2hDetails;
  }

  private calculateH2hScore(
    h2hDetails: Record<string, any>,
    inningsDetail: Record<string, any>[],
    registry: Record<string, any>,
  ) {
    for (const over of inningsDetail) {
      const { deliveries } = over;
      for (const delivery of deliveries) {
        const { batter, bowler, runs, wickets } = delivery;
        const batterId = registry.people[batter];
        const bowlerId = registry.people[bowler];
        const h2hKey = `${batterId}-${bowlerId}`;
        h2hDetails[h2hKey].balls += 1;
        h2hDetails[h2hKey].runs += runs.batter;
        if (wickets) {
          const wicket = wickets[0];
          if (
            wicket.kind !== 'run out' &&
            wicket.kind !== 'retired hurt' &&
            wicket.kind !== 'retired' &&
            wicket.kind !== 'obstructing the field' &&
            wicket.kind !== 'hit wicket'
          ) {
            h2hDetails[h2hKey].wicket += wickets.length;
          }
        }
      }
    }
    return h2hDetails;
  }

  private discardEmptyMatchups(h2hDetails: Record<string, any>) {
    const nonEmptyMatchups: Record<string, any> = {};
    const keys = Object.keys(h2hDetails);
    for (const key of keys) {
      if (h2hDetails[key].balls !== 0) {
        nonEmptyMatchups[key] = h2hDetails[key];
      }
    }
    return nonEmptyMatchups;
  }

  private async createH2hMatchWiseRecords(h2hDetails: H2hMatchWise[]): Promise<InsertResult> {
    return await this.h2hMatchWiseRepository.insert(h2hDetails);
  }
}
