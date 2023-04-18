import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
  name: 'player_performance',
})
export class PlayersPerformance {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ type: 'varchar', length: 50 })
  player_id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

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
