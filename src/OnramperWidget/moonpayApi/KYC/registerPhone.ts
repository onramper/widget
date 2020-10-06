import { moonpayBaseAPI, identifier, baseAPIUrl } from '../constants';
import { nextStep } from '../utils/lambda-response';
import { StepError } from '../errors';
import { encodeToken } from '../utils/token';
import fetch from '../utils/fetch';
import * as items from './items';

export default async function (
  id: string,
  token: string,
  phoneCountryCode: number,
  phoneNumber: number
): Promise<nextStep> {
  try {
    await fetch(`${moonpayBaseAPI}/customers/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
      },
      body: JSON.stringify({
        phoneNumber: `+${phoneCountryCode}${phoneNumber}`,
      }),
    }).then((r) => r.json());
  } catch (e) {
    throw new StepError(
      'The provided phone number has not been accepted.',
      items.phoneNumberItem.name
    );
  }
  return {
    type: 'form',
    url: `${baseAPIUrl}/transaction/${identifier}/verifyPhone/${encodeToken([
      id,
      token,
    ])}`,
    data: [items.verifyPhoneCodeItem],
  };
}
