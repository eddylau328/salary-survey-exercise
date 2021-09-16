import { Range } from "entity/range/Range";
import { Entity, OneToMany } from "typeorm";
import { PersonalInfo } from "./PersonalInfo";

@Entity()
export class WorkExperienceYear extends Range {
  @OneToMany(
    () => PersonalInfo,
    (personalInfo) => personalInfo.WorkExperienceYear
  )
  personalInfo: PersonalInfo;
}
