import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerService } from './player.service';
import { Players } from './player.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 15000,
      max: 100,
    }),
    TypeOrmModule.forFeature([Players]),
  ],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
