export interface CoreHttpResponse{
    statusCode?: number | undefined;
    headers?: {
        [header: string]: boolean | number | string;
    } | undefined;
    body?: string | undefined;
    isBase64Encoded?: boolean | undefined;
    cookies?: string[] | undefined;
}

export interface CoreError{
    errorId:number,
    message:string
}

export interface AppDatabase{
    getAllCurrencies():Promise<any>;
    getCurrencyForIds(idList:string[]):Currency[];
    getCurrencyForTypes(typesList:string[]):Currency[];
    getCurrenciesForCountry(country:string[]):Currency[];
}

export class Currency{
    id:string;
    name:string;    
    type:string;
    symbol:string;
    networks:string[];
    constructor(id:string,name:string,type:string, symbol:string, networks:string[]){
        this.id=id;
        this.name=name;        
        this.type = type;
        this.symbol = symbol;
        this.networks=networks;
    }
}


