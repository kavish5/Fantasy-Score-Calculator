import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class H2hMatchDto {
  @IsNotEmpty()
  @IsString()
  batterId: string;

  @IsNotEmpty()
  @IsString()
  batterName: string;

  @IsNotEmpty()
  @IsString()
  bowlerId: string;

  @IsNotEmpty()
  @IsString()
  bowlerName: string;

  @IsNotEmpty()
  @IsNumber()
  runs: number;

  @IsNotEmpty()
  @IsNumber()
  balls: number;

  @IsNotEmpty()
  @IsNumber()
  wicket: number;
}
