import { Currency } from "entity/Currency";
import ConstantService from "interfaces/constantService";
import { getRepository } from "typeorm";

class CurrencyService extends ConstantService {
  async getConstant(title: string): Promise<Currency> {
    if (this.constantMap) {
      return await this.getFromConstantMap(title);
    }
    return await this.getFromDatabase(title);
  }

  async getFromConstantMap(title: string): Promise<Currency | undefined> {
    return await Promise.resolve(
      this.constantMap[title] as Currency | undefined
    );
  }

  async getFromDatabase(title: string): Promise<Currency | undefined> {
    const repo = getRepository(Currency);
    try {
      return await repo.findOne({ title: title });
    } catch (e) {
      return await Promise.resolve(undefined);
    }
  }
}

export default CurrencyService;
