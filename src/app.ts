import { CoreHttpResponse, CoreError, CurrencyNotFoundError, CoreDatabaseError, CurrencyValidationError, CurrenciesOrError } from './core';
import { CurrenciesRepo } from './repo';
import * as response from './responses';

interface CurrencyQueryParameters{
    countryId?:string    
}

export async function getAllCurrencies(repo:CurrenciesRepo, params?:CurrencyQueryParameters): Promise<CoreHttpResponse> {

    let results = await repo.getAllCurrencies(params?.countryId);

    if(results instanceof CoreDatabaseError){
        return response.InternalServerError([results]);
    }

    return response.Ok(results);
}

export async function getCurrency(repo:CurrenciesRepo, currencyId: string): Promise<CoreHttpResponse> {

    // GUARDS
    // -- Handle validation
    let validationsResults:CoreError[] = validateCurrencyId(currencyId);

    if(validationsResults.length > 0){
        return response.BadRequest(validationsResults);
    }

    // EXECUTION
    let results = await repo.getCurrency(currencyId);

    // RESULTS
    // -- Handle Errors
    if(results instanceof CurrencyNotFoundError){
        return response.NotFound([results]);
    }

    if(results instanceof CoreDatabaseError){
        return response.InternalServerError([results]);
    }

    // -- Handle Success
    return response.Ok(results);
}

function validateCurrencyId(currencyId:string):CoreError[]{
    let errors:CoreError[] = [];

    if(currencyId.length < 3 || currencyId.length > 4){
        errors.push(new CurrencyValidationError(`The currencyId path parameter must be either a 3 letter or 4 letter currency code.`));
    }

    return errors;
}

export async function getCurrenciesForType(repo:CurrenciesRepo, typeName: string): Promise<CoreHttpResponse> {
    let results = await repo.getCurrenciesByType(typeName);       

    return response.Ok(results);
}



