import { Injectable, Logger } from '@nestjs/common';
import { AnalyzeMatchDto } from 'src/cricket/dto/analyze-match.dto';

@Injectable()
export class PlayerPerformanceService {
  private readonly logger = new Logger(PlayerPerformanceService.name, { timestamp: true });

  constructor() {}

  public calculate(matchDetails: AnalyzeMatchDto): any {
    this.logger.debug(`Calculating players performance for match`);
    const { innings, info } = matchDetails;
    let playerJson = this.generatePlayerJson(info.players, info.registry, info.toss);
    let firstInning = innings[0] ? innings[0].overs : [];
    let secondInning = innings[1] ? innings[1].overs : [];
    if (firstInning?.length > 0) {
      playerJson = this.calculateOverScore(firstInning, playerJson);
    }
    if (secondInning?.length > 0) {
      playerJson = this.calculateOverScore(secondInning, playerJson);
    }
    const players = this.deriveAttributes(Object.values(playerJson));
    return players;
  }

  private generatePlayerJson(players: Record<string, any>, registry: Record<string, any>, toss: Record<string, any>) {
    const playerJson = {};
    const teams = Object.keys(players);
    for (const team of teams) {
      let battingPosition = 1;
      for (const player of players[team]) {
        playerJson[player] = {
          id: registry.people[player],
          name: player,
          battingPosition,
          batFirst:
            (toss.decision === 'bat' && team === toss.winner) || (toss.decision === 'field' && team !== toss.winner),
          bowlFirst:
            (toss.decision === 'field' && team === toss.winner) || (toss.decision === 'bat' && team !== toss.winner),
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
        battingPosition += 1;
      }
    }
    return playerJson;
  }

  private deriveAttributes(players: Record<string, any>[]) {
    for (let player of players) {
      if (player.batting) {
        const { runs, balls, fours, sixes, isDismissed } = player.batting;
        player.batting.hardHittingAbility = balls > 0 ? (fours * 4 + sixes * 6) / balls : -1;
        player.batting.isFinisher = balls > 0 ? (!isDismissed ? 1 : 0) : -1;
        player.batting.strikeRate = balls > 0 ? runs / balls : -1;
        player.batting.runningBetweenWickets =
          balls > 0 ? runs - (fours * 4 + sixes * 6) / balls - (fours + sixes) : -1;
      }
      if (player.bowling) {
        const { wickets, balls, runs } = player.bowling;
        player.bowling.perBallAverage = balls > 0 ? runs / balls : -1;
        player.bowling.wicketTakingAbility = balls > 0 ? (wickets > 0 ? balls / wickets : 0) : -1;
      }
    }
    return players;
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
}
