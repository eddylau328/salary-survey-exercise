import { AgeGroup } from "entity/AgeGroup";
import { Currency } from "entity/Currency";
import { WorkExperienceYear } from "entity/WorkExperienceYear";
import { getRepository } from "typeorm";

const ACCEPT_CURRENCY_FIELDS = [
  "USD",
  "GBP",
  "CAD",
  "EUR",
  "SEK",
  "Other",
  "AUD/NZD",
  "JPY",
  "CHF",
  "HKD",
  "ZAR",
];

const ACCEPT_AGE_GROUP_FIELDS = [
  "35-44",
  "25-34",
  "18-24",
  "45-54",
  "55-64",
  "65 or over",
  "under 18",
];

const ACCEPT_WORK_EXPERIENCE_YEAR_FIELDS = [
  "11 - 20 years",
  "8 - 10 years",
  "2 - 4 years",
  "5-7 years",
  "21 - 30 years",
  "1 year or less",
  "41 years or more",
  "31 - 40 years",
];

interface ConstantMap<T> {
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

export {
  ConstantService,
  GetAgeGroup,
  GetCurrency,
  GetWorkExperienceYear,
  ConstantMap,
  ACCEPT_CURRENCY_FIELDS,
  ACCEPT_AGE_GROUP_FIELDS,
  ACCEPT_WORK_EXPERIENCE_YEAR_FIELDS,
};
