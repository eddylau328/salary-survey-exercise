import { Currency } from "entity/Currency";
import { ConstantService, GetCurrency } from "interfaces/constantService";

class CurrencyService extends ConstantService implements GetCurrency {
  protected entity = Currency;
  public async getConstant(title: string): Promise<Currency | undefined> {
    if (this.constantMap) {
      return (await this.getFromConstantMap(title)) as Currency | undefined;
    }
    return (await this.getFromDatabase(title)) as Currency | undefined;
  }
}

export default CurrencyService;
