import { PrimaryGeneratedColumn, Column } from "typeorm";

export abstract class Range {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({
    type: "int2",
  })
  start: number;

  @Column({
    type: "int2",
  })
  end: number;
}
