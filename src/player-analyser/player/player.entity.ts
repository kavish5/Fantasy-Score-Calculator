import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
