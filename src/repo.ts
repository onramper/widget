import { type } from "os";
import { Currency, AppDatabase, CoreError, CurrenciesOrError, CurrencyOrError, CurrencyNotFoundError } from "./core";

class CurrenciesRepo {

    private db: AppDatabase;

    constructor(db: AppDatabase) {
        this.db = db;
    }

    async getAllCurrencies(countryId?:string): CurrenciesOrError {
        
        let results;

        if(countryId){
            results = await this.db.getCurrenciesForCountry(countryId);
        }else{
            results = await this.db.getAllCurrencies();
        }


        if(results instanceof CoreError)
            return results;

        // Send the data to the heap
        return results.map((element:any) => {
            return new Currency(element.Id, element.Name, element.Symbol, element.Type, element.Networks);
        });
    }

    async getCurrency(currencyId: string): CurrencyOrError {
        let currency = await this.db.getCurrencyForId(currencyId);
        
        if(currency instanceof CoreError){
            return currency;
        }

        if(!currency){
            return new CurrencyNotFoundError(currencyId);
        }
        
        return new Currency(this.cleanId(currency.Id.toString()), currency.Name, currency.Symbol, currency.Type, currency.Networks);
    }

    async getFiatCurrencies(): CurrenciesOrError {
        return this.db.getCurrencyForType('fiat');
    }

    async getCryptoCurrencies(): CurrenciesOrError {
        return this.db.getCurrencyForType('crypto');
    }

    cleanId(id:string):string{
        return id.slice(id.length-3);
    }
}

export { CurrenciesRepo };