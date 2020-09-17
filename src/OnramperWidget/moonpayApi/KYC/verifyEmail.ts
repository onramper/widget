import { nextStep, stepDataItems } from '../utils/lambda-response';
import { moonpayBaseAPI, identifier, publishableApiKey, baseAPIUrl } from '../constants';
import { verifyEmailAPIResponse } from './api';
import { StepError } from '../errors';
import { encodeToken } from '../utils/token';
import { emailVerifiedTx } from './dynamoTxs';
import ddb from '../utils/dynamodb';
import getNextKYCStepFromTxIdAndToken from './getNextKYCStepFromTxIdAndToken';
import fetch from '../utils/fetch';
import * as items from './items';

export default async function (
  id: string,
  email: string,
  code: string,
  country: string
): Promise<nextStep> {
  let res: Response;
  try {
    res = await fetch(
      `${moonpayBaseAPI}/customers/email_login?apiKey=${publishableApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          securityCode: code,
        }),
      }
    );
  } catch (e) {
    throw new StepError(
      'The email code has been rejected.',
      items.verifyEmailCodeItem.name
    );
  }
  const customer = ((await res.json()) as verifyEmailAPIResponse).customer;
  let token = 'not needed, this is done through cookies';
  // There's a weird thing going on with csrf vs jwt tokens, it seems like only JWT tokens work
  await ddb.put({
    PK: `tx#${id}`,
    SK: `verifyEmail`,
    Timestamp: Date.now(),
    jwtToken: token,
  } as emailVerifiedTx);
  if (
    customer.firstName === null ||
    customer.dateOfBirth === null ||
    customer.address.street === null
  ) {
    const requiredData: stepDataItems = [
      items.firstNameItem,
      items.lastNameItem,
      items.streetItem,
      items.townItem,
      items.postCodeItem,
      items.countryItem,
    ];
    requiredData.push(items.dateOfBirthItem);
    if (country === 'us') {
      requiredData.push(items.optionalStateItem);
    }
    return {
      type: 'form',
      url: `${baseAPIUrl}/transaction/${identifier}/identity/${encodeToken([
        id,
      ])}`,
      data: requiredData,
    };
  }
  return getNextKYCStepFromTxIdAndToken(id, token);
}
