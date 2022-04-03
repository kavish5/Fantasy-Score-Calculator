import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CricketService } from './cricket.service';
import { GenerateCricketPointsDto } from './dto/calculate-cricket-points.dto';
import { CricketResponse } from './interface/cricket-response.interface';

@Controller('cricket')
export class CricketController {
  constructor(private readonly cricketService: CricketService) {}

  @Post('points')
  @UsePipes(new ValidationPipe({ transform: true }))
  async calculatePoints(@Body() data: GenerateCricketPointsDto): Promise<CricketResponse> {
    const response: CricketResponse = await this.cricketService.calculatePoints(data);
    return response;
  }
}
