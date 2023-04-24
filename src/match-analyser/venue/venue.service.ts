import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import _ from 'lodash';
import { Venues } from './venue.entity';
import { venueUnavailableError } from './venue.error';

@Injectable()
export class VenueService {
  private readonly logger = new Logger(VenueService.name, { timestamp: true });

  constructor(
    @InjectRepository(Venues)
    private venuesRepository: Repository<Venues>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async getMatchingVenue(matchVenue: string, venues?: Record<string, any>) {
    if (!venues) {
      venues = await this.getVenues();
    }

    if (!venues[matchVenue]) {
      throw venueUnavailableError(matchVenue);
    }
    return venues[matchVenue];
  }

  private async getVenues(): Promise<any> {
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
      for (const alias of [venue.venue_alias_a, venue.venue_alias_b, venue.venue_alias_c]) {
        if (_.size(alias) > 0) {
          result[alias] = data;
        }
      }
    }
    return result;
  }

  private async findAll(): Promise<Venues[]> {
    const cacheKey = `all_venues`;
    let venues = await this.cacheManager.get<Venues[]>(cacheKey);

    if (!venues) {
      venues = await this.venuesRepository.find();
      await this.cacheManager.set(cacheKey, venues);
    }

    return venues;
  }
}
