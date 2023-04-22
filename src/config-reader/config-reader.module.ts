import { Module } from '@nestjs/common';
import { ConfigReaderService } from './config-reader.service';

@Module({
  imports: [ConfigReaderModule],
  providers: [ConfigReaderService],
  exports: [ConfigReaderService],
})
export class ConfigReaderModule {}
