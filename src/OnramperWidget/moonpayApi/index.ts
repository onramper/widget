import processStep from './processStep'
import {StepError} from './errors'
import processFileUpload from './processFileUpload'

const text = ()=>Promise.resolve('Unused')

function successResponse(nextStep:any){
    return {
        ok:true,
        json:()=>Promise.resolve(nextStep),
        text
    }
}

function errorResponse(errorObj: {message:string, field?:string}){
    return {
        ok:false,
        json:()=>Promise.resolve(errorObj),
        text
    }
}

export default async (url: string, body: string | File) => {
    try {
        if (body instanceof File) {
            return successResponse(processFileUpload(url, body));
        } else {
            const [step, token] = url.substr("https://api.onramper.dev/transaction/Moonpay/".length).split('/');
            const parsedBody = JSON.parse(body);
            return successResponse(
                await processStep(step, token, parsedBody, 'es') // TODO: Pass the country retrieved from params or /gateways
            );
        }
    } catch (e) {
        if (e instanceof StepError) {
            return errorResponse({
                message: e.message,
                field: e.field,
            });
        }
        return errorResponse({
            message: 'Unexpected error happened when handling the request',
        });
    }
}