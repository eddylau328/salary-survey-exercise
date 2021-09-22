import { Currency } from "entity/Currency";

interface numberSymbolMap {
  [key: string]: number;
}

const NUMERIC_SYMBOL: numberSymbolMap = {
  K: Math.pow(10, 3),
  k: Math.pow(10, 3),
  M: Math.pow(10, 6),
  m: Math.pow(10, 6),
  B: Math.pow(10, 9),
  b: Math.pow(10, 9),
  T: Math.pow(10, 12),
  t: Math.pow(10, 12),
};

interface numberSymbolLongTermMap {
  [key: string]: string;
}

const NUMBERIC_SYMBOL_LONG_TERM: numberSymbolLongTermMap = {
  thousand: "K",
  million: "M",
  billion: "B",
  trillion: "T",
};

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
  NUMERIC_SYMBOL,
  NUMBERIC_SYMBOL_LONG_TERM,
};
