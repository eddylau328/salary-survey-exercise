import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { Constant } from "./constant/Constant";
import { Currency } from "./Currency";

@Entity()
export class ExchangeRate extends Constant {
  @ManyToOne(() => Currency, (currency) => currency.exchangeRateFrom)
  @JoinColumn()
  targetFrom: Currency;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 6,
  })
  rate: number;

  @ManyToOne(() => Currency, (currency) => currency.exchangeRateTo)
  @JoinColumn()
  targetTo: Currency;

  @Column({
    type: "timestamptz",
  })
  createAt: Date;
}
