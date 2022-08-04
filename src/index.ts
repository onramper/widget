import { 
    APIGatewayProxyResultV2, 
    APIGatewayProxyEventV2, 
    APIGatewayEventRequestContextV2, 
    SQSEvent 
} from 'aws-lambda';

import serviceConfig from './service.config.json';
import { CoreError } from 'ramp-core/errors';
import { CoreHttpResponse, HttpResponse } from "ramp-core/http";
import { ServiceDatabase } from './data';
import { CurrenciesRepo } from "./repo";
import { env } from "process";
import { getAllCurrencies, getCurrency, getCurrenciesForType } from "./app";


// API CALLS
// -- Application Gateway V2 calls. When V3 comes we will change here.
export const apiHandler = async (
    event: APIGatewayProxyEventV2,
    context: APIGatewayEventRequestContextV2)

    : Promise<APIGatewayProxyResultV2> => {

    // CHECK SERVICE GUARDS BEFORE PROCEEDING
    // -- Service guards are specified in service.config.json from the lambda's config layer
    if (serviceConfig.IsServiceDisabled) {
        return HttpResponse.ServerUnavailable([]);
    }

    // CHECK ENVIRONMENT FOR ERRORS BEFORE PROCEEDING
    // -- We check all configurations, and if they are invalid an array of CoreErrors are returned.
    let envErrors = checkForEnvironmentErrors();
    if (envErrors.length > 0) {
        return HttpResponse.InternalServerError(envErrors);
    }

    // INITIALIZE APPLICATION
    // -- Create repository instance with parameters from the environment. Because of the 'CHECK SERVICE CONFIGURATIONS'
    // -- we are certain these parameters are not null or empty.

    let repository: CurrenciesRepo;

    try {
        repository = new CurrenciesRepo(
            new ServiceDatabase(
                // -- CURRENCIES_API_TABLE_NAME and CURRENCIES_API_AWS_REGION have already been validated
                //    in checkForEnvironmentErrors() above
                env.CURRENCIES_API_TABLE_NAME!,
                env.CURRENCIES_API_AWS_REGION!,
                // -- Because CURRENCIES_API_AWS_ENDPOINT_URL has not been validated yet.
                env.CURRENCIES_API_AWS_ENDPOINT_URL ? env.CURRENCIES_API_AWS_ENDPOINT_URL : undefined
            )
        );
    } catch (error) {
        return HttpResponse.InternalServerError(
            [
                {
                    errorId: 1134,
                    message: "Could not access the database. ERROR:: " + error
                }
            ]
        );
    }

    // EXECUTE REQUEST
    // -- Holds the final response from this application.
    let response: CoreHttpResponse;
    // -- Routing based on APIGatewayProxyEventV2.routeKey

    switch (event.routeKey) {
        case `GET ${serviceConfig.apiUrlRoot}`:
            response = await getAllCurrencies(repository, { countryId: event.queryStringParameters?.country });
            break;
        case `GET ${serviceConfig.apiUrlRoot}/types`:
            response = await getCurrenciesForType(repository, "");
            break;
        case `GET ${serviceConfig.apiUrlRoot}/types/{typeName}`:
            response = await getCurrenciesForType(repository, event.pathParameters?.typeName!);
            break;
        case `GET ${serviceConfig.apiUrlRoot}/{currencyId}`:
            response = await getCurrency(repository, event.pathParameters?.currencyId!);
            break;
        default:
            response = HttpResponse.BadRequest([]);
    }

    // Convert the internal CoreHttpResponse object to a native resonse object for the infrastructure.
    return dispatch(response);
}

// SYSTEM EVENTS
// -- Implementation for Onrampers SQS service
export const msgHandler = async (event: SQSEvent) => {

    // TODO [ high ]: Integration code goes here ...

}

function checkForEnvironmentErrors(): CoreError[] {

    let errors: CoreError[] = [];

    // -- Verify minimum environment variables set.
    if (!process.env.CURRENCIES_API_TABLE_NAME) {
        errors.push({
            errorId: 5021,
            message: `The datasource table name in the environment, is not set. 
                      Please set environment variable "CURRENCIES_API_TABLE_NAME" to a valid table.`
        });
    }

    if (!process.env.CURRENCIES_API_AWS_REGION) {
        errors.push({
            errorId: 5022,
            message: `The datasource region in the environment, is not set. 
                      Please set environment variable "CURRENCIES_API_AWS_REGION" to a valid value.`
        });
    }

    return errors;
}

// APPLICATION BOUNDRY
// -- Converts the service defined 'CoreHttpResponse' to the hosting provider defined 'APIGatewayProxyResultV2'
function dispatch(response: CoreHttpResponse): APIGatewayProxyResultV2 {
    return {
        ...response
    };
}
