import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenueService } from './venue.service';
import { Venues } from './venue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venues])],
  providers: [VenueService],
  exports: [VenueService],
})
export class VenueModule {}
