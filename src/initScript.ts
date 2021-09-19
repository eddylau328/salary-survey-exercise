import data from "salaryData.json";
import DB from "db";
import { AgeGroup } from "entity/AgeGroup";
import { WorkExperienceYear } from "entity/WorkExperienceYear";
import { getRepository } from "typeorm";
import { Currency } from "entity/Currency";

const DATA_FIELD = {
  CREATE_AT: "Timestamp",
  AGE_GROUP: "How old are you?",
  INDUSTRY: "What industry do you work in?",
  JOB_TITLE: "Job title",
  ANNUAL_SALARY: "What is your annual salary?",
  CURRENCY: "Please indicate the currency",
  LOCATION: "Where are you located? (City/state/country)",
  WORK_EXPERIENCE_YEAR:
    "How many years of post-college professional work experience do you have?",
  JOB_REMARK:
    "If your job title needs additional context, please clarify here:",
  // eslint-disable-next-line quotes
  CURRENCY_REMARK: 'If "Other," please indicate the currency here:',
};

interface SalaryData {
  [key: string]: string;
}

type ParsedRawData = {
  ageGroups: string[];
  workExperienceYears: string[];
  currencyDatum: string[];
};

interface AgeGroupMap {
  [key: string]: AgeGroup;
}
interface WorkExperienceYearMap {
  [key: string]: WorkExperienceYear;
}
interface CurrencyMap {
  [key: string]: Currency;
}

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

function parseRawData(rawData: SalaryData[]): ParsedRawData {
  const ageGroupSet: Set<string> = new Set();
  const workExperienceYearSet: Set<string> = new Set();
  const currencySet: Set<string> = new Set();
  Array.isArray(rawData) &&
    rawData.forEach((item: SalaryData) => {
      ageGroupSet.add(item[DATA_FIELD.AGE_GROUP]);
      workExperienceYearSet.add(item[DATA_FIELD.WORK_EXPERIENCE_YEAR]);
      currencySet.add(item[DATA_FIELD.CURRENCY]);
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
  ageGroupMap: AgeGroupMap;
  currencyMap: CurrencyMap;
  workExperienceYearMap: WorkExperienceYearMap;
} {
  const ageGroupMap: AgeGroupMap = ageGroupObjects.reduce(
    (acc: AgeGroupMap, group): AgeGroupMap => {
      acc[group.title] = group;
      return acc;
    },
    {}
  );
  const workExperienceYearMap: WorkExperienceYearMap =
    workExperienceYearObjects.reduce(
      (acc: WorkExperienceYearMap, group): WorkExperienceYearMap => {
        acc[group.title] = group;
        return acc;
      },
      {}
    );

  const currencyMap: CurrencyMap = currencyObjects.reduce(
    (acc: CurrencyMap, currency) => {
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

(async (): Promise<void> => {
  const db = new DB();
  await db.initialize();
  const { ageGroups, workExperienceYears, currencyDatum } = parseRawData(
    data as Array<SalaryData>
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
  console.log(ageGroupMap);
  console.log(currencyMap);
  console.log(workExperienceYearMap);
})();
