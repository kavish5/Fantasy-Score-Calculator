import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Players } from './player.entity';
import { groupedForms } from '../../shared/providers/utility.provider';

@Injectable()
export class PlayerService {
  private readonly logger = new Logger(PlayerService.name, { timestamp: true });

  constructor(
    @InjectRepository(Players)
    private playersRepository: Repository<Players>,
  ) {}

  public async getPlayers(): Promise<any> {
    const playersList = await this.findAll();
    const players = groupedForms(playersList, 'player_id');
    this.logger.debug(`List of players: ${players}`);
    return players;
  }

  private async findAll(): Promise<Players[]> {
    // TODO need to cache the response
    return this.playersRepository.find();
  }
}
