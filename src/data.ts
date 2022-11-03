import { Pool } from 'pg';
import { CoreError } from '@onramper/ramp-core/errors';
import { AppDatabase, ErrorCodes, CurrenciesQueryParams } from './core';

export default class AuroraPostgresDatabase implements AppDatabase {
    private dbPool;

    private readonly currencyShapeQuery: string;

    constructor(
        host: string,
        port: number,
        databaseName: string,
        username: string,
        password: string
    ) {
        this.dbPool = new Pool({
            host,
            port,
            user: username,
            password,
            database: databaseName,
        });

        this.currencyShapeQuery =
            'select currencyindexid,currencyid,c.name,networks.name as network,symbol, types.name as type from currencies as c left join currencynetworks as networks on c.networkid = networks.id left join currencytypes as types on c.typeid = types.id';
    }

    private arrayToLower(stringArray: string[]): string[] {
        if (stringArray.length === 0) return stringArray;
        return stringArray.map((item: string) => item.toLowerCase());
    }

    private arrayToUpper(stringArray: string[]): string[] {
        if (stringArray.length === 0) return stringArray;
        return stringArray.map((item: string) => item.toLowerCase());
    }

    async getCurrenciesInfo(params: CurrenciesQueryParams) {
        const client = await this.dbPool.connect();
        let query = `select fin.currencyindexid,fin.currencyid,fin.name,fin.symbol,fin.network as network,fin.type as type from ( select a.currencyindexid,a.currencyid,a.name,a.symbol,n.name as network,t.name as type from (select currencyindexid,currencyid,name,symbol,networkid,typeid from currencies where true`;
        const queryParams = [];
        let paramcount = 1;
        if (params.country) {
            query = query.concat(
                ` and currencyindexid not in (select currencyindexid from countrycurrencyblacklist where countryisocode=$${paramcount} )`
            );
            paramcount += 1;
            queryParams.push(params.country.toLowerCase());
        }

        if (params.onramp || params.participation) {
            const currencyPairQueryRoot = `and currencyindexid in (`;
            let onrampFilter = 'true';
            if (params.onramp) {
                onrampFilter = ` onrampid=any($${paramcount})`;
                paramcount += 1;
                queryParams.push(this.arrayToLower(params.onramp));
            }

            const sourceFilter = `select sourcecurrencyindexid as id from currencypairs where ${onrampFilter}`;
            const targetFilter = `select targetcurrencyindexid as id from currencypairs where ${onrampFilter}`;

            if (params.participation) {
                params.participation.map((participation) =>
                    participation.toLowerCase()
                );
            }

            if (
                !params.participation ||
                (params.participation &&
                    params.participation.includes('source') &&
                    params.participation.includes('target'))
            ) {
                query = `${query} ${currencyPairQueryRoot} ${sourceFilter} union ${targetFilter}`;
            } else if (
                params.participation &&
                params.participation.includes('source')
            ) {
                query = `${query} ${currencyPairQueryRoot} ${sourceFilter}`;
            } else if (
                params.participation &&
                params.participation.includes('target')
            ) {
                query = `${query} ${currencyPairQueryRoot} ${targetFilter}`;
            } else {
                query = `${query} ${currencyPairQueryRoot} ${sourceFilter} union ${targetFilter}`;
            }
            query += ')';
        }

        if (params.pay) {
            console.log('Payment Params ', params.pay);
            const currencyPayQueryRoot = `and currencyindexid in (`;
            let onrampParam = '';

            if (params.onramp) {
                onrampParam = ` and onrampid = any($${paramcount})`;
                paramcount += 1;
                queryParams.push(this.arrayToLower(params.onramp));
            }

            const paymentTypeQuery = `select currencyindexid from currencypayments where paymenttypeid in (select id from paymenttypes where name = any($${paramcount}))`;
            paramcount += 1;
            queryParams.push(this.arrayToLower(params.pay));

            query += ` ${currencyPayQueryRoot} ${paymentTypeQuery} ${onrampParam}`;
            query += ')';
        }

        if (params.network) {
            query = query.concat(
                ` and networkid = any(select id from currencynetworks where name=any($${paramcount}))`
            );
            paramcount += 1;
            queryParams.push(this.arrayToLower(params.network));
        }
        if (params.type) {
            query = query.concat(
                ` and typeid = any(select id from currencytypes where name=any($${paramcount}))`
            );
            paramcount += 1;
            queryParams.push(this.arrayToLower(params.type));
        }

        query = query.concat(
            ' ) as a left join currencynetworks as n on a.networkid = n.id left join currencytypes as t on a.typeid = t.id ) as fin'
        );

        const results = (await client.query(query, queryParams)).rows;

        client.release(true);
        return results;
    }

