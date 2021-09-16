import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SalaryInfo } from "./SalaryInfo";

@Entity()
export class Currency {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @OneToMany(() => SalaryInfo, (salaryInfo) => salaryInfo.currency)
  salaryInfo: SalaryInfo;
}
