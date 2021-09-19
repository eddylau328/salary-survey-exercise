import { PrimaryGeneratedColumn, Column } from "typeorm";
import { Constant } from "./Constant";

export abstract class Range extends Constant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "int2",
  })
  start: number;

  @Column({
    type: "int2",
  })
  end: number;
}
