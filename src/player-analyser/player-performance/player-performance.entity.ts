import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// CREATE TABLE player_performance (
//   id SERIAL PRIMARY KEY,
//   match_id INT,
//   city VARCHAR(50),
//   venue VARCHAR(50),
//   event_name VARCHAR(255),
//   gender VARCHAR(50),
//   match_type VARCHAR(50),
//   overs FLOAT,
//   season VARCHAR(10),
//   team_type VARCHAR(50),
//   toss_decision VARCHAR(50),
//   created_at DATETIME,
//   match_date INT,
//   match_day INT,
//   match_month INT,
//   first_team VARCHAR(50),
//   second_team VARCHAR(50),
//   batting_runs INT,
//   batting_balls INT,
//   batting_fours INT,
//   batting_sixes INT,
//   batting_is_dismissed BOOLEAN,
//   batting_hard_hitting_ability INT,
//   batting_is_finisher BOOLEAN,
//   batting_strike_rate INT,
//   batting_running_between_wickets INT,
//   bowling_wickets INT,
//   bowling_balls INT,
//   bowling_runs INT,
//   bowling_lbws INT,
//   bowling_bowled INT,
//   bowling_maidens INT,
//   bowling_consistency INT,
//   bowling_wicket_taking_ability INT,
//   fielding_catches INT,
//   fielding_runout_direct INT,
//   fielding_runout_indirect INT,
//   fielding_stumpings INT,
//   dream11_points INT,
//   dream11_accumulated_points INT,
//   dream11_is_top_performer BOOLEAN,
//   dream11_is_in_dt BOOLEAN,
//   dream11_dt_rank INT,
//   player_id VARCHAR(50),
//   player_name VARCHAR(50),
//   batting_position INT,
//   bat_first BOOLEAN,
//   bowl_first BOOLEAN,
//   is_playing BOOLEAN,
//   batting_style VARCHAR(50),
//   bowling_style VARCHAR(50),
//   event_stage VARCHAR(50)
// );

@Entity({
  name: 'player_performance',
})
export class PlayersPerformance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  match_id: number;

  @Column({ type: 'varchar', length: 50 })
  city: string;

  @Column({ type: 'varchar', length: 50 })
  venue: string;

  @Column()
  event_name: string;

  @Column({ type: 'varchar', length: 50 })
  gender: string;

  @Column({ type: 'varchar', length: 50 })
  match_type: string;

  @Column({ type: 'float' })
  overs: number;

  @Column({ type: 'varchar', length: 10 })
  season: string;

  @Column({ type: 'varchar', length: 50 })
  team_type: string;

  @Column({ type: 'varchar', length: 50 })
  toss_decision: string;

  @Column({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'int' })
  match_date: number;

  @Column({ type: 'int' })
  match_day: number;

  @Column({ type: 'int' })
  match_month: number;

  @Column({ type: 'varchar', length: 50 })
  first_team: string;

  @Column({ type: 'varchar', length: 50 })
  second_team: string;

  @Column({ type: 'int' })
  batting_runs: number;

  @Column({ type: 'int' })
  batting_balls: number;

  @Column({ type: 'int' })
  batting_fours: number;

  @Column({ type: 'int' })
  batting_sixes: number;

  @Column({ type: 'boolean' })
  batting_is_dismissed: boolean;

  @Column({ type: 'int' })
  batting_hard_hitting_ability: number;

  @Column({ type: 'boolean' })
  batting_is_finisher: boolean;

  @Column({ type: 'int' })
  batting_strike_rate: number;

  @Column({ type: 'int' })
  batting_running_between_wickets: number;

  @Column({ type: 'int' })
  bowling_wickets: number;

  @Column({ type: 'int' })
  bowling_balls: number;

  @Column({ type: 'int' })
  bowling_runs: number;

  @Column({ type: 'int' })
  bowling_lbws: number;

  @Column({ type: 'int' })
  bowling_bowled: number;

  @Column({ type: 'int' })
  bowling_maidens: number;

  @Column({ type: 'int' })
  bowling_consistency: number;

  @Column({ type: 'int' })
  bowling_wicket_taking_ability: number;

  @Column({ type: 'int' })
  fielding_catches: number;

  @Column({ type: 'int' })
  fielding_runout_direct: number;

  @Column({ type: 'int' })
  fielding_runout_indirect: number;

  @Column({ type: 'int' })
  fielding_stumpings: number;

  @Column({ type: 'int' })
  dream11_points: number;

  @Column({ type: 'int' })
  dream11_accumulated_points: number;

  @Column({ type: 'boolean' })
  dream11_is_top_performer: boolean;

  @Column({ type: 'boolean' })
  dream11_is_in_dt: boolean;

  @Column({ type: 'int' })
  dream11_dt_rank: number;

  @Column({ type: 'varchar', length: 50 })
  player_id: string;

  @Column({ type: 'varchar', length: 50 })
  player_name: string;

  @Column({ type: 'int' })
  batting_position: number;

  @Column({ type: 'boolean' })
  bat_first: boolean;

  @Column({ type: 'boolean' })
  bowl_first: boolean;

  @Column({ type: 'boolean' })
  is_playing: boolean;

  @Column({ type: 'varchar', length: 50 })
  batting_style: string;

  @Column({ type: 'varchar', length: 50 })
  bowling_style: string;

  @Column({ type: 'varchar', length: 50 })
  event_stage: string;
}
