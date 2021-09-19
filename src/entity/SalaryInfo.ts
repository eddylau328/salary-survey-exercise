import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
} from "typeorm";
import { Currency } from "./Currency";
import { SurveyResult } from "./SurveyResult";

export type SalaryInfoId = number;

@Entity()
export class SalaryInfo {
  @PrimaryGeneratedColumn()
  id: SalaryInfoId;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 3,
  })
  annualSalary: number;

  @Column()
  rawAnnualSalary: string;

  @ManyToOne(() => Currency, (currency) => currency.salaryInfo)
  currency: Currency;

  @Column()
  currencyRemark: string;

  @OneToOne(() => SurveyResult, (surveyResult) => surveyResult.jobInfo)
  surveyResult: SurveyResult;
}
