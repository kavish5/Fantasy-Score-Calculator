import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'match_information',
})
export class MatchInformation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  match_id: number;

  @Column({ type: 'boolean' })
  is_processed: boolean;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 200 })
  venue: string;

  @Column({ type: 'varchar', length: 100 })
  event_name: string;

  @Column({ type: 'varchar', length: 100 })
  event_stage: string;

  @Column({ enum: ['male', 'female'], type: 'varchar', length: 10 })
  gender: string;

  @Column({ type: 'varchar', length: 20 })
  match_type: string;

  @Column({ type: 'int' })
  overs: number;

  @Column({ type: 'varchar', length: 10 })
  season: string;

  @Column({ type: 'varchar', length: 100 })
  team_type: string;

  @Column({ type: 'varchar', length: 100 })
  toss_decision: string;

  @Column({ type: 'date' })
  match_at: Date;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'varchar', length: 100 })
  first_team: string;

  @Column({ type: 'varchar', length: 100 })
  second_team: string;

  @Column({ type: 'int' })
  first_powerplay_runs: number;

  @Column({ type: 'int' })
  first_powerplay_wickets: number;

  @Column({ type: 'int' })
  first_middleovers_runs: number;

  @Column({ type: 'int' })
  first_middleovers_wickets: number;

  @Column({ type: 'int' })
  first_deathovers_runs: number;

  @Column({ type: 'int' })
  first_deathovers_wickets: number;

  @Column({ type: 'int' })
  second_powerplay_runs: number;

  @Column({ type: 'int' })
  second_powerplay_wickets: number;

  @Column({ type: 'int' })
  second_middleovers_runs: number;

  @Column({ type: 'int' })
  second_middleovers_wickets: number;

  @Column({ type: 'int' })
  second_deathovers_runs: number;

  @Column({ type: 'int' })
  second_deathovers_wickets: number;
}
