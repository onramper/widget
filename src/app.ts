import { CoreDatabaseError, CoreError } from '@onramper/ramp-core/errors';
import { CoreHttpResponse, HttpResponse } from '@onramper/ramp-core/http';
import { CurrenciesQueryParams, CurrencyNotFoundError } from './core';
import { CurrenciesRepo } from './repo';
// CONTROLLERS
// -- Removes quotation marks from the query string values.
function sanitize(param: string | undefined) {
  if (param === undefined) {
    return param;
  }
  // -- The two quotation marks (") are different characters
  return param.replace(/"|"/gi, '');
}

// QUERY PARAMETER OBJECTS

export async function getAllCurrencies(
  repo: CurrenciesRepo,
  params: CurrenciesQueryParams
): Promise<CoreHttpResponse> {
  const results = await repo.getAllCurrencies(params);
  if (results instanceof CoreDatabaseError) {
    return HttpResponse.InternalServerError([results]);
  }

  return HttpResponse.Ok(results);
}

export async function getCurrency(
  repo: CurrenciesRepo,
  currencyId: string
): Promise<CoreHttpResponse> {
  // EXECUTION
  const results = await repo.getCurrency(currencyId);

  // RESULTS
  // -- Handle Errors
  if (results instanceof CurrencyNotFoundError) {
    return HttpResponse.NotFound([results]);
  }

  if (results instanceof CoreDatabaseError) {
    return HttpResponse.InternalServerError([results]);
  }

  // -- Handle Success
  return HttpResponse.Ok(results);
}

export async function getAllCurrencyTypes(
  repo: CurrenciesRepo
): Promise<CoreHttpResponse> {
  const results = await repo.getAllCurrencyTypes();
  if (results instanceof CoreError) {
    return HttpResponse.BadRequest([results]);
  }

  return HttpResponse.Ok(results);
}

export async function getAllCurrencyNetworks(
  repo: CurrenciesRepo
): Promise<CoreHttpResponse> {
  const results = await repo.getAllCurrencyNetworks();
  if (results instanceof CoreError) {
    return HttpResponse.BadRequest([results]);
  }

  return HttpResponse.Ok(results);
}

export async function getAllCurrencyPaymentTypes(
  repo: CurrenciesRepo
): Promise<CoreHttpResponse> {
  const results = await repo.getAllCurrencyPaymentTypes();
  if (results instanceof CoreError) {
    return HttpResponse.BadRequest([results]);
  }

  return HttpResponse.Ok(results);
}
