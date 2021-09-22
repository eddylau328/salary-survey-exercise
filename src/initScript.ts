import data from "salaryData.json";
import exchangeRateData from "exchangeRate.json";
import DB from "db";
import { AgeGroup } from "entity/AgeGroup";
import { WorkExperienceYear } from "entity/WorkExperienceYear";
import { getConnection, getRepository } from "typeorm";
import { Currency } from "entity/Currency";
import { ExchangeRate } from "entity/ExchangeRate";

import {
  RawSalarySurvey,
  SALARY_SURVEY_FIELD,
} from "interfaces/rawSalarySurvey";
import { ConstantMap } from "interfaces/constantService";
import { RawExchangeRate } from "interfaces/exchangeRateService";

import AgeGroupService from "services/AgeGroupService";
import CurrencyService from "services/CurrencyService";
import WorkExperienceYearService from "services/WorkExperienceYearService";
import SalarySurveyService from "services/SalarySurveyService";
import SalaryService from "services/SalaryService";
import ExchangeRateService from "services/ExchangeRateService";

type ParsedRawData = {
  ageGroups: string[];
  workExperienceYears: string[];
  currencyDatum: string[];
};

async function setupAgeGroupData(ageGroups: string[]): Promise<AgeGroup[]> {
  function parseAgeGroup(group: string) {
    const result = { title: group, start: 0, end: 200 };
    if (group === "65 or over") {
      result.start = 65;
    } else if (group === "under 18") {
      result.end = 18;
    } else {
      const range = group.split("-");
      result.start = parseInt(range[0], 10);
      result.end = parseInt(range[1], 10);
    }
    return result;
  }
  const repo = getRepository(AgeGroup);
  if ((await repo.count()) > 0) {
    return await repo.find();
  }
  const ageGroupData = ageGroups.map((group) => parseAgeGroup(group));
  const ageGroupObjects = ageGroupData.map((group) => {
    const ageGroupObject = new AgeGroup();
    return Object.assign(ageGroupObject, group);
  });
  return await repo.save(ageGroupObjects);
}

async function setupWorkExperienceYearData(
  workExperienceYears: string[]
): Promise<WorkExperienceYear[]> {
  function parseWorkExperienceYear(year: string) {
    const result = { title: year, start: 0, end: 200 };
    if (year === "1 year or less") {
      result.end = 1;
    } else if (year === "41 years or more") {
      result.start = 41;
    } else {
      const range = year.replace("years", "").replace(" ", "").split("-");
      result.start = parseInt(range[0], 10);
      result.end = parseInt(range[1], 10);
    }
    return result;
  }
  const repo = getRepository(WorkExperienceYear);
  if ((await repo.count()) > 0) {
    return await repo.find();
  }

  const workExperienceYearData = workExperienceYears.map((year) =>
    parseWorkExperienceYear(year)
  );
  const workExperienceYearObjects = workExperienceYearData.map((year) => {
    const workExperienceYearObject = new WorkExperienceYear();
    return Object.assign(workExperienceYearObject, year);
  });
  return await repo.save(workExperienceYearObjects);
}

async function setupCurrencyData(currencyDatum: string[]): Promise<Currency[]> {
  function parseCurrencyData(currency: string) {
    return { title: currency };
  }
  const repo = getRepository(Currency);
  if ((await repo.count()) > 0) {
    return await repo.find();
  }

  const parsedCurrencyDatum = currencyDatum.map((currency) =>
    parseCurrencyData(currency)
  );
  const currencyObjects = parsedCurrencyDatum.map((currency) => {
    const currencyObject = new Currency();
    return Object.assign(currencyObject, currency);
  });
  return await repo.save(currencyObjects);
}

async function setupExchangeRate(
  currencyObjects: Currency[]
): Promise<ExchangeRate[]> {
  return;
}

