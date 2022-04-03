import { Inject, Injectable, Logger } from '@nestjs/common';
import { GenerateCricketPointsDto } from 'src/cricket/dto/calculate-cricket-points.dto';
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
    matchDetails: GenerateCricketPointsDto,
    configurations: Record<string, any>,
  ): Record<string, any> {
    try {
      for (const player of matchDetails.players) {
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
        const points = battingPoints + bowlingPoints + fieldingPoints + playingPoints;
        this.logger.debug(`Total points for ${player.name}: ${JSON.stringify(points)}`);
        const accumulatedPoints = this.rolePointsCalculatorService.calculate(
          points,
          player.multiplier,
          configurations.other.multiplier,
        );
        this.logger.debug(`Total accumulated points for ${player.name}: ${JSON.stringify(accumulatedPoints)}`);
        player.points = points;
        player.accumulatedPoints = accumulatedPoints;
      }
      return matchDetails;
    } catch (error) {
      this.logger.error(`Error occurred for calculate default points calculation: ${error} ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
