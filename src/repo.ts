import { Currency, AppDatabase, CurrenciesOrError, CurrencyOrError, CurrencyNotFoundError } from "./core";
import { CoreError } from "core-lib/errors";


export { CurrenciesRepo };


// APPLICATION REPOSITORY IMPLEMENTATION
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
            return new Currency(element.Id, element.Name, element.Type,element.Symbol, element.Networks);
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

    async getCurrenciesByType(typeName:string):CurrenciesOrError{
        return this.db.getCurrencyForType(typeName);
    }

    cleanId(id:string):string{
        return id.slice(id.length-3);
    }
}

