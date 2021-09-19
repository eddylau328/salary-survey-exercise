import { Entity, OneToMany } from "typeorm";
import { Constant } from "./constant/Constant";
import { SalaryInfo } from "./SalaryInfo";

@Entity()
export class Currency extends Constant {
  @OneToMany(() => SalaryInfo, (salaryInfo) => salaryInfo.currency)
  salaryInfo: SalaryInfo;
}
