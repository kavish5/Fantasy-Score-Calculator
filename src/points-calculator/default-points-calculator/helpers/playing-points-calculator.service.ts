import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PlayingPointsCalculatorService {
  private readonly logger = new Logger(PlayingPointsCalculatorService.name, { timestamp: true });

  public calculate(isPlaying: boolean, pointsConfigurations: Record<string, any>): number {
    try {
      let points: number = 0;
      if (!pointsConfigurations) {
        return points;
      }
      return isPlaying ? pointsConfigurations.playing : pointsConfigurations.notPlaying;
    } catch (error) {
      this.logger.error(
        `Error occurred for calculate role based points calculation: ${error} ${JSON.stringify(error)}`,
      );
      throw error;
    }
  }
}
