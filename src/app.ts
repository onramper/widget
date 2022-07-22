import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { CoreHttpResponse, CoreError } from './core';
import { CurrenciesRepo } from './repo';

export async function getAllCurrencies(repo:CurrenciesRepo): Promise<CoreHttpResponse> {

    let results = await repo.getAllCurrencies();
    return { statusCode: 200, body:json(results) };
}
export function getCurrency(currencyId: string | undefined): CoreHttpResponse {

    // GUARDS
    // -- Handle undefined currency Id
    if (!currencyId) return { statusCode: 400, body: JSON.stringify({ errorCode: 4001, message: `The currency Id is required` }) }
    return { statusCode: 200 };
}
export function getCurrenciesForType(type: string | undefined): CoreHttpResponse {
    return { statusCode: 200 };
}

function json(data: any): string {
    return JSON.stringify(data);
}