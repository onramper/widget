import { DynamoDB } from 'aws-sdk';
import { AppDatabase } from './core';


class ServiceDatabase implements AppDatabase {

    private tableName: string;
    private db: DynamoDB.DocumentClient;

    constructor(tableName: string, region: string) {

        this.tableName = tableName;
        this.db = new DynamoDB.DocumentClient({ region: region });

    }

    async getAllCurrencies():Promise<any> {

        var params = {
            ExpressionAttributeValues: {
                ':s': KeyType.CURRENCY_RECORD_PREFIX,
                ':e': KeyType.ROOT_RECORD
            },
            //KeyConditionExpression: `Id = :s and begins_with(#i,:e)`,
            ProjectionExpression: 'Id, #n, Networks, Symbol, #t',
            ExpressionAttributeNames: {'#n':'Name', '#t':'Type', '#i':'Index'},
            TableName: this.tableName,
            FilterExpression: "begins_with(Id,:s) and #i = :e",
        };

        this.db.scan(params, function(err,data){
            if(err) {console.log(err); return;}
            console.log(data);
        });

        let results = await this.db.scan(params).promise();

        return results.Items;
    }

    getCurrencyForIds(idList: string[]) { return [] }
    getCurrencyForTypes(typesList: string[]) { return [] }
    getCurrenciesForCountry(country: string[]) { return [] }

}

enum KeyType {
    CURRENCY_RECORD_PREFIX = 'Currency#',
    COUNTRY_RECORD_PREFIX = 'Country#',
    ROOT_RECORD = 'Default'
}


export { ServiceDatabase, KeyType }


