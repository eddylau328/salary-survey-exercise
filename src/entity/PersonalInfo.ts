import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { AgeGroup } from "./AgeGroup";
import { SurveyResult } from "./SurveyResult";
import { WorkExperienceYear } from "./WorkExperienceYear";

@Entity()
export class PersonalInfo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => SurveyResult, (surveyResult) => surveyResult.personalInfo)
  surveyResult: SurveyResult;

  @ManyToOne(() => AgeGroup, (ageGroup) => ageGroup.personalInfo)
  @JoinColumn()
  ageGroup: AgeGroup;

  @ManyToOne(
    () => WorkExperienceYear,
    (WorkExperienceYear) => WorkExperienceYear.personalInfo
  )
  WorkExperienceYear: WorkExperienceYear;

  @Column()
  location: string;
}
