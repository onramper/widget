import { CoreError } from "@onramper/ramp-core/errors";


// TYPES
//======
type ResultOrError<TResult> = Promise<TResult | CoreError>;
export type CurrenciesOrError = ResultOrError<Currency[]>;
export type CurrencyOrError = ResultOrError<Currency>;


// INTERFACES
//===========
export interface AppDatabase {
    getAllCurrencies(): any;
    getCurrencyForId(id: string): any;
    getCurrrencyTypes(): any;
    getCurrencyForType(typeName: string): any;
    getCurrenciesForCountry(countryId: string): any;
}

// MODELS
//=======
export class Currency {
    id: string;
    name: string;
    type: string;
    symbol: string;
    networks: string[];
    constructor(id: string, name: string, type: string, symbol: string, networks: string[]) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.symbol = symbol;
        this.networks = networks;
    }
}

// CUSTOM ERRORS
//==============
export class CurrencyNotFoundError extends CoreError {
    constructor(currencyId: string) {
        super(
            1002,
            `The currency with Id: ${currencyId} cannot be found. 
            Provide a valid currency Id.`
        );
    }
}

export class CurrencyValidationError extends CoreError {
    constructor(message: string) {
        super(4000, message);
    }
}




