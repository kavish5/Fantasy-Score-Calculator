import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PhaseService {
  private readonly logger = new Logger(PhaseService.name, { timestamp: true });

  constructor() {}

  public calculate(matchDetails: Record<string, any>, powerplayOversEnds: number, deathOversStart: number): any {
    this.logger.debug(`Calculating phase wise analysis for match`);
    const { innings } = matchDetails;
    const firstInning = innings[0].overs;
    const secondInning = innings[1].overs;
    innings[0] = this.calculateInningPhases(firstInning, powerplayOversEnds, deathOversStart);
    innings[1] = this.calculateInningPhases(secondInning, powerplayOversEnds, deathOversStart);

    return matchDetails;
  }

  private filterPhaseOvers(overs: any[], startOver: number, endOver: number) {
    return overs.filter((over: Record<string, any>) => over.over >= startOver && over.over < endOver);
  }

  private calculateInningPhases(overs: any[], powerplayOversEnds: number, deathOversStart: number) {
    const powerPlayOvers = this.filterPhaseOvers(overs, 0, powerplayOversEnds);
    const middleOvers = this.filterPhaseOvers(overs, powerplayOversEnds, deathOversStart);
    const deathOvers = this.filterPhaseOvers(overs, deathOversStart, Infinity);

    return {
      overs,
      powerplay: this.calculatePhaseScore(powerPlayOvers),
      middleovers: this.calculatePhaseScore(middleOvers),
      deathovers: this.calculatePhaseScore(deathOvers),
      total: this.calculatePhaseScore(overs),
    };
  }

  private calculatePhaseScore(phaseDetail: Record<string, any>[]) {
    return {
      phase_total_score: this.accumulatePhaseScores(phaseDetail, 'over_score'),
      phase_extras_score: this.accumulatePhaseScores(phaseDetail, 'over_extras'),
      phase_wickets: this.accumulatePhaseScores(phaseDetail, 'wickets'),
      phase_balls: this.accumulatePhaseScores(phaseDetail, 'over_balls'),
      phase_zeroes: this.accumulatePhaseScores(phaseDetail, 'batter_zeroes'),
      phase_ones: this.accumulatePhaseScores(phaseDetail, 'batter_ones'),
      phase_twos: this.accumulatePhaseScores(phaseDetail, 'batter_twos'),
      phase_threes: this.accumulatePhaseScores(phaseDetail, 'batter_threes'),
      phase_fours: this.accumulatePhaseScores(phaseDetail, 'batter_fours'),
      phase_sixes: this.accumulatePhaseScores(phaseDetail, 'batter_sixes'),
    };
  }

  private accumulatePhaseScores(phaseDetail: any[], prop: string): number {
    return phaseDetail.reduce((score, over) => score + over[prop], 0);
  }
}
