import { CacheModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { CricketController } from './cricket.controller';
import { CricketService } from './cricket.service';
import { PointsCalculatorModule } from '../points-calculator';

@Module({
  imports: [
    MongooseModule.forFeature([]),
    CacheModule.register({
      ttl: 1440,
      max: 100,
    }),
    HttpModule,
    PointsCalculatorModule,
  ],
  controllers: [CricketController],
  providers: [CricketService],
  exports: [CricketService],
})
export class CricketModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configure(consumer: MiddlewareConsumer) {}
}