    async hasPairProvider(
        amount: number,
        sourceCurrency: string,
        targetCurrency: string,
        onrampid: string,
        paymentMethod: string
    ): Promise<boolean> {
        const client = await this.dbPool.connect();
        const query = `with sourceCurrency as (select currencyindexid from currencies where currencyid = $1), targetCurrency as (select currencyindexid from currencies where currencyid = $2), paymentTypes as (select id from paymenttypes where name=$4 ) select COUNT(*) as Number_Of_Paths from (select * from currencypairs where sourcecurrencyindexid in (select currencyindexid from sourceCurrency) and targetcurrencyindexid in (select currencyindexid from targetcurrency) and onrampid = $3) as pairs left join currencypayments as payments on pairs.sourcecurrencyindexid = payments.currencyindexid and pairs.onrampid = payments.onrampid inner join paymentTypes as paytypes on paytypes.id = payments.paymenttypeid where payments.minamount <= $5 and payments.maxamount > $5`;
        const results = (
            await client.query(query, [
                sourceCurrency,
                targetCurrency,
                onrampid,
                paymentMethod,
                amount,
            ])
        ).rows;
        console.log('RESULTS ', results[0]);
        console.log(
            'Converstion ',
            Number.parseInt(results[0].Number_Of_Paths, 10)
        );
        client.release(true);
        return (
            results &&
            results.length > 0 &&
            Number.parseInt(results[0].number_of_paths, 10) > 0
        );
    }

    async getCurrencyForId(id: string) {
        const client = await this.dbPool.connect();
        const queryParams = [];

        const queryString: string =
            this.currencyShapeQuery.concat(` where currencyid=$1`);
        queryParams.push(id.toUpperCase());
        const results = (await client.query(queryString, queryParams)).rows;

        client.release(true);

        return results;
    }

    /* eslint-disable */
    async getCurrrencyTypes() {
        const client = await this.dbPool.connect();
        const typesArray = `select name, description from currencytypes where enabled=true and deleted = false`;
        const results = (await client.query(typesArray)).rows;

        client.release(true);
        return results;
    }

    async getAllNetworks() {
        const client = await this.dbPool.connect();
        const typesArray = `select name, description from currencynetworks where enabled=true and deleted = false`;
        const results = (await client.query(typesArray)).rows;

        client.release(true);
        return results;
    }

    async getAllPaymentTypes() {
        const client = await this.dbPool.connect();
        const typesArray = `select name, description from paymenttypes where enabled=true and deleted = false`;
        const results = (await client.query(typesArray)).rows;

        client.release(true);
        return results;
    }

    async getCurrencyCountryBlackList(
        countryId?: string
    ): Promise<string[] | CoreError> {
        let validationExpr: RegExp = new RegExp('[a-zA-Z]{2}');

        if (!countryId) {
            return [];
        }

        if (!validationExpr.test(countryId)) {
            return new CoreError(
                ErrorCodes.InvalidCountryCode,
                `The country code ${countryId.trim()} is invalid. Please pass an ISO 3166-1 alpha-2 compliant country code.`
            );
        }

        const query = `select c.currencyid from countrycurrencyblacklist as b left join currencies as c on c.currencyindexid=b.currencyindexid where countryisocode=$1`;
        const queryParams: any[] = [countryId.toLowerCase()];
        const client = await this.dbPool.connect();
        let results = (await client.query(query, queryParams)).rows;

        const returnRes: string[] = results.map((item) => {
            return item.currencyid;
        });

        client.release(true);
        return returnRes;
    }
}
