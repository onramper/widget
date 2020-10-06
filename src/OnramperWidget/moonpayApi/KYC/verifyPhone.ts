import { nextStep } from '../utils/lambda-response';
import { moonpayBaseAPI } from '../constants';
import { StepError } from '../errors';
import fetch from '../utils/fetch';
import { verifyPhoneCodeItem } from './items';
import getNextKYCStepFromTxIdAndToken from './getNextKYCStepFromTxIdAndToken';

export default async function (
  id: string,
  token: string,
  phoneCode: string
): Promise<nextStep> {
  try {
    const response = await fetch(
      `${moonpayBaseAPI}/customers/verify_phone_number`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        body: JSON.stringify({
          verificationCode: phoneCode,
        }),
      }
    ).then((r) => r.json());
    if (response.success !== true) {
      throw new Error();
    }
  } catch (e) {
    throw new StepError(
      'The provided phone code has been rejected.',
      verifyPhoneCodeItem.name
    );
  }
  return getNextKYCStepFromTxIdAndToken(id, token);
}
