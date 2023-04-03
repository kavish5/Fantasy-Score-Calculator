import { IsArray, IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

export class MetaDetails {
  @IsNotEmpty()
  @IsString()
  data_version: string;

  @IsNotEmpty()
  @IsString()
  created: string;

  @IsNotEmpty()
  @IsNumber()
  revision: number;
}

export class InfoDetails {
  @IsNotEmpty()
  @IsNumber()
  balls_per_over: number = 6;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsArray()
  dates: Date[];

  @IsNotEmpty()
  @IsObject()
  event?: {
    match_number: number;
    name: string;
    stage?: string;
  };

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  match_type: string;

  @IsNotEmpty()
  @IsObject()
  officials: Record<string, any>;

  @IsNotEmpty()
  @IsArray()
  players: Record<string, any>[];

  @IsNotEmpty()
  @IsObject()
  registry: {
    people: Record<string, any>;
  };

  @IsNotEmpty()
  @IsObject()
  outcome: {
    by: Record<string, any>;
    winner: string;
  };

  @IsNotEmpty()
  @IsNumber()
  overs: number;

  @IsNotEmpty()
  @IsArray()
  player_of_match: string[];

  @IsNotEmpty()
  @IsString()
  season: string;

  @IsNotEmpty()
  @IsString()
  team_type: string;

  @IsNotEmpty()
  @IsArray()
  teams: string[];

  @IsNotEmpty()
  @IsObject()
  toss: {
    decision: string;
    winner: string;
  };

  @IsNotEmpty()
  @IsString()
  venue: string;
}

export class DeliveriesDetails {
  @IsNotEmpty()
  @IsString()
  batter: string;

  @IsNotEmpty()
  @IsString()
  bowler: string;

  @IsNotEmpty()
  @IsString()
  non_striker: string;

  @IsNotEmpty()
  @IsObject()
  extras?: Record<string, any>;

  @IsNotEmpty()
  @IsObject()
  runs: Record<string, any>;
}

export class OversDetails {
  @IsNotEmpty()
  @IsNumber()
  over: number;

  @IsNotEmpty()
  @IsArray()
  deliveries: DeliveriesDetails[];

  @IsNotEmpty()
  @IsNumber()
  over_score?: number;

  @IsNotEmpty()
  @IsNumber()
  over_extras?: number;

  @IsNotEmpty()
  @IsNumber()
  over_batsman_score?: number;

  @IsNotEmpty()
  @IsNumber()
  over_balls?: number;

  @IsNotEmpty()
  @IsNumber()
  team_zeroes?: number;

  @IsNotEmpty()
  @IsNumber()
  team_ones?: number;

  @IsNotEmpty()
  @IsNumber()
  team_twos?: number;

  @IsNotEmpty()
  @IsNumber()
  team_threes?: number;

  @IsNotEmpty()
  @IsNumber()
  team_fours?: number;

  @IsNotEmpty()
  @IsNumber()
  team_sixes?: number;

  @IsNotEmpty()
  @IsNumber()
  batter_zeroes?: number;

  @IsNotEmpty()
  @IsNumber()
  batter_ones?: number;

  @IsNotEmpty()
  @IsNumber()
  batter_twos?: number;

  @IsNotEmpty()
  @IsNumber()
  batter_threes?: number;

  @IsNotEmpty()
  @IsNumber()
  batter_fours?: number;

  @IsNotEmpty()
  @IsNumber()
  batter_sixes?: number;

  @IsNotEmpty()
  @IsNumber()
  wickets?: number;
}

export class PowerplayDetails {
  @IsNotEmpty()
  @IsNumber()
  from: number;

  @IsNotEmpty()
  @IsNumber()
  to: number;

  @IsNotEmpty()
  @IsString()
  type: string;
}

export class InningsDetails {
  @IsNotEmpty()
  @IsString()
  team: string;

  @IsNotEmpty()
  @IsArray()
  overs: OversDetails[];

  @IsNotEmpty()
  @IsArray()
  powerplays: PowerplayDetails[];
}

export class AnalyzeMatchDto {
  @IsNotEmpty()
  @IsObject()
  meta: MetaDetails;

  @IsNotEmpty()
  @IsObject()
  info: InfoDetails;

  @IsNotEmpty()
  @IsArray()
  innings: InningsDetails[];
}
