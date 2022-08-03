import { DynamoDB } from 'aws-sdk';
import { AppDatabase } from './core';
import { CoreDatabaseError } from "./onramper/errors";

export { ServiceDatabase };



// DATABSE CONSTANTS
//=================
const KeySeperator: string = '#';

const CurrencyTypeIndex: string = "TypeIndex";

const enum KeyParts {

    CURRENCY_KEY_PREFIX = 'Currency',

    COUNTRY_KEY_PREFIX = 'Country',

    ROOT_RECORD = 'Default'

}


// KEY CONVERSIONS
//============
const CurrencyKey = (currencyId: string) => {
    if (currencyId === "") { return ""; }

    return KeyParts.CURRENCY_KEY_PREFIX.concat(
        KeySeperator,
        currencyId.toUpperCase()
    );
};

const CountryKey = (countryId: string):string => {   

    return KeyParts.COUNTRY_KEY_PREFIX.concat(
        KeySeperator,
        countryId.toUpperCase()
    );
};

const GetIdFromKeyEnd = (currencykey: string) => {
    if (currencykey === "") { return ""; }

    const keyComponents: string[] = currencykey.split(KeySeperator);
    // The Id is at the very end of the key string.
    return keyComponents[keyComponents.length - 1];
};


// DATABASE IMPLEMENTATION
//========================
class ServiceDatabase implements AppDatabase {

    private tableName: string;
    private db: DynamoDB.DocumentClient;

    constructor(tableName: string, region: string, endpointUrl?: string) {

        this.tableName = tableName;
        this.db = new DynamoDB.DocumentClient({ region: region, endpoint: endpointUrl });

    }

    async getAllCurrencies(): Promise<any> {

        var params = {
            ExpressionAttributeValues: {
                ':s': KeyParts.CURRENCY_KEY_PREFIX,
                ':e': KeyParts.ROOT_RECORD
            },
            //KeyConditionExpression: `Id = :s and begins_with(#i,:e)`,
            ProjectionExpression: 'Id, #n, Networks, Symbol, #t',
            ExpressionAttributeNames: { '#n': 'Name', '#t': 'Type' },
            TableName: this.tableName,
            FilterExpression: "begins_with(Id,:s) and RecordKey = :e",
        };

        let results = await this.db.scan(params).promise();

        // -- Handle the case where result may be an error.
        if (results.$response.error)
            return new CoreDatabaseError(this.tableName, results.$response.error);


        return results.Items;
    }

    async getCurrencyForId(id: string): Promise<any> {
        let params = {
            TableName: this.tableName,
            Key: {
                Id: CurrencyKey(id),
                RecordKey: KeyParts.ROOT_RECORD
            },
            ProjectionExpression: 'Id, #n, Networks, Symbol, #t',
            ExpressionAttributeNames: { '#n': 'Name', '#t': 'Type' },
        };

        let results = await this.db.get(params).promise();

        // -- Handle the case where result may be an error.
        if (results.$response.error) {
            return new CoreDatabaseError(this.tableName, results.$response.error);
        }
        return results.Item;
    }

    async getCurrrencyTypes():Promise<any>{
        // Implement a unique list of currency
    }

    async getCurrencyForType(typeName: string): Promise<any> {

        let params = {
            TableName: this.tableName,
            IndexName: CurrencyTypeIndex,   
            KeyConditionExpression:'#t = :t',         
            ProjectionExpression: 'Id, #n, Networks, Symbol, #t',
            ExpressionAttributeNames: { '#n': 'Name', '#t': 'Type' },     
            ExpressionAttributeValues:{':t':typeName,':c':KeyParts.CURRENCY_KEY_PREFIX},       
            FilterExpression:'begins_with(Id,:c) and #t = :t'
        }            

        let results = await this.db.scan(params).promise();

        return results.Items;
    }

    async getCurrenciesForCountry(countryId: string): Promise<any> {     
        
        let params = {
            TableName: this.tableName,
            Key: {
                Id: CountryKey(countryId),
                RecordKey: KeyParts.ROOT_RECORD
            },
            ProjectionExpression: 'BlackList'
        };

        let results = await this.db.get(params).promise();        

        if (results.$response.error) {
            return new CoreDatabaseError(this.tableName, results.$response.error);
        }        
        
        // -- If the list is empty or a record does not exist, that means no country restrictions are to be applied.
        if (!results.Item?.BlackList) {
            return this.getAllCurrencies();
        }
        
        let blacklist: string[] = JSON.parse(JSON.stringify(results.Item?.BlackList));      

        // This scan operation must be replaced by a cached record.
        let currencyResults = await this.getAllCurrencies();

        let items = currencyResults.filter((element:any) => {
            return !blacklist.includes(GetIdFromKeyEnd(element.Id));
        });
        return items;
    }
}

