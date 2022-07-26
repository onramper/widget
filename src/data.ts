import { DynamoDB, SSOOIDC } from 'aws-sdk';
import { GetItemInput, ScanInput } from 'aws-sdk/clients/dynamodb';
import { AppDatabase, Currency, CoreError, CurrenciesOrError, CurrencyOrError, CoreDatabaseError, CurrencyNotFoundError } from './core';

enum KeyType {
    CURRENCY_RECORD_PREFIX = 'Currency#',
    COUNTRY_RECORD_PREFIX = 'Country#',
    ROOT_RECORD = 'Default'
}

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
                ':s': KeyType.CURRENCY_RECORD_PREFIX,
                ':e': KeyType.ROOT_RECORD
            },
            //KeyConditionExpression: `Id = :s and begins_with(#i,:e)`,
            ProjectionExpression: 'Id, #n, Networks, Symbol, #t',
            ExpressionAttributeNames: { '#n': 'Name', '#t': 'Type', '#i': 'Index' },
            TableName: this.tableName,
            FilterExpression: "begins_with(Id,:s) and #i = :e",
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
                Id: KeyType.CURRENCY_RECORD_PREFIX + id.toUpperCase(),
                Index: KeyType.ROOT_RECORD
            },
            ProjectionExpression: 'Id, #n, Networks, Symbol, #t',
            ExpressionAttributeNames: { '#n': 'Name', '#t': 'Type'},
        };

        let results = await this.db.get(params).promise();

        // -- Handle the case where result may be an error.
        if (results.$response.error){
            return new CoreDatabaseError(this.tableName, results.$response.error);
        }        

        return results.Item;

    }

    getCurrencyForType(typeName: string) { return [] }

    async getCurrenciesForCountry(countryId: string) {         

        let params = {
            TableName: this.tableName,            
            KeyConditionExpression: "Id = :i and #i = :e",                
            ProjectionExpression: "Id, #n",
            ExpressionAttributeNames: { "#n": "BlackList","#i":"Index"},
            ExpressionAttributeValues:{":i":KeyType.COUNTRY_RECORD_PREFIX+countryId.toUpperCase(), ":e":KeyType.ROOT_RECORD}
        };

        let results = await this.db.query(params).promise();

        if (results.$response.error){
            return new CoreDatabaseError(this.tableName, results.$response.error);
        }  

        if(!results.Items){
            return this.getAllCurrencies();
        }

        let blacklist = results.Items[0].BlackList;

        let list = blacklist?.map((currencyItemId:any) => {
            return KeyType.CURRENCY_RECORD_PREFIX.concat(currencyItemId);
        });

        let paramsForCurrencies = {
            ExpressionAttributeValues: {                            
                ':e': KeyType.ROOT_RECORD,
                ':b': KeyType.CURRENCY_RECORD_PREFIX
            },
            //KeyConditionExpression: `Id = :s and begins_with(#i,:e)`,
            ProjectionExpression: 'Id, #n, Networks, Symbol, #t',
            ExpressionAttributeNames: { '#n': 'Name', '#t': 'Type', '#i': 'Index'},
            TableName: this.tableName,
            FilterExpression: "begins_with(Id,:b) and #i = :e",                        
        };

        let currencyResults = await this.db.scan(paramsForCurrencies).promise();

        // -- Handle the case where result may be an error.
        if (currencyResults.$response.error)
            return new CoreDatabaseError(this.tableName, currencyResults.$response.error);
        
        let items = currencyResults.Items?.filter(element=>{
            return !list.includes(element.Id);
        });


        return items;         
    }

}




export { ServiceDatabase, KeyType }


