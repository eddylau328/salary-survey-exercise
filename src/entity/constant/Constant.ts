import { PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

export type ConstantId = number;

export abstract class Constant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: ConstantId;

  @Column({
    unique: true,
  })
  title: string;
}
