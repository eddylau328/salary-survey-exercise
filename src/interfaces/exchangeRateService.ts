import { Currency } from "entity/Currency";
import { ExchangeRate } from "entity/ExchangeRate";

interface RawExchangeRate {
  from: string;
  to: string;
  rate: number;
  createAt: string;
}

interface ConvertCurrency {
  convertCurrency(currency: Currency): Promise<number>;
}

interface CreateExchangeRate {
  createExchangeRate(rawExchangeRate: RawExchangeRate): Promise<ExchangeRate>;
}

interface ExchangeRateService extends ConvertCurrency, CreateExchangeRate {}

export { ExchangeRateService, RawExchangeRate };
