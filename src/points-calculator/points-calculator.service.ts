import { Inject, Injectable, Logger } from '@nestjs/common';
import { GeneratePointsDto } from '../cricket/dto/calculate-points.dto';
import { DefaultPointsCalculatorService } from './default-points-calculator';
import { ConfigReaderService } from '../config-reader';

@Injectable()
export class PointsCalculatorService {
  private readonly logger = new Logger(PointsCalculatorService.name, { timestamp: true });

  constructor(
    @Inject(DefaultPointsCalculatorService)
    private readonly defaultPointsCalculatorService: DefaultPointsCalculatorService,
    @Inject(ConfigReaderService)
    private readonly configReaderService: ConfigReaderService,
  ) {}

  public calculateCricketPoints(matchDetails: GeneratePointsDto): any {
    this.logger.debug(`Calculating cricket match points for ${JSON.stringify(matchDetails)}`);
    if (matchDetails.players.length === 0) {
      return matchDetails;
    }
    const configurations = this.configReaderService.readConfig(matchDetails.strategy, matchDetails.type);
    const response = this.defaultPointsCalculatorService.calculateDefaultPoints(matchDetails, configurations);
    return response;
  }
}
