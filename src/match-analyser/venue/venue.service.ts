import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venues } from './venue.entity';
import _ from 'lodash';

@Injectable()
export class VenueService {
  private readonly logger = new Logger(VenueService.name, { timestamp: true });

  constructor(
    @InjectRepository(Venues)
    private venuesRepository: Repository<Venues>,
  ) {}

  public async getVenues(): Promise<any> {
    const venuesList = await this.findAll();
    const venues = this.processVenues(venuesList);
    this.logger.debug(`List of venues: ${JSON.stringify(venues)}`);
    return venues;
  }

  private processVenues(venues: Venues[]) {
    const result: any = {};
    for (const venue of venues) {
      const data = {
        id: venue.id,
        city: venue.city,
        name: venue.venue,
      };
      result[venue.venue] = data;
      if (_.size(venue.venue_alias_a) > 0) {
        result[venue.venue_alias_a] = data;
      }
      if (_.size(venue.venue_alias_b) > 0) {
        result[venue.venue_alias_b] = data;
      }
      if (_.size(venue.venue_alias_c) > 0) {
        result[venue.venue_alias_c] = data;
      }
    }
    return result;
  }

  private async findAll(): Promise<Venues[]> {
    // TODO need to cache the response
    return this.venuesRepository.find();
  }
}
