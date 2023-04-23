import { Inject, Injectable, Logger } from '@nestjs/common';
import { GeneratePointsDto, PlayerDetails } from '../../cricket/dto/calculate-points.dto';
import {
  BattingPointsCalculatorService,
  BowlingPointsCalculatorService,
  FieldingPointsCalculatorService,
  PlayingPointsCalculatorService,
  RolePointsCalculatorService,
} from './helpers';

@Injectable()
export class DefaultPointsCalculatorService {
  private readonly logger = new Logger(DefaultPointsCalculatorService.name, { timestamp: true });

  constructor(
    @Inject(BattingPointsCalculatorService)
    private readonly battingPointsCalculatorService: BattingPointsCalculatorService,
    @Inject(BowlingPointsCalculatorService)
    private readonly bowlingPointsCalculatorService: BowlingPointsCalculatorService,
    @Inject(FieldingPointsCalculatorService)
    private readonly fieldingPointsCalculatorService: FieldingPointsCalculatorService,
    @Inject(PlayingPointsCalculatorService)
    private readonly playingPointsCalculatorService: PlayingPointsCalculatorService,
    @Inject(RolePointsCalculatorService)
    private readonly rolePointsCalculatorService: RolePointsCalculatorService,
  ) {}

  public calculateDefaultPoints(
    matchDetails: GeneratePointsDto,
    configurations: Record<string, any>,
  ): Record<string, any> {
    try {
      for (const player of matchDetails.players) {
        try {
          const totalPoints = this.calculateTotalPoints(player, configurations);
          const accumulatedPoints = this.rolePointsCalculatorService.calculate(
            totalPoints,
            player.multiplier,
            configurations.other.multiplier,
          );

          this.logger.debug(`Total accumulated points for ${player.name}: ${JSON.stringify(accumulatedPoints)}`);
          player.points = totalPoints;
          player.accumulatedPoints = accumulatedPoints;
        } catch (error) {
          this.logger.error(
            `Error occurred for calculate default points calculation for player ${
              player.name
            }: ${error} ${JSON.stringify(error)}`,
          );
        }
      }
      return matchDetails;
    } catch (error) {
      this.logger.error(`Error occurred for calculate default points calculation: ${error} ${JSON.stringify(error)}`);
      throw error;
    }
  }

  private calculateTotalPoints(player: PlayerDetails, configurations: Record<string, any>) {
    const battingPoints = this.battingPointsCalculatorService.calculate(
      player.batting,
      player.role,
      configurations.batting,
    );
    const bowlingPoints = this.bowlingPointsCalculatorService.calculate(player.bowling, configurations.bowling);
    const fieldingPoints = this.fieldingPointsCalculatorService.calculate(player.fielding, configurations.fielding);
    const playingPoints = this.playingPointsCalculatorService.calculate(
      player.isPlaying,
      configurations.other.availability,
    );

    this.logger.debug(
      `${player.name} has accumulated ${JSON.stringify(battingPoints)} batting points, ${JSON.stringify(
        bowlingPoints,
      )} bowling points, ${JSON.stringify(fieldingPoints)} fielding points and ${JSON.stringify(
        playingPoints,
      )} playing points`,
    );

    return battingPoints + bowlingPoints + fieldingPoints + playingPoints;
  }
}
