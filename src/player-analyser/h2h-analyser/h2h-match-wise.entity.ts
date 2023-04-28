import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { H2hMatchDto } from './dto/h2h-details.dto';

// CREATE TABLE `h2h_match_wise` (
//   `id` int NOT NULL AUTO_INCREMENT,
//   `match_id` int NOT NULL,
//   `match_on` date NOT NULL,
//   `batter_id` varchar(50) NOT NULL,
//   `bowler_id` varchar(50) NOT NULL,
//   `batting_style` varchar(50),
//   `bowling_style` varchar(50),
//   `runs` int NOT NULL,
//   `balls` int NOT NULL,
//   `wicket` int NOT NULL,
//   PRIMARY KEY (`id`)
// );

// CREATE TABLE `h2h_overall` (
//   `id` INT NOT NULL AUTO_INCREMENT,
//   `batter_id` varchar(50) NOT NULL,
//   `bowler_id` varchar(50) NOT NULL,
//   `total_runs` INT NOT NULL,
//   `total_balls` INT NOT NULL,
//   `total_wickets` INT NOT NULL,
//   `batting_style` varchar(50),
//   `bowling_style` varchar(50),
//    PRIMARY KEY (`id`)
// );

// DELIMITER //

// CREATE TRIGGER `update_h2h_overall` AFTER INSERT ON `h2h_match_wise` FOR EACH ROW
// BEGIN
//   -- check if batter and bowler exist in h2h_overall
//   SELECT COUNT(*) INTO @count FROM `h2h_overall` WHERE `batter_id` = NEW.batter_id AND `bowler_id` = NEW.bowler_id;

//   IF @count > 0 THEN
//     -- update existing record
//     SELECT `total_runs`, `total_balls`, `total_wickets` INTO @total_runs, @total_balls, @total_wickets FROM `h2h_overall` WHERE `batter_id` = NEW.batter_id AND `bowler_id` = NEW.bowler_id;
//     UPDATE `h2h_overall` SET `total_runs` = COALESCE(@total_runs, 0) + NEW.runs, `total_balls` = COALESCE(@total_balls, 0) + NEW.balls, `total_wickets` = COALESCE(@total_wickets, 0) + NEW.wicket WHERE `batter_id` = NEW.batter_id AND `bowler_id` = NEW.bowler_id;
//   ELSE
//     -- insert new record
//     INSERT INTO `h2h_overall` (`batter_id`, `bowler_id`, `total_runs`, `total_balls`, `total_wickets`, `batting_style`, `bowling_style`) VALUES (NEW.batter_id, NEW.bowler_id, NEW.runs, NEW.balls, NEW.wicket, NEW.batting_style, NEW.bowling_style);
//   END IF;
// END//

// DELIMITER ;

@Entity({
  name: 'h2h_match_wise',
})
export class H2hMatchWise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  match_id: number;

  @Column({ type: 'date' })
  match_on: Date;

  @Column({ type: 'varchar', length: 50 })
  batter_id: string;

  @Column({ type: 'varchar', length: 50 })
  bowler_id: string;

  @Column({ type: 'varchar', length: 50 })
  batting_style: string;

  @Column({ type: 'varchar', length: 50 })
  bowling_style: string;

  @Column({ type: 'int' })
  runs: number;

  @Column({ type: 'int' })
  balls: number;

  @Column({ type: 'int' })
  wicket: number;

  static createInstance(
    h2hDetails: H2hMatchDto,
    players: Record<string, any>,
    matchId: number,
    matchDate: string,
  ): H2hMatchWise {
    const data = new H2hMatchWise();
    data.balls = h2hDetails.balls;
    data.batter_id = h2hDetails.batterId;
    data.batting_style = players[h2hDetails.batterId]?.batting_style;
    data.bowler_id = h2hDetails.bowlerId;
    data.bowling_style = players[h2hDetails.bowlerId]?.bowling_style;
    data.runs = h2hDetails.runs;
    data.wicket = h2hDetails.wicket;
    data.match_id = matchId;
    data.match_on = new Date(matchDate);
    return data;
  }
}
