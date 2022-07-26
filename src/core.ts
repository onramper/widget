import { basename } from "path";

type ResultOrError<TResult> = Promise<TResult | CoreError>;
export type CurrenciesOrError = ResultOrError<Currency[]>;
export type CurrencyOrError = ResultOrError<Currency>;
export type AsyncAny = Promise<any>;

export interface CoreHttpResponse {
    statusCode?: number | undefined;
    headers?: {
        [header: string]: boolean | number | string;
    } | undefined;
    body?: string | undefined;
    isBase64Encoded?: boolean | undefined;
    cookies?: string[] | undefined;
}

export class CoreError {
    public errorId: number;
    public message: string;

    constructor(id: number, message: any) {
        this.errorId = id;
        this.message = message;
    }
}

export class CoreDatabaseError extends CoreError{
    constructor(databaseName:string, databaseError:object){
        super(1000,`Database "${databaseName}" returned an error while querying for all currencies. DATABASE-ERROR:: "${JSON.stringify(databaseError)}"`);
    }
}

export class CoreRESTServiceError extends CoreError{
    constructor(path?:string,method?:string,message?:object){
        super(1001, `An error was received while calling endpoint #|${path}|# with verb #"${method}"#. ENDPOINT-ERROR:: #"${JSON.stringify(message)}"#`);
    }
}

export class CoreConfigNotFoundError extends CoreError{
    constructor(configFileName:string, message?:object){
        super(1002, `Configuration file named "${configFileName}" cannot not be found. CONFIG-ERROR:: ${JSON.stringify(message)}`);
    }
}

export class CurrencyNotFoundError extends CoreError{
    constructor(currencyId:string){
        super(1002, `The currency with Id: ${currencyId} cannot be found. Provide a valid currency Id.`);
    }
}

export class CurrencyValidationError extends CoreError{
    constructor(message:string){
        super(4000, message);
    }
}


export interface AppDatabase {
    getAllCurrencies(): any;
    getCurrencyForId(id: string): any;
    getCurrencyForType(typeName: string): any;
    getCurrenciesForCountry(countryId: string): any;
}

// error message
export interface HttpError {
    code: string,
    type: string,
    title: string,
    details: string,
    instance: string,
}

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

