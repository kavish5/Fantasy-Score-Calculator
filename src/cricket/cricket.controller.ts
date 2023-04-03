import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CricketService } from './cricket.service';
import { GeneratePointsDto } from './dto/calculate-points.dto';
import { AnalyzeMatchDto } from './dto/analyze-match.dto';
import { CricketResponse } from './interface/cricket-response.interface';

@Controller('cricket')
export class CricketController {
  constructor(private readonly cricketService: CricketService) {}

  @Post('points')
  @UsePipes(new ValidationPipe({ transform: true }))
  calculatePoints(@Body() data: GeneratePointsDto): CricketResponse {
    const response: CricketResponse = this.cricketService.calculatePoints(data);
    return response;
  }

  @Post('analyse/t20')
  @UsePipes(new ValidationPipe({ transform: true }))
  async analyzeMatch(@Body() data: AnalyzeMatchDto): Promise<CricketResponse> {
    const response: CricketResponse = await this.cricketService.analyzeMatch(data);
    return response;
  }
}
