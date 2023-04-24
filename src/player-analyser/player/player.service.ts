import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Players } from './player.entity';
import { groupedForms } from '../../shared/providers/utility.provider';
import _ from 'lodash';

@Injectable()
export class PlayerService {
  private readonly logger = new Logger(PlayerService.name, { timestamp: true });

  constructor(
    @InjectRepository(Players)
    private playersRepository: Repository<Players>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async getPlayers(): Promise<any> {
    const playersList = await this.findAll();
    const players = groupedForms(playersList, 'player_id');
    this.logger.debug(`Total players: ${_.size(players)}`);
    return players;
  }

  private async findAll(): Promise<Players[]> {
    const cacheKey = `all_players`;
    let players = await this.cacheManager.get<Players[]>(cacheKey);

    if (!players) {
      players = await this.playersRepository.find();
      await this.cacheManager.set(cacheKey, players);
    }

    return players;
  }
}
