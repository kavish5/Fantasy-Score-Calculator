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
  async calculatePoints(@Body() data: GeneratePointsDto): Promise<CricketResponse> {
    const response: CricketResponse = this.cricketService.calculatePoints(data);
    return response;
  }

  @Post('process/cricsheet')
  @UsePipes(new ValidationPipe({ transform: true }))
  async processCricsheet(@Body('url') url: string): Promise<CricketResponse> {
    const response: CricketResponse = this.cricketService.processCricsheet(url);
    return response;
  }

  @Post('analyse/t20')
  @UsePipes(new ValidationPipe({ transform: true }))
  async analyzeMatch(@Body() data: AnalyzeMatchDto): Promise<CricketResponse> {
    const response: CricketResponse = await this.cricketService.analyzeMatch(data);
    return response;
  }

  @Post('process/t20')
  @UsePipes(new ValidationPipe({ transform: true }))
  async processMatch(@Body() data: AnalyzeMatchDto): Promise<CricketResponse> {
    const response: CricketResponse = await this.cricketService.processMatch(data);
    return response;
  }
}
