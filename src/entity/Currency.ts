import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SalaryInfo } from "./SalaryInfo";

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  title: string;

  @OneToMany(() => SalaryInfo, (salaryInfo) => salaryInfo.currency)
  salaryInfo: SalaryInfo;
}
