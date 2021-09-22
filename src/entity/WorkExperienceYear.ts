import { Range } from "entity/constant/Range";
import { Entity, OneToMany } from "typeorm";
import { PersonalInfo } from "./PersonalInfo";

@Entity()
export class WorkExperienceYear extends Range {
  @OneToMany(
    () => PersonalInfo,
    (personalInfo) => personalInfo.workExperienceYear
  )
  personalInfo: PersonalInfo;
}
