import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { SurveyResult } from "./SurveyResult";

export type JobInfoId = number;

@Entity()
export class JobInfo {
  @PrimaryGeneratedColumn()
  id: JobInfoId;

  @Column()
  industry: string;

  @Column()
  title: string;

  @Column()
  titleRemark: string;

  @OneToOne(() => SurveyResult, (surveyResult) => surveyResult.jobInfo)
  surveyResult: SurveyResult;
}
