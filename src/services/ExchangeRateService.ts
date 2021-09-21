import { Currency } from "entity/Currency";
import { ExchangeRate } from "entity/ExchangeRate";

import { GetCurrency } from "interfaces/constantService";
import {
  ExchangeRateService as ExchangeRateServiceImp,
  RawExchangeRate,
} from "interfaces/exchangeRateService";

import { getConnection } from "typeorm";

class ExchangeRateService implements ExchangeRateServiceImp {
  currencyService: GetCurrency;

  constructor({ currencyService }: { currencyService: GetCurrency }) {
    this.currencyService = currencyService;
  }

  public async convertCurrency(original: Currency): Promise<number> {
    return Promise.resolve(0);
  }

  public async createExchangeRate(
    rawExchangeRate: RawExchangeRate
  ): Promise<ExchangeRate> {
    const queryRunner = getConnection().createQueryRunner();
    try {
      await queryRunner.startTransaction();

      const [targetTo, targetFrom] = await Promise.all([
        this.currencyService.getConstant(rawExchangeRate.to),
        this.currencyService.getConstant(rawExchangeRate.from),
      ]);
      const rate = rawExchangeRate.rate;
      const createAt = new Date(parseFloat(rawExchangeRate.createAt));
      const title = `${targetFrom.title} to ${
        targetTo.title
      } at ${createAt.toISOString()}`;

      const exchangeRate = new ExchangeRate();
      exchangeRate.targetTo = targetTo;
      exchangeRate.targetFrom = targetFrom;
      exchangeRate.rate = rate;
      exchangeRate.createAt = createAt;
      exchangeRate.title = title;
      const result = queryRunner.manager.save(exchangeRate);

      // finish all the transactions, commit and release
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return result;
    } catch (err) {
      // error occurs, roll back and release
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw err;
    }
  }
}

export default ExchangeRateService;
