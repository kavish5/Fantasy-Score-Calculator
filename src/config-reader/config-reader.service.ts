import { Injectable, Logger } from '@nestjs/common';
import fs from 'fs';
import { strategyTypeConfigMissingError } from './config-reader.error';

@Injectable()
export class ConfigReaderService {
  private readonly logger = new Logger(ConfigReaderService.name, { timestamp: true });

  readConfig(strategy: string, type: string): Record<string, any> {
    const configPath = `src/config-reader/configurations/${strategy}/${type}/configuration.json`;
    if (!fs.existsSync(configPath)) {
      throw strategyTypeConfigMissingError(strategy, type);
    }
    const configurations = fs.readFileSync(configPath, 'utf8');
    this.logger.debug(`Configurations: ${JSON.stringify(JSON.parse(configurations))}`);
    return JSON.parse(configurations);
  }
}
