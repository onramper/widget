import { Context, APIGatewayProxyResultV2, APIGatewayProxyEventV2, APIGatewayEventRequestContextV2 } from 'aws-lambda';
import serviceConfig from './service-config.json';
import { CoreHttpResponse, CoreError } from './core';
import { ServiceDatabase } from './data';
import { CurrenciesRepo } from "./repo";
import { env } from "process";
import { getAllCurrencies } from "./app";

export const handler = async (event: APIGatewayProxyEventV2, context: APIGatewayEventRequestContextV2): Promise<APIGatewayProxyResultV2> => {

    // CHECK SERVICE GUARDS BEFORE PROCEEDING
    // -- Service guards are specified in service-config.json from the lambda's config layer
    if (serviceConfig.IsServiceDisabled)
        return { statusCode: 503, body: "Service Unavailable" };

    // CHECK ENVIRONMENT FOR ERRORS BEFORE PROCEEDING
    // -- We check all configurations, and if they are invalid an array of CoreErrors are returned.
    let envErrors = checkForEnvironmentErrors();
    if (envErrors.length > 0)
        return { statusCode: 502, body: json(envErrors) };

    // INITIALIZE APPLICATION
    // -- Create repository instance with parameters from the environment. Because of the 'CHECK SERVICE CONFIGURATIONS'
    // -- we are certain these parameters are not null or empty.
    let repository = new CurrenciesRepo(
        new ServiceDatabase(
            env.CURRENCIES_API_TABLE_NAME ? env.CURRENCIES_API_TABLE_NAME : '',
            env.CURRENCIES_API_AWS_REGION ? env.CURRENCIES_API_AWS_REGION : ''
        )
    );

    // EXECUTE REQUEST
    // -- Holds the final response from this application.
    let response: CoreHttpResponse;    
    // -- Routing based on APIGatewayProxyEventV2.routeKey
    switch (event.routeKey) {
        case "GET /":
            response = await getAllCurrencies(repository);
            break;
        default:
            response = RouteUnavailable();
    }

    // Convert the internal CoreHttpResponse object to a native resonse object for the infrastructure.
    return dispatch(response);
};









function checkForEnvironmentErrors(): CoreError[] {

    let errors: CoreError[] = [];

    // -- Verify minimum environment variables set.
    if (!process.env.CURRENCIES_API_TABLE_NAME) {
        errors.push({
            errorId: 5021,
            message: `The datasource table name "${process.env.CURRENCIES_API_TABLE_NAME}" in environment, is invalid. Please set environment variable "CURRENCIES_API_TABLE_NAME" to a valid table.`
        });
    }

    if (!process.env.CURRENCIES_API_AWS_REGION) {
        errors.push({
            errorId: 5022,
            message: `The datasource region "${process.env.CURRENCIES_API_AWS_REGION}" in environment, is invalid. Please set environment variable "CURRENCIES_API_AWS_REGION" to a valid value.`
        });
    }

    return errors;
}


function RouteUnavailable(): CoreHttpResponse {
    return { statusCode: 400, body: 'Bad Request: The route you requested is invaild' };
}

function json(data: any): string {
    return JSON.stringify(data);
}

// The dispatch function will convert our internal response format to our infrastructure format
function dispatch(response: CoreHttpResponse): APIGatewayProxyResultV2 {
    return {
        ...response
    };
}
