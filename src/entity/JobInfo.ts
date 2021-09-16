import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { SurveyResult } from "./SurveyResult";

@Entity()
export class JobInfo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  industry: string;

  @Column()
  title: string;

  @Column()
  titleRemark: string;

  @OneToOne(() => SurveyResult, (surveyResult) => surveyResult.jobInfo)
  surveyResult: SurveyResult;
}
