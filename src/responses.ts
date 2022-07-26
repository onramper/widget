import { CoreHttpResponse, CoreError } from "./core";


export function Ok(items?: any): CoreHttpResponse {    
    return createCoreHttpResponse(200, items);
}

export function Created(items?: any): CoreHttpResponse {    
    return createCoreHttpResponse(201, items);
}

export function Accepted(items?: any): CoreHttpResponse {
    return createCoreHttpResponse(202, items);
}

export function NoContent(): CoreHttpResponse {
    return createCoreHttpResponse(204);
}

export function MultipleChoices(choices: CoreHttpResponse[]): CoreHttpResponse {
    return createCoreHttpResponse(300, choices);
}

export function BadRequest(errors: CoreError[]): CoreHttpResponse {
    return createCoreHttpResponse(400, errors);
}

export function ServerUnavailable(errors: CoreError[]): CoreHttpResponse {
    return createCoreHttpResponse(503, errors);
}

export function InternalServerError(errors: CoreError[]): CoreHttpResponse {
    return createCoreHttpResponse(500, errors);
}
export function NotFound(errors: CoreError[]): CoreHttpResponse {
    return createCoreHttpResponse(404, errors);
}


function createCoreHttpResponse(code: number, message?: string | object): CoreHttpResponse {

    let response: CoreHttpResponse = { statusCode: code };

    if (message && typeof (message) === 'object')
        response.body = JSON.stringify(message);
    else if (message && typeof (message) === 'string')
        response.body = message;

    return response;
}