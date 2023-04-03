import { Module } from '@nestjs/common';
import { H2hAnalyserService } from './h2h-analyser.service';

@Module({
  imports: [],
  providers: [H2hAnalyserService],
  exports: [H2hAnalyserService],
})
export class H2hAnalyserModule {}
