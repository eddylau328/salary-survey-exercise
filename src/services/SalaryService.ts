import { Currency } from "entity/Currency";
import { SurveyResult } from "entity/SurveyResult";
import { ExchangeRate } from "entity/ExchangeRate";
import {
  SalaryService as SalaryServiceImp,
  AverageAnnualSalaryRequest,
  AverageAnnualSalaryResponse,
  NUMERIC_SYMBOL,
  NUMBERIC_SYMBOL_LONG_TERM,
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
    const NUMBER_REGEX =
      /((\d+|\d{1,3})([\,, ]\d{1,3})*)((\.\d+)?)(\ *)(([k,K,m,M,b,B,t,T](\ +|$))?)/;

    const isContainNumber = (examineValue: string): boolean => {
      return NUMBER_REGEX.test(examineValue);
    };
    const getMatchNumbers = (examineValue: string): string[] | null => {
      return examineValue.match(NUMBER_REGEX);
    };

    const convertLowerCase = (value: string) => value.toLowerCase();

    const removeNumberSymbolLongTerm = (value: string) =>
      Object.entries(NUMBERIC_SYMBOL_LONG_TERM).reduce(
        (result, [longTermSymbol, shortTermSymbol]) => {
          const regex = new RegExp(longTermSymbol, "g");
          return result.replace(regex, shortTermSymbol);
        },
        value
      );

    const removeCommas = (value: string): string => value.replace(/,/g, "");
    const removeSpaces = (value: string): string => value.replace(/ /g, "");

    const convertValue = (value: string): number => {
      const symbol = Object.keys(NUMERIC_SYMBOL).find((symbol) =>
        value.includes(symbol)
      );
      if (!symbol) {
        return parseFloat(value);
      }
      return parseFloat(value.replace(symbol, "")) * NUMERIC_SYMBOL[symbol];
    };

    if (!isContainNumber(rawAnnualSalary)) {
      return undefined;
    }

    const lowerCaseRawAnnualSalary = convertLowerCase(rawAnnualSalary);
    const filterNumberSymbolLongTerm = removeNumberSymbolLongTerm(
      lowerCaseRawAnnualSalary
    );

    if (!isContainNumber(filterNumberSymbolLongTerm)) {
      return undefined;
    }
    const matchNumbers: string[] | null = getMatchNumbers(
      filterNumberSymbolLongTerm
    );
    if (!Array.isArray(matchNumbers)) {
      return undefined;
    }
    if (matchNumbers.length === 0) {
      return undefined;
    }

    const closedResult: string = matchNumbers[0];
    const filterCommasResult = removeCommas(closedResult);
    const filterSpaceResult = removeSpaces(filterCommasResult);
    const result = convertValue(filterSpaceResult);
    if (isNaN(result)) {
      return undefined;
    }
    return result;
  }
}

export default SalaryService;
