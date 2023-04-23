import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerService } from './player.service';
import { Players } from './player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Players])],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
