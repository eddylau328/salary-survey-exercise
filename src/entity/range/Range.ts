import { PrimaryGeneratedColumn, Column } from "typeorm";

export abstract class Range {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
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
