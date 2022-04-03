import { Inject, Injectable, Logger } from '@nestjs/common';
import fs from 'fs';
import { GenerateCricketPointsDto } from 'src/cricket/dto/calculate-cricket-points.dto';
import { DefaultPointsCalculatorService } from './default-points-calculator';
import { strategyTypeConfigMissingError } from './points-calculator.error';

@Injectable()
export class PointsCalculatorService {
  private readonly logger = new Logger(PointsCalculatorService.name, { timestamp: true });

  constructor(
    @Inject(DefaultPointsCalculatorService)
    private readonly defaultPointsCalculatorService: DefaultPointsCalculatorService,
  ) {}

  public async defaultCricketPointsCalculation(matchDetails: GenerateCricketPointsDto): Promise<any> {
    this.logger.debug(`Calculating cricket match points for ${JSON.stringify(matchDetails)}`);
    if (matchDetails.players.length === 0) {
      return matchDetails;
    }
    const configPath = `src/shared/configurations/${matchDetails.strategy}/${matchDetails.type}/configuration.json`;
    if (!fs.existsSync(configPath)) {
      throw strategyTypeConfigMissingError(matchDetails.strategy, matchDetails.type);
    }
    const configurations = fs.readFileSync(configPath, 'utf8');
    this.logger.debug(`Configurations: ${JSON.stringify(JSON.parse(configurations))}`);
    const response = this.defaultPointsCalculatorService.calculateDefaultPoints(
      matchDetails,
      JSON.parse(configurations),
    );
    return response;
  }
}
