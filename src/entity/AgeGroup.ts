import { Range } from "entity/range/Range";
import { PersonalInfo } from "./PersonalInfo";
import { Entity, OneToMany } from "typeorm";

@Entity()
export class AgeGroup extends Range {
  @OneToMany(() => PersonalInfo, (personalInfo) => personalInfo.ageGroup)
  personalInfo: PersonalInfo;
}
