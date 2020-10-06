import { publishableApiKey, moonpayBaseAPI, baseUploadsUrl, acceptedContentTypes } from './constants';
import getDocumentHumanName from './documents/getDocumentHumanName';
import processStep from './processStep';
import {encodeToken} from './utils/token'
import { StepError } from './errors';

function generateErrorResponse(message:string){
    throw new StepError(message, null);
}

export type queryStringValues = {
    gatewayIdentifier: string;
    documentType: string;
    txId: string;
    alpha3Country: string;
    token: string;
    side: string;
};

export default async function (
    url: string,
    file: File
) {
    const [
        gatewayIdentifier,
        documentType,
        txId,
        alpha3Country,
        token,
        side,
    ] = url.substr('https://upload.onramper.com/'.length).split('/');
    const contentType = file.type;
    if (!acceptedContentTypes.includes(contentType)) {
        return generateErrorResponse(
            "The only 'content-type's accepted are `image/jpeg`, `image/png` and `application/pdf` but this request is none of these"
        );
    }
    const { signedRequest, key } = (await fetch(
        `${moonpayBaseAPI}/files/s3_signed_request?apiKey=${publishableApiKey}&fileType=${contentType}`
    ).then((res) => res.json())) as {
        key: string;
        signedRequest: string;
    };
    
    await fetch(signedRequest, {method:'PUT', body: file});

    await fetch(`${moonpayBaseAPI}/files`, {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          type: documentType,
          side,
          country: alpha3Country,
        }),
      });
    
      if (
        side === 'front' &&
        (documentType === 'national_identity_card' ||
          documentType === 'driving_licence')
      ) {
        return {
            type: 'file',
            humanName: `${getDocumentHumanName(documentType)} - Back`,
            url: `${baseUploadsUrl}/${gatewayIdentifier}/${documentType}/${txId}/${alpha3Country}/${token}/back`,
            acceptedContentTypes,
          }
      } else {
        const nextStep = await processStep(
          'getNextKYCStep', 
          encodeToken([
            txId,
            token,
          ]),
          '{}',
          'es' // TODO: Un-hardcode country
        );
        return nextStep;
      }
}