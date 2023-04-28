import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// CREATE TABLE match_information (
//   id SERIAL PRIMARY KEY,
//   match_id INT,
//   is_processed BOOLEAN,
//   city VARCHAR(100),
//   venue VARCHAR(200),
//   event_name VARCHAR(100),
//   event_stage VARCHAR(100),
//   gender ENUM('male', 'female'),
//   match_type VARCHAR(20),
//   overs INT,
//   season VARCHAR(10),
//   team_type VARCHAR(100),
//   toss_decision VARCHAR(100),
//   match_at DATE,
//   month INT,
//   first_team VARCHAR(100),
//   second_team VARCHAR(100),
//   first_powerplay_runs INT,
//   first_powerplay_wickets INT,
//   first_middleovers_runs INT,
//   first_middleovers_wickets INT,
//   first_deathovers_runs INT,
//   first_deathovers_wickets INT,
//   first_total_runs INT,
//   first_total_wickets INT,
//   second_powerplay_runs INT,
//   second_powerplay_wickets INT,
//   second_middleovers_runs INT,
//   second_middleovers_wickets INT,
//   second_deathovers_runs INT,
//   second_deathovers_wickets INT,
//   second_total_runs INT,
//   second_total_wickets INT
// );

@Entity({
  name: 'match_information',
})
export class MatchInformation {
  @PrimaryGeneratedColumn()
  id?: number;

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
  first_total_runs: number;

  @Column({ type: 'int' })
  first_total_wickets: number;

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

  @Column({ type: 'int' })
  second_total_runs: number;

  @Column({ type: 'int' })
  second_total_wickets: number;
}
