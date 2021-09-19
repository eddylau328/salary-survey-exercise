import { AgeGroup } from "entity/AgeGroup";
import { Currency } from "entity/Currency";
import { WorkExperienceYear } from "entity/WorkExperienceYear";

export interface ConstantMap<T> {
  [key: string]: T;
}

type ConstantGroup = AgeGroup | Currency | WorkExperienceYear;

abstract class ConstantService {
  protected constantMap: ConstantMap<ConstantGroup> | undefined;
  constructor(constantMap: ConstantMap<ConstantGroup> | undefined = undefined) {
    this.constantMap = constantMap;
  }
  public abstract getConstant(title: string): Promise<ConstantGroup>;
}

export default ConstantService;
