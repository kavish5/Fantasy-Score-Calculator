import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// CREATE TABLE venues (
//   id SERIAL PRIMARY KEY,
//   city VARCHAR(100),
//   venue VARCHAR(200),
//   venue_alias_a VARCHAR(200),
//   venue_alias_b VARCHAR(200),
//   venue_alias_c VARCHAR(200)
// );

@Entity({
  name: 'venues',
})
export class Venues {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 200 })
  venue: string;

  @Column({ type: 'varchar', length: 200 })
  venue_alias_a: string;

  @Column({ type: 'varchar', length: 200 })
  venue_alias_b: string;

  @Column({ type: 'varchar', length: 200 })
  venue_alias_c: string;
}
