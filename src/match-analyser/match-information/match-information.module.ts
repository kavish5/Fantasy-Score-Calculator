import { Module } from '@nestjs/common';
import { MatchInformationService } from './match-information.service';

@Module({
  imports: [],
  providers: [MatchInformationService],
  exports: [MatchInformationService],
})
export class MatchInformationModule {}
