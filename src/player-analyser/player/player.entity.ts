import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// CREATE TABLE players (
//   id SERIAL PRIMARY KEY,
//   gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
//   player_name VARCHAR(50),
//   player_id VARCHAR(50),
//   batting_style VARCHAR(50),
//   bowling_style VARCHAR(50)
// );

@Entity({
  name: 'players',
})
export class Players {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: ['male', 'female'], type: 'varchar', length: 10 })
  gender: string;

  @Column({ type: 'varchar', length: 50 })
  player_name: string;

  @Column({ type: 'varchar', length: 50 })
  player_id: string;

  @Column({ type: 'varchar', length: 50 })
  batting_style: string;

  @Column({ type: 'varchar', length: 50 })
  bowling_style: string;
}
