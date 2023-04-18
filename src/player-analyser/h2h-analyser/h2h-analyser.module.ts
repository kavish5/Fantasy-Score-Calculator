import { Module } from '@nestjs/common';
import { H2hAnalyserService } from './h2h-analyser.service';
import { H2hMatchWise } from './h2h-match-wise.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([H2hMatchWise])],
  providers: [H2hAnalyserService],
  exports: [H2hAnalyserService],
})
export class H2hAnalyserModule {}
