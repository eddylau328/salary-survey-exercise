import { Currency } from "entity/Currency";
import { SurveyResult } from "entity/SurveyResult";
import { ExchangeRate } from "entity/ExchangeRate";
import {
  SalaryService as SalaryServiceImp,
  AverageAnnualSalaryRequest,
  AverageAnnualSalaryResponse,
} from "interfaces/salaryService";
import { getRepository } from "typeorm";

class SalaryService implements SalaryServiceImp {
  public async parseAnnualSalary(rawAnnualSalary: string): Promise<number> {
    const annualSalary = this.filterAnnualSalary(rawAnnualSalary);
    return await Promise.resolve(annualSalary || 0);
  }

  public async getAverageAnnualSalary(
    averageAnnualSalaryRequest: AverageAnnualSalaryRequest,
    targetCurrency: Currency
  ): Promise<AverageAnnualSalaryResponse> {
    const { jobRole } = averageAnnualSalaryRequest;
    const repsonse = await getRepository(SurveyResult)
      .createQueryBuilder("surveyResult")
      .leftJoinAndSelect("surveyResult.jobInfo", "jobInfo")
      .leftJoinAndSelect("surveyResult.salaryInfo", "salaryInfo")
      .leftJoinAndSelect("salaryInfo.currency", "currency")
      .leftJoinAndMapOne(
        "currency.exchangeRateFrom",
        ExchangeRate,
        "exchangeRate",
        `"exchangeRate"."targetFromId" = "salaryInfo"."currencyId" AND "exchangeRate"."targetToId" = ${targetCurrency.id}`
      )
      .where("jobInfo.title ilike :jobRole", { jobRole: `%${jobRole}%` })
      /* eslint-disable-next-line  */
      .andWhere('"exchangeRate"."rate" * "salaryInfo"."annualSalary" > 0')
      .select(
        /* eslint-disable-next-line */
        'ROUND(AVG("exchangeRate"."rate" * "salaryInfo"."annualSalary"), 2)',
        "averageAnnualSalary"
      )
      .addSelect("COUNT(*)", "count")
      .addSelect(`'${targetCurrency.title}' AS "targetCurrency"`)
      .addSelect(`'${jobRole}' AS "jobRole"`)
      .getRawOne();
    return repsonse;
  }

  private filterAnnualSalary(rawAnnualSalary: string): number | undefined {
    const isContainAlphabet = (examineValue: string): boolean => {
      const characterRegex = /[a-zA-Z]/g;
      return characterRegex.test(examineValue);
    };

    const isContainNumber = (examineValue: string): boolean => {
      const numberRegex = /(\d+|\d{1,3}(,\d{3})*)(\.\d+)?/;
      return numberRegex.test(examineValue);
    };
    const getMatchNumbers = (examineValue: string): string[] | null => {
      const numberRegex = /(\d+|\d{1,3}(,\d{3})*)(\.\d+)?/;
      return examineValue.match(numberRegex);
    };

    const removeWhiteSpaces = (value: string): string =>
      value.replace(/ /g, "");

    const removeCommas = (value: string): string => value.replace(/,/g, "");

    if (isContainAlphabet(rawAnnualSalary)) {
      return undefined;
    }

    const filterWhiteSpace = removeWhiteSpaces(rawAnnualSalary);

    if (!isContainNumber(filterWhiteSpace)) {
      return undefined;
    }

    const matchNumbers: string[] | null = getMatchNumbers(filterWhiteSpace);
    if (!Array.isArray(matchNumbers)) {
      return undefined;
    }
    if (matchNumbers.length === 0) {
      return undefined;
    }

    const closedResult: string = matchNumbers[0];
    const pureNumber = removeCommas(closedResult);
    const result = parseFloat(pureNumber);
    if (isNaN(result)) {
      return undefined;
    }
    return result;
  }
}

export default SalaryService;
