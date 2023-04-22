import { Injectable, Logger } from '@nestjs/common';
import { AnalyzeMatchDto } from 'src/cricket/dto/analyze-match.dto';
import { PlayersPerformance } from './player-performance.entity';
import { InsertResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlayerPerformanceService {
  private readonly logger = new Logger(PlayerPerformanceService.name, { timestamp: true });

  constructor(
    @InjectRepository(PlayersPerformance)
    private playersPerformanceRepository: Repository<PlayersPerformance>,
  ) {}

  public calculate(matchDetails: AnalyzeMatchDto): any {
    this.logger.debug(`Calculating players performance for match`);
    const { innings, info } = matchDetails;
    let playerJson = this.generatePlayerJson(info.players, info.registry, info.toss);
    innings.forEach((inning) => {
      if (inning && inning.overs.length > 0) {
        playerJson = this.calculateOverScore(inning.overs, playerJson);
      }
    });
    const players = this.deriveAttributes(Object.values(playerJson));
    return players;
  }

  public async processMatchWisePlayerPerformance(
    matchDetails: Record<string, any>[],
    players: Record<string, any>,
    matchId: number,
    matchDate: string,
  ): Promise<any> {
    const playersPerformance: PlayersPerformance[] = [];
    for (const item of matchDetails) {
      const data = this.getPlayerPerformanceJson(item, players, matchId, matchDate);
      playersPerformance.push(data);
    }
    const response = await this.createPlayersPerformance(playersPerformance);
    return response;
  }

  private generatePlayerJson(players: Record<string, any>, registry: Record<string, any>, toss: Record<string, any>) {
    const playerJson: Record<string, any> = {};

    const battingPositions: Record<string, number> = {};
    const getBattingPosition = (team: string) => battingPositions[team] ?? 1;
    const updateBattingPosition = (team: string) => (battingPositions[team] = getBattingPosition(team) + 1);

    Object.entries(players).forEach(([team, teamPlayers]) => {
      teamPlayers.forEach((player: string) => {
        const isBattingFirst =
          (toss.decision === 'bat' && team === toss.winner) || (toss.decision === 'field' && team !== toss.winner);
        const isBowlingFirst =
          (toss.decision === 'field' && team === toss.winner) || (toss.decision === 'bat' && team !== toss.winner);

        playerJson[player] = {
          id: registry.people[player],
          name: player,
          battingPosition: getBattingPosition(team),
          batFirst: isBattingFirst,
          bowlFirst: isBowlingFirst,
          isPlaying: true,
          batting: {
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            isDismissed: false,
          },
          bowling: {
            wickets: 0,
            balls: 0,
            runs: 0,
            lbws: 0,
            bowled: 0,
            maidens: 0,
          },
          fielding: {
            catches: 0,
            runout: {
              direct: 0,
              indirect: 0,
            },
            stumpings: 0,
          },
        };

        updateBattingPosition(team);
      });
    });

    return playerJson;
  }

  private deriveAttributes(players: Record<string, any>[]) {
    for (let player of players) {
      const { batting, bowling } = player;
      if (batting) {
        const { runs, balls, fours, sixes, isDismissed } = batting;
        batting.hardHittingAbility = this.calculateHardHittingAbility(balls, fours, sixes);
        batting.isFinisher = this.calculateIsFinisher(balls, isDismissed);
        batting.strikeRate = this.calculateStrikeRate(runs, balls);
        batting.runningBetweenWickets = this.calculateRunningBetweenWickets(runs, balls, fours, sixes);
      }
      if (bowling) {
        const { wickets, balls, runs } = bowling;
        bowling.perBallAverage = this.calculatePerBallAverage(balls, runs);
        bowling.wicketTakingAbility = this.calculateWicketTakingAbility(wickets, balls);
      }
    }
    return players;
  }

  private calculateHardHittingAbility(balls: number, fours: number, sixes: number): number {
    return balls > 0 ? (fours * 4 + sixes * 6) / balls : -1;
  }

  private calculateIsFinisher(balls: number, isDismissed: boolean): number {
    return balls > 0 ? (!isDismissed ? 1 : 0) : -1;
  }

  private calculateStrikeRate(runs: number, balls: number): number {
    return balls > 0 ? runs / balls : -1;
  }

  private calculateRunningBetweenWickets(runs: number, balls: number, fours: number, sixes: number): number {
    return balls > 0 ? runs - (fours * 4 + sixes * 6) / balls - (fours + sixes) : -1;
  }

  private calculatePerBallAverage(balls: number, runs: number): number {
    return balls > 0 ? runs / balls : -1;
  }

  private calculateWicketTakingAbility(wickets: number, balls: number): number {
    return balls > 0 ? (wickets > 0 ? balls / wickets : 0) : -1;
  }

  private calculateOverScore(inningsDetail: Record<string, any>[], playerJson: Record<string, any>) {
    for (const over of inningsDetail) {
      const { deliveries } = over;
      for (const delivery of deliveries) {
        const { batter, bowler, wickets } = delivery;
        const { batting } = playerJson[batter];
        const { bowling, fielding } = playerJson[bowler];
        // TODO Does not have details on what kind of extras were there
        batting.balls += 1;
        batting.runs += delivery.runs.batter;
        if (delivery.runs.batter === 4) {
          batting.fours += 1;
        }
        if (delivery.runs.batter === 6) {
          batting.sixes += 1;
        }
        bowling.balls += 1;
        bowling.runs += delivery.runs.total;
        if (wickets) {
          bowling.wickets += wickets.length;
          const wicket = wickets[0];
          playerJson[wicket.player_out].batting.isDismissed = true;
          if (wicket.kind === 'lbw') {
            bowling.lbws += 1;
          } else if (wicket.kind === 'bowled') {
            bowling.bowled += 1;
          } else if (wicket.kind === 'caught') {
            wicket.fielders.map((fielder: Record<string, any>) => {
              if (!fielder.substitute) {
                const { fielding } = playerJson[fielder.name];
                fielding.catches += 1;
              }
            });
          } else if (wicket.kind === 'run out' && wicket.fielders) {
            bowling.wickets -= wickets.length;
            if (wicket.fielders.length === 1) {
              wicket.fielders.map((fielder: Record<string, any>) => {
                if (!fielder.substitute) {
                  const { fielding } = playerJson[fielder.name];
                  fielding.runout.direct += 1;
                }
              });
            } else {
              wicket.fielders.map((fielder: Record<string, any>) => {
                if (!fielder.substitute) {
                  const { fielding } = playerJson[fielder.name];
                  fielding.runout.indirect += 1;
                }
              });
            }
          } else if (wicket.kind === 'stumped') {
            wicket.fielders.map((fielder: Record<string, any>) => {
              if (!fielder.substitute) {
                const { fielding } = playerJson[fielder.name];
                fielding.stumpings += 1;
              }
            });
          } else if (wicket.kind === 'caught and bowled') {
            fielding.catches += 1;
          } else {
            console.log(wicket);
          }
        }
      }
    }
    return playerJson;
  }

  private getPlayerPerformanceJson(
    playerDetails: Record<string, any>,
    players: Record<string, any>,
    matchId: number,
    matchDate: string,
  ) {
    const data = new PlayersPerformance();
    return data;
  }

  private async createPlayersPerformance(playersPerformance: Record<string, any>[]): Promise<InsertResult> {
    return await this.playersPerformanceRepository.insert(playersPerformance);
  }
}
