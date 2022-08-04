import { CurrencyNotFoundError, CurrencyValidationError, CurrenciesOrError } from './core';
import { CurrenciesRepo } from './repo';
import { CoreDatabaseError,CoreError } from "ramp-core/errors";
import { CoreHttpResponse, HttpResponse } from "ramp-core/http";

// CONTROLLERS

export async function getAllCurrencies(repo:CurrenciesRepo, params?:CurrencyQueryParameters): Promise<CoreHttpResponse> {       
    
    let results = await repo.getAllCurrencies(sanitizeParam(params?.countryId));
    if(results instanceof CoreDatabaseError){
        return HttpResponse.InternalServerError([results]);
    }

    return HttpResponse.Ok(results);
}

export async function getCurrency(repo:CurrenciesRepo, currencyId: string): Promise<CoreHttpResponse> {

    // GUARDS
    // -- Handle validation
    let validationsResults:CoreError[] = validateCurrencyId(currencyId);

    if(validationsResults.length > 0){
        return HttpResponse.BadRequest(validationsResults);
    }

    // EXECUTION
    let results = await repo.getCurrency(currencyId);

    // RESULTS
    // -- Handle Errors
    if(results instanceof CurrencyNotFoundError){
        return HttpResponse.NotFound([results]);
    }

    if(results instanceof CoreDatabaseError){
        return HttpResponse.InternalServerError([results]);
    }

    // -- Handle Success
    return HttpResponse.Ok(results);
}

function validateCurrencyId(currencyId:string):CoreError[]{
    let errors:CoreError[] = [];

    // -- Enter validation criteria here.

    return errors;
}

// -- Removes quotation marks from the query string values.
function sanitizeParam(param:string|undefined){
    if(param === undefined){
        return param;
    }
    return param.replace('"','').replace('"','')
}

export async function getCurrenciesForType(repo:CurrenciesRepo, typeName: string): Promise<CoreHttpResponse> {
    let results = await repo.getCurrenciesByType(typeName);       

    return HttpResponse.Ok(results);
}




// QUERY PARAMETER OBJECTS

interface CurrencyQueryParameters{
    countryId?:string    
}
// -- End QUERY PARAMETER OBJECTS

