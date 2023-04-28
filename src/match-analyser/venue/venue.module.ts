import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenueService } from './venue.service';
import { Venues } from './venue.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 15000,
      max: 100,
    }),
    TypeOrmModule.forFeature([Venues]),
  ],
  providers: [VenueService],
  exports: [VenueService],
})
export class VenueModule {}
