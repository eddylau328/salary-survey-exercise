import { Currency } from "entity/Currency";

interface ParseAnnualSalary {
  parseAnnualSalary(rawSalary: string): Promise<number>;
}

interface AverageAnnualSalaryResponse {
  averageAnnualSalary: number;
  count: number;
  targetCurrency: string;
  jobRole: string;
}

interface GetAverageAnnualSalary {
  getAverageAnnualSalary(
    averageAnnualSalaryRequest: AverageAnnualSalaryRequest,
    targetCurrency: Currency
  ): Promise<AverageAnnualSalaryResponse>;
}

interface AverageAnnualSalaryRequest {
  jobRole: string;
  currency?: string;
}

interface SalaryService extends ParseAnnualSalary, GetAverageAnnualSalary {}

export {
  AverageAnnualSalaryRequest,
  AverageAnnualSalaryResponse,
  SalaryService,
};
