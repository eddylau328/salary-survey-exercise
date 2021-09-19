import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { JobInfo } from "./JobInfo";
import { PersonalInfo } from "./PersonalInfo";
import { SalaryInfo } from "./SalaryInfo";

export type SurveyResultId = string;

@Entity()
export class SurveyResult {
  @PrimaryGeneratedColumn("uuid")
  id: SurveyResultId;

  @OneToOne(() => PersonalInfo, (personalInfo) => personalInfo.surveyResult)
  @JoinColumn()
  personalInfo: PersonalInfo;

  @OneToOne(() => JobInfo, (jobInfo) => jobInfo.surveyResult)
  @JoinColumn()
  jobInfo: JobInfo;

  @OneToOne(() => SalaryInfo, (salaryInfo) => salaryInfo.surveyResult)
  @JoinColumn()
  salaryInfo: SalaryInfo;

  @CreateDateColumn()
  createAt: Date;
}
