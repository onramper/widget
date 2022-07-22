import { Currency, AppDatabase } from "./core";

class CurrenciesRepo {

    private db: AppDatabase;

    constructor(db: AppDatabase) {
        this.db = db;
    }    

    async getAllCurrencies(): Promise<Currency[]> {

        let results = await this.db.getAllCurrencies();
        return results.map((element:any) => {
            return new Currency(element.Id, element.Name, element.Symbol, element.Type, element.Networks);
        });
    }

    getFiatCurrencies(): Currency[] {
        return this.db.getCurrencyForTypes(['fiat']);
    }

    getCryptoCurrencies(): Currency[] {
        return this.db.getCurrencyForTypes(['crypto']);
    }
}





export { CurrenciesRepo };