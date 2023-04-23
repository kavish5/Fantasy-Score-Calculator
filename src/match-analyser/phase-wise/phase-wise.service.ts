import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PhaseService {
  private readonly logger = new Logger(PhaseService.name, { timestamp: true });

  constructor() {}

  public calculate(matchDetails: Record<string, any>): any {
    this.logger.debug(`Calculating phase wise analysis for match`);
    const { innings } = matchDetails;
    const firstInning = innings[0].overs;
    const secondInning = innings[1].overs;
    let firstInningPowerPlay = [];
    let secondInningPowerPlay = [];
    let firstInningMiddleOvers = [];
    let secondInningMiddleOvers = [];
    let firstInningDeathOvers = [];
    let secondInningDeathOvers = [];
    const PP_OVER_T20 = 6;
    const DO_OVER_T20 = 15;
    firstInningPowerPlay = firstInning.filter((over: Record<string, any>) => over.over < PP_OVER_T20);
    secondInningPowerPlay = secondInning.filter((over: Record<string, any>) => over.over < PP_OVER_T20);
    firstInningMiddleOvers = firstInning.filter(
      (over: Record<string, any>) => over.over >= PP_OVER_T20 && over.over <= DO_OVER_T20,
    );
    secondInningMiddleOvers = secondInning.filter(
      (over: Record<string, any>) => over.over >= PP_OVER_T20 && over.over <= DO_OVER_T20,
    );
    firstInningDeathOvers = firstInning.filter((over: Record<string, any>) => over.over > DO_OVER_T20);
    secondInningDeathOvers = secondInning.filter((over: Record<string, any>) => over.over > DO_OVER_T20);
    const powerPlayFirstInning = this.calculatePhaseScore(firstInningPowerPlay);
    const powerPlaySecondInning = this.calculatePhaseScore(secondInningPowerPlay);
    const middleOverFirstInning = this.calculatePhaseScore(firstInningMiddleOvers);
    const middleOverSecondInning = this.calculatePhaseScore(secondInningMiddleOvers);
    const deathOverFirstInning = this.calculatePhaseScore(firstInningDeathOvers);
    const deathOverSecondInning = this.calculatePhaseScore(secondInningDeathOvers);
    const totalFirstInning = this.calculatePhaseScore(firstInning);
    const totalSecondInning = this.calculatePhaseScore(secondInning);
    innings[0].powerplay = powerPlayFirstInning;
    innings[1].powerplay = powerPlaySecondInning;
    innings[0].middleovers = middleOverFirstInning;
    innings[1].middleovers = middleOverSecondInning;
    innings[0].deathovers = deathOverFirstInning;
    innings[1].deathovers = deathOverSecondInning;
    innings[0].total = totalFirstInning;
    innings[1].total = totalSecondInning;
    return matchDetails;
  }

  private calculatePhaseScore(phaseDetail: Record<string, any>[]) {
    const phaseTotalScore = phaseDetail.reduce((score, over) => {
      return score + over.over_score;
    }, 0);
    const phaseExtrasScore = phaseDetail.reduce((score, over) => {
      return score + over.over_extras;
    }, 0);
    const phaseWickets = phaseDetail.reduce((score, over) => {
      return score + over.wickets;
    }, 0);
    const phaseBalls = phaseDetail.reduce((score, over) => {
      return score + over.over_balls;
    }, 0);
    const phaseZeroes = phaseDetail.reduce((score, over) => {
      return score + over.batter_zeroes;
    }, 0);
    const phaseOnes = phaseDetail.reduce((score, over) => {
      return score + over.batter_ones;
    }, 0);
    const phaseTwos = phaseDetail.reduce((score, over) => {
      return score + over.batter_twos;
    }, 0);
    const phaseThrees = phaseDetail.reduce((score, over) => {
      return score + over.batter_threes;
    }, 0);
    const phaseFours = phaseDetail.reduce((score, over) => {
      return score + over.batter_fours;
    }, 0);
    const phaseSixes = phaseDetail.reduce((score, over) => {
      return score + over.batter_sixes;
    }, 0);
    return {
      phase_total_score: phaseTotalScore,
      phase_extras_score: phaseExtrasScore,
      phase_wickets: phaseWickets,
      phase_balls: phaseBalls,
      phase_zeroes: phaseZeroes,
      phase_ones: phaseOnes,
      phase_twos: phaseTwos,
      phase_threes: phaseThrees,
      phase_fours: phaseFours,
      phase_sixes: phaseSixes,
    };
  }
}
