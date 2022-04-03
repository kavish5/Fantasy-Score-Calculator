import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MatchType } from '../enum/match-type.enum';
import { MultiplierType } from '../enum/multiplier-type.enum';
import { RoleType } from '../enum/role-type.enum';
import { StrategyType } from '../enum/strategy-type.enum';

export class RunoutDetails {
  @IsNotEmpty()
  @IsNumber()
  direct: number = 0;

  @IsNotEmpty()
  @IsNumber()
  indirect: number = 0;
}

export class BattingDetails {
  @IsNotEmpty()
  @IsNumber()
  runs: number = 0;

  @IsNotEmpty()
  @IsNumber()
  balls: number = 0;

  @IsNotEmpty()
  @IsNumber()
  fours: number = 0;

  @IsNotEmpty()
  @IsNumber()
  sixes: number = 0;

  @IsNotEmpty()
  @IsBoolean()
  isBatting: boolean = false;

  @IsNotEmpty()
  @IsBoolean()
  isDismissed: boolean = false;
}

export class BowlingDetails {
  @IsNotEmpty()
  @IsNumber()
  wickets: number = 0;

  @IsNotEmpty()
  @IsNumber()
  balls: number = 0;

  @IsNotEmpty()
  @IsNumber()
  runs: number = 0;

  @IsNotEmpty()
  @IsNumber()
  lbws: number = 0;

  @IsNotEmpty()
  @IsNumber()
  bowled: number = 0;

  @IsNotEmpty()
  @IsNumber()
  maidens: number = 0;
}

export class FieldingDetails {
  @IsNotEmpty()
  @IsNumber()
  catches: number = 0;

  @IsNotEmpty()
  runout: RunoutDetails;

  @IsNotEmpty()
  @IsNumber()
  stumpings: number = 0;
}

export class PlayerDetails {
  @IsNotEmpty()
  @IsString()
  playerId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(RoleType)
  role: RoleType;

  @IsNotEmpty()
  @IsEnum(MultiplierType)
  multiplier: MultiplierType;

  @IsNotEmpty()
  @IsBoolean()
  isPlaying: boolean = false;

  @IsNotEmpty()
  batting: BattingDetails;

  @IsNotEmpty()
  bowling: BowlingDetails;

  @IsNotEmpty()
  fielding: FieldingDetails;

  @IsNumber()
  accumulatedPoints: number = 0;

  @IsNumber()
  points: number = 0;
}

export class GenerateCricketPointsDto {
  @IsNotEmpty()
  @IsNumber()
  matchId: number;

  @IsNotEmpty()
  @IsEnum(MatchType)
  type: MatchType;

  @IsNotEmpty()
  @IsEnum(StrategyType)
  strategy: string;

  @IsNotEmpty()
  players: PlayerDetails[];
}
