import { Inject, Injectable, Logger } from '@nestjs/common';
import { PointsCalculatorService } from 'src/points-calculator';
import { GenerateCricketPointsDto } from './dto/calculate-cricket-points.dto';
import { CricketResponse } from './interface/cricket-response.interface';

@Injectable()
export class CricketService {
  private readonly logger = new Logger(CricketService.name, {
    timestamp: true,
  });

  constructor(@Inject(PointsCalculatorService) private readonly pointCalculatorService: PointsCalculatorService) {}

  public async calculatePoints(matchDetails: GenerateCricketPointsDto): Promise<CricketResponse> {
    try {
      const cricketDocument = await this.getCalculatedPoints(matchDetails);
      return cricketDocument;
    } catch (error) {
      this.logger.error(`Error occurred in calculatePoints function: `, error);
      throw error;
    }
  }

  private async getCalculatedPoints(matchDetails: GenerateCricketPointsDto): Promise<CricketResponse> {
    try {
      switch (matchDetails.strategy) {
        default:
          const response = await this.pointCalculatorService.defaultCricketPointsCalculation(matchDetails);
          return response;
      }
      return matchDetails;
    } catch (error) {
      this.logger.error(
        `Error occured on calculating cricket match points for ${JSON.stringify(matchDetails)}: ${error}`,
      );
      throw error;
    }
  }
}
