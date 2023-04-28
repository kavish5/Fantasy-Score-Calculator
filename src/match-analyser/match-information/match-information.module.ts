import { Module } from '@nestjs/common';
import { MatchInformationService } from './match-information.service';
import { MatchInformation } from './match-information.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MatchInformation])],
  providers: [MatchInformationService],
  exports: [MatchInformationService],
})
export class MatchInformationModule {}
