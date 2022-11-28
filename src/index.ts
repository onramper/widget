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
    hasTransactionPath,
} from './app';
import { AppDatabase, ErrorCodes, TransactionValidationParams } from './core';

// API CALLS
// -- Application Gateway V2 calls. When V3 comes we will change here.
export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    if (serviceConfig.IsServiceDisabled) {
        return HttpResponse.ServerUnavailable([]);
    }

    const envErrors: CoreError[] = checkForEnvironmentErrors();
    if (envErrors.length > 0) {
        return HttpResponse.InternalServerError(envErrors);
    }

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
                country: event.queryStringParameters?.country?.trim().split(',')[0],
                pay: event.queryStringParameters?.pay?.trim().split(','),
                network: event.queryStringParameters?.network?.trim().split(','),
                type: event.queryStringParameters?.type?.trim().split(','),
                participation: event.queryStringParameters?.participation?.trim().split(','),
                onramp: event.queryStringParameters?.onramp?.trim().split(','),
            });
            break;
        case `POST ${serviceConfig.ApiUrlRoot}/pairs`: {
            if (event.body) {
                const params = JSON.parse(event.body);
                if (isValidTransactionParams(params)) {
                    response = await hasTransactionPath(repository, params);
                } else {
                    response = HttpResponse.BadRequest([
                        new CoreError(
                            1000,
                            'Invalid transaction params. Supply object {amount:number,source:string,target:string,onramp:string,pay:string} in the body of your request.'
                        ),
                    ]);
                }
            } else {
                response = HttpResponse.BadRequest([
                    new CoreError(
                        1000,
                        'Invalid transaction params. Supply object {amount:number,source:string,target:string,onramp:string,pay:string} in the body of your request.'
                    ),
                ]);
            }

            break;
        }
        case `GET ${serviceConfig.ApiUrlRoot}/types`:
            response = await getAllCurrencyTypes(repository);
            break;
        case `GET ${serviceConfig.ApiUrlRoot}/networks`:
            response = await getAllCurrencyNetworks(repository);
            break;
        case `GET ${serviceConfig.ApiUrlRoot}/payment-types`:
            response = await getAllCurrencyPaymentTypes(repository);
            break;
        case `GET ${serviceConfig.ApiUrlRoot}/{currencyId}`: {
            const currencyId = event.pathParameters?.currencyId ? event.pathParameters?.currencyId : '';
            response = await getCurrency(repository, currencyId.trim());
            break;
        }
        default:
            response = HttpResponse.BadRequest([]);
    }

    // Convert the internal CoreHttpResponse object to a native resonse object for the infrastructure.
    return dispatch(response);
};

function checkForEnvironmentErrors(): CoreError[] {
    const errors: CoreError[] = [];

    // -- Verify minimum environment variables set.
    // -- See service.config.json for environment mappings
    // eslint-disable-next-line dot-notation
    if (!process.env[serviceConfig.Environment.DB_HOST]) {
        errors.push({
            errorId: ErrorCodes.EnvVarsError,
            message: `ENV ERROR: The database host name is not set as an environment variable. Set "${serviceConfig.Environment.DB_HOST.trim()}" to the host address of the database.`,
        });
    }

    if (!process.env[serviceConfig.Environment.DB_PORT]) {
        errors.push({
            errorId: ErrorCodes.EnvVarsError,
            message: `ENV ERROR: The database port is not set as an environment variable. Set "${serviceConfig.Environment.DB_PORT.trim()}" to the port number the database is listening.`,
        });
    } else if (
        Number.isNaN(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            Number.parseInt(process.env[serviceConfig.Environment.DB_PORT]!, 10)
        )
    ) {
        errors.push({
            errorId: ErrorCodes.InvalidPortNumber,
            message: `ENV ERROR: Database port number is not a number. Set environment variable "${serviceConfig.Environment.DB_PORT.trim()}" to a port number.`,
        });
    }

    if (!process.env[serviceConfig.Environment.DB_NAME]) {
        errors.push({
            errorId: ErrorCodes.EnvVarsError,
            message: `ENV ERROR: The database name is not set as an environment variable. Set "${serviceConfig.Environment.DB_NAME.trim()}" to the database name you wish to use.`,
        });
    }

    if (!process.env[serviceConfig.Environment.DB_USER]) {
        errors.push({
            errorId: ErrorCodes.EnvVarsError,
            message: `ENV ERROR: The database username is not set as an environment variable. Set "${serviceConfig.Environment.DB_USER.trim()}" to a username of the database.`,
        });
    }

    if (!process.env[serviceConfig.Environment.DB_PASSWORD]) {
        errors.push({
            errorId: ErrorCodes.EnvVarsError,
            message: `ENV ERROR: The database password is not set as an environment variable. Set "${serviceConfig.Environment.DB_PASSWORD.trim()}" to a valid password for the database user.`,
        });
    }

    return errors;
}

function isValidTransactionParams(item: any): item is TransactionValidationParams {
    if ('amount' in item && 'source' in item && 'target' in item && 'pay' in item && 'provider' in item) {
        return true;
    }

    return false;
}

// APPLICATION BOUNDRY
// -- Converts the service defined 'CoreHttpResponse' to the hosting provider defined 'APIGatewayProxyResultV2'
function dispatch(response: CoreHttpResponse): APIGatewayProxyResultV2 {
    return {
        headers: {
            ...response.headers,
            'Content-Type': 'application/json',
        },
        ...response,
    };
}
