import { AgeGroup } from "entity/AgeGroup";
import { Currency } from "entity/Currency";
import { WorkExperienceYear } from "entity/WorkExperienceYear";
import { getRepository } from "typeorm";

export interface ConstantMap<T> {
  [key: string]: T;
}

type ConstantGroup = AgeGroup | Currency | WorkExperienceYear;

interface GetAgeGroup {
  getConstant(title: string): Promise<AgeGroup | undefined>;
}
interface GetCurrency {
  getConstant(title: string): Promise<Currency | undefined>;
}
interface GetWorkExperienceYear {
  getConstant(title: string): Promise<WorkExperienceYear | undefined>;
}

abstract class ConstantService {
  protected entity: { new (): ConstantGroup };
  protected constantMap: ConstantMap<ConstantGroup> | undefined;
  constructor(constantMap: ConstantMap<ConstantGroup> | undefined = undefined) {
    this.constantMap = constantMap;
  }
  protected async getFromConstantMap(
    title: string
  ): Promise<ConstantGroup | undefined> {
    return await Promise.resolve(
      this.constantMap[title] as WorkExperienceYear | undefined
    );
  }
  protected async getFromDatabase(
    title: string
  ): Promise<ConstantGroup | undefined> {
    const repo = getRepository(this.entity);
    try {
      return await repo.findOne({ title: title });
    } catch (e) {
      return await Promise.resolve(undefined);
    }
  }
}

export { ConstantService, GetAgeGroup, GetCurrency, GetWorkExperienceYear };
