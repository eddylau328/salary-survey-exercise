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

export type PersonalInfoId = number;

@Entity()
export class PersonalInfo {
  @PrimaryGeneratedColumn()
  id: PersonalInfoId;

  @OneToOne(() => SurveyResult, (surveyResult) => surveyResult.personalInfo)
  surveyResult: SurveyResult;

  @ManyToOne(() => AgeGroup, (ageGroup) => ageGroup.personalInfo)
  @JoinColumn()
  ageGroup: AgeGroup;

  @ManyToOne(
    () => WorkExperienceYear,
    (WorkExperienceYear) => WorkExperienceYear.personalInfo
  )
  workExperienceYear: WorkExperienceYear;

  @Column()
  location: string;
}