function parseRawData(rawData: RawSalarySurvey[]): ParsedRawData {
  const ageGroupSet: Set<string> = new Set();
  const workExperienceYearSet: Set<string> = new Set();
  const currencySet: Set<string> = new Set();
  Array.isArray(rawData) &&
    rawData.forEach((item: RawSalarySurvey) => {
      ageGroupSet.add(item[SALARY_SURVEY_FIELD.AGE_GROUP]);
      workExperienceYearSet.add(item[SALARY_SURVEY_FIELD.WORK_EXPERIENCE_YEAR]);
      currencySet.add(item[SALARY_SURVEY_FIELD.CURRENCY]);
    });
  return {
    ageGroups: [...ageGroupSet],
    workExperienceYears: [...workExperienceYearSet],
    currencyDatum: [...currencySet],
  };
}

/* for faster insertion, create a hash table for accessing */
function parseConstantsObjects({
  ageGroupObjects,
  currencyObjects,
  workExperienceYearObjects,
}: {
  ageGroupObjects: AgeGroup[];
  currencyObjects: Currency[];
  workExperienceYearObjects: WorkExperienceYear[];
}): {
  ageGroupMap: ConstantMap<AgeGroup>;
  currencyMap: ConstantMap<Currency>;
  workExperienceYearMap: ConstantMap<WorkExperienceYear>;
} {
  const ageGroupMap: ConstantMap<AgeGroup> = ageGroupObjects.reduce(
    (acc: ConstantMap<AgeGroup>, group: AgeGroup): ConstantMap<AgeGroup> => {
      acc[group.title] = group;
      return acc;
    },
    {}
  );
  const workExperienceYearMap: ConstantMap<WorkExperienceYear> =
    workExperienceYearObjects.reduce(
      (
        acc: ConstantMap<WorkExperienceYear>,
        group: WorkExperienceYear
      ): ConstantMap<WorkExperienceYear> => {
        acc[group.title] = group;
        return acc;
      },
      {}
    );
  const currencyMap: ConstantMap<Currency> = currencyObjects.reduce(
    (acc: ConstantMap<Currency>, currency: Currency): ConstantMap<Currency> => {
      acc[currency.title] = currency;
      return acc;
    },
    {}
  );
  return {
    ageGroupMap,
    currencyMap,
    workExperienceYearMap,
  };
}

async function removeAllData(): Promise<void> {
  const connection = getConnection();
  await connection.manager.query("DELETE FROM survey_result");
  await Promise.all([
    connection.manager.query("DELETE FROM salary_info"),
    connection.manager.query("DELETE FROM job_info"),
    connection.manager.query("DELETE FROM personal_info"),
  ]);
  await connection.manager.query("DELETE FROM exchange_rate");
  await Promise.all([
    connection.manager.query("DELETE FROM age_group"),
    connection.manager.query("DELETE FROM work_experience_year"),
    connection.manager.query("DELETE FROM currency"),
  ]);
}

(async (): Promise<void> => {
  const db = new DB();
  await db.initialize();
  await removeAllData();
  const { ageGroups, workExperienceYears, currencyDatum } = parseRawData(
    data as RawSalarySurvey[]
  );
  const [ageGroupObjects, workExperienceYearObjects, currencyObjects] =
    await Promise.all([
      setupAgeGroupData(ageGroups),
      setupWorkExperienceYearData(workExperienceYears),
      setupCurrencyData(currencyDatum),
    ]);
  const { ageGroupMap, workExperienceYearMap, currencyMap } =
    parseConstantsObjects({
      ageGroupObjects,
      workExperienceYearObjects,
      currencyObjects,
    });
  const ageGroupService = new AgeGroupService(ageGroupMap);
  const currencyService = new CurrencyService(currencyMap);
  const workExperienceYearService = new WorkExperienceYearService(
    workExperienceYearMap
  );
  const exchangeRateService = new ExchangeRateService({ currencyService });
  if (Array.isArray(exchangeRateData)) {
    console.log("start create exchange rate");
    try {
      await Promise.all(
        exchangeRateData.map(
          (data: RawExchangeRate): Promise<ExchangeRate> =>
            exchangeRateService.createExchangeRate(data)
        )
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  const salaryService = new SalaryService();
  const salarySurveyService = new SalarySurveyService({
    ageGroupService,
    currencyService,
    workExperienceYearService,
    salaryService,
  });
  if (Array.isArray(data)) {
    console.log("start create survery result");
    try {
      await salarySurveyService.createBatchSurveyResult(data, 1000);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
})();
