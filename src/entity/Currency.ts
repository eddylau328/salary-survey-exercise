import { Entity, OneToMany } from "typeorm";
import { Constant } from "./constant/Constant";
import { ExchangeRate } from "./ExchangeRate";
import { SalaryInfo } from "./SalaryInfo";

@Entity()
export class Currency extends Constant {
  @OneToMany(() => SalaryInfo, (salaryInfo) => salaryInfo.currency)
  salaryInfo: SalaryInfo;

  @OneToMany(() => ExchangeRate, (exchangeRate) => exchangeRate.targetFrom)
  exchangeRateFrom: ExchangeRate;

  @OneToMany(() => ExchangeRate, (exchangeRate) => exchangeRate.targetTo)
  exchangeRateTo: ExchangeRate;
}
