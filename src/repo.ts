import { CoreError } from '@onramper/ramp-core/errors';

import {
    Currency,
    AppDatabase,
    CurrenciesOrError,
    CurrencyNotFoundError,
    CurrenciesQueryParams,
} from './core';

// APPLICATION REPOSITORY IMPLEMENTATION
class CurrenciesRepo {
    private db: AppDatabase;

    constructor(db: AppDatabase) {
        this.db = db;
    }

    async getAllCurrencies(params: CurrenciesQueryParams): CurrenciesOrError {
        const results = await this.db.getCurrenciesInfo(params);

        if (results instanceof CoreError) return results;

        return results.map((element: any) => {
            return new Currency(
                element.currencyindexid,
                element.currencyid,
                element.name,
                element.type,
                element.symbol,
                element.network
            );
        });
    }

    async getCurrency(currencyId: string): CurrenciesOrError {
        const currency = await this.db.getCurrencyForId(currencyId);

        if (currency instanceof CoreError) {
            return currency;
        }

        if (!currency || currency.length === 0) {
            return new CurrencyNotFoundError(currencyId);
        }

        const results = currency.map((currencyItem: any) => {
            return new Currency(
                currencyItem.currencyindexid,
                currencyItem.currencyid,
                currencyItem.name,
                currencyItem.type,
                currencyItem.symbol,
                currencyItem.network
            );
        });
        return results;
    }

    async IsValidTransaction(
        amount: number,
        source: string,
        target: string,
        onrampid: string,
        paymentMethod: string
    ): Promise<boolean> {
        return this.db.hasPairProvider(
            amount,
            source,
            target,
            onrampid,
            paymentMethod
        );
    }

    async getAllCurrencyTypes() {
        const results = await this.db.getCurrrencyTypes();
        return results;
    }

    async getAllCurrencyNetworks() {
        const results = await this.db.getAllNetworks();
        return results;
    }

    async getAllCurrencyPaymentTypes() {
        const results = await this.db.getAllPaymentTypes();
        return results;
    }
}

export { CurrenciesRepo };
