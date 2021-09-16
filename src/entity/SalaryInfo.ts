import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
} from "typeorm";
import { Currency } from "./Currency";
import { SurveyResult } from "./SurveyResult";

@Entity()
export class SalaryInfo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  annualSalary: number;

  @ManyToOne(() => Currency, (currency) => currency.salaryInfo)
  currency: Currency;

  @Column()
  currencyRemark: string;

  @OneToOne(() => SurveyResult, (surveyResult) => surveyResult.jobInfo)
  surveyResult: SurveyResult;
}
