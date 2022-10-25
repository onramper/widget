import { APIGatewayProxyResultV2, APIGatewayProxyEventV2 } from 'aws-lambda';
import { CoreError } from '@onramper/ramp-core/errors';
import { CoreHttpResponse, HttpResponse } from '@onramper/ramp-core/http';
import { env } from 'process';
import serviceConfig from './service.config.json';
import AuroraPostgresDatabase from './data';

import { CurrenciesRepo } from './repo';
import {
  getAllCurrencies,
  getCurrency,
  getAllCurrencyTypes,
  getAllCurrencyNetworks,
  getAllCurrencyPaymentTypes,
} from './app';
import { AppDatabase, ErrorCodes } from './core';

// API CALLS
// -- Application Gateway V2 calls. When V3 comes we will change here.
export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  // CHECK SERVICE GUARDS BEFORE PROCEEDING
  // -- Service guards are specified in service.config.json from the lambda's config layer
  if (serviceConfig.IsServiceDisabled) {
    return HttpResponse.ServerUnavailable([]);
  }

  // CHECK ENVIRONMENT FOR ERRORS BEFORE PROCEEDING
  // -- checking environment variables
  const envErrors: CoreError[] = checkForEnvironmentErrors();
  if (envErrors.length > 0) {
    return HttpResponse.InternalServerError(envErrors);
  }

  // INITIALIZE APPLICATION
  // -- Create repository instance with parameters from the environment. Because of the 'checkForEnvironmentErrors()'
  // -- we are certain these parameters are not null or empty.

  let repository: CurrenciesRepo;

  try {
    const database: AppDatabase = new AuroraPostgresDatabase(
      env.DB_HOST!,
      Number.parseInt(env.DB_PORT!, 10),
      env.DB_NAME!,
      env.DB_USER!,
      env.DB_PASSWORD!
    );
    repository = new CurrenciesRepo(database);
  } catch (error) {
    return HttpResponse.InternalServerError([
      {
        errorId: ErrorCodes.OtherDatabaseError,
        message: `Could not access the database. ERROR:: ${error}`,
      },
    ]);
  }

  // EXECUTE REQUEST
  // -- Holds the final response from this application.
  let response: CoreHttpResponse;
  // -- Routing based on APIGatewayProxyEventV2.routeKey

  switch (event.routeKey) {
    case `GET ${serviceConfig.ApiUrlRoot}`:
      response = await getAllCurrencies(repository, {
        country: event.queryStringParameters?.country?.split(',')[0],
        pay: event.queryStringParameters?.pay?.split(','),
        network: event.queryStringParameters?.network?.split(','),
        type: event.queryStringParameters?.type?.split(','),
        participation: event.queryStringParameters?.participation?.split(','),
        onramp: event.queryStringParameters?.onramp?.split(','),
      });
      break;
    case `GET ${serviceConfig.ApiUrlRoot}/types`:
      response = await getAllCurrencyTypes(repository);
      break;
    case `GET ${serviceConfig.ApiUrlRoot}/networks`:
      response = await getAllCurrencyNetworks(repository);
      break;
    case `GET ${serviceConfig.ApiUrlRoot}/payment-types`:
      response = await getAllCurrencyPaymentTypes(repository);
      break;
    case `GET ${serviceConfig.ApiUrlRoot}/{currencyId}`:
      response = await getCurrency(
        repository,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        event.pathParameters?.currencyId!
      );
      break;
    default:
      response = HttpResponse.BadRequest([]);
  }

  // Convert the internal CoreHttpResponse object to a native resonse object for the infrastructure.
  return dispatch(response);
};

function checkForEnvironmentErrors(): CoreError[] {
  const errors: CoreError[] = [];

  // -- Verify minimum environment variables set.
  if (!process.env.DB_HOST) {
    errors.push({
      errorId: ErrorCodes.EnvVarsError,
      message: `ENV ERROR: The database host name is not set as an environment variable. Set "DB_HOST" to the host address of the database.`,
    });
  }

  if (!process.env.DB_PORT) {
    errors.push({
      errorId: ErrorCodes.EnvVarsError,
      message: `ENV ERROR: The database port is not set as an environment variable. Set "DB_PORT" to the port number the database is listening.`,
    });
  } else if (Number.isNaN(Number.parseInt(process.env.DB_PORT, 10))) {
    errors.push({
      errorId: ErrorCodes.InvalidPortNumber,
      message: `ENV ERROR: Database port number is not a number. Set environment variable "DB_PORT" to a port number.`,
    });
  }

  if (!process.env.DB_NAME) {
    errors.push({
      errorId: ErrorCodes.EnvVarsError,
      message: `ENV ERROR: The database name is not set as an environment variable. Set "DB_NAME" to the database name you wish to use.`,
    });
  }

  if (!process.env.DB_USER) {
    errors.push({
      errorId: ErrorCodes.EnvVarsError,
      message: `ENV ERROR: The database username is not set as an environment variable. Set "DB_USER" to a username of the database.`,
    });
  }

  if (!process.env.DB_PASSWORD) {
    errors.push({
      errorId: ErrorCodes.EnvVarsError,
      message: `ENV ERROR: The database password is not set as an environment variable. Set "DB_PASSWORD" to a valid password for the database user.`,
    });
  }

  return errors;
}

// APPLICATION BOUNDRY
// -- Converts the service defined 'CoreHttpResponse' to the hosting provider defined 'APIGatewayProxyResultV2'
function dispatch(response: CoreHttpResponse): APIGatewayProxyResultV2 {
  return {
    ...response,
  };
}
