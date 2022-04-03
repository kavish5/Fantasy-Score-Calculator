import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RolePointsCalculatorService {
  private readonly logger = new Logger(RolePointsCalculatorService.name, { timestamp: true });

  public calculate(points: number, position: string, pointsConfigurations: Record<string, any>): number {
    try {
      if (!pointsConfigurations || !pointsConfigurations[position] || !pointsConfigurations[position].factor) {
        return points;
      }
      return points * pointsConfigurations[position].factor;
    } catch (error) {
      this.logger.error(
        `Error occurred for calculate role based points calculation: ${error} ${JSON.stringify(error)}`,
      );
      throw error;
    }
  }
}
