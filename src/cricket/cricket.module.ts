import { CacheModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CricketController } from './cricket.controller';
import { CricketService } from './cricket.service';
import { PlayerPerformanceModule } from '../player-analyser/player-performance';
import { ScoreModule } from '../fantasy-analyser/score';
import { OverByOverModule } from '../match-analyser/over-by-over';
import { PhaseModule } from '../match-analyser/phase-wise';
import { H2hAnalyserModule } from '../player-analyser/h2h-analyser';
import { DreamTeamModule } from '../player-analyser/dream-team';
import { BaseInfoModule } from '../match-analyser/base-info';
import { PlayerModule } from '../player-analyser/player';
import { VenueModule } from '../match-analyser/venue';

@Module({
  imports: [
    CacheModule.register({
      ttl: 15000,
      max: 100,
    }),
    HttpModule,
    BaseInfoModule,
    DreamTeamModule,
    H2hAnalyserModule,
    OverByOverModule,
    PhaseModule,
    PlayerPerformanceModule,
    ScoreModule,
    PlayerModule,
    VenueModule,
  ],
  controllers: [CricketController],
  providers: [CricketService],
  exports: [CricketService],
})
export class CricketModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configure(consumer: MiddlewareConsumer) {}
}
