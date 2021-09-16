import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
} from "typeorm";
import { JobInfo } from "./JobInfo";
import { PersonalInfo } from "./PersonalInfo";
import { SalaryInfo } from "./SalaryInfo";

@Entity()
export class SurveyResult {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => PersonalInfo, (personalInfo) => personalInfo.surveyResult)
  @JoinColumn()
  personalInfo: PersonalInfo;

  @OneToOne(() => JobInfo, (jobInfo) => jobInfo.surveyResult)
  @JoinColumn()
  jobInfo: JobInfo;

  @OneToOne(() => SalaryInfo, (salaryInfo) => salaryInfo.surveyResult)
  salaryInfo: SalaryInfo;

  @Column({ type: "timestamptz" })
  createAt: Date;
}
