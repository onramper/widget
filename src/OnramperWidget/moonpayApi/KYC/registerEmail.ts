import { moonpayBaseAPI, identifier, publishableApiKey, baseAPIUrl } from '../constants';
import { nextStep } from '../utils/lambda-response';
import fetch from '../utils/fetch';
import { StepError } from '../errors';
import { encodeToken } from '../utils/token';
import { createCreationTx } from './dynamoTxs';
import * as items from './items';
import validateAddress from '../utils/validateAddress';

interface EmailLoginResponse {
  preAuthenticated: boolean;
  showTermsOfUse: boolean;
}

export default async function (
  id: string,
  amount: number,
  fiatCurrency: string,
  cryptoCurrency: string,
  paymentMethod: string,
  email: string,
  cryptocurrencyAddress: string,
  country: string
): Promise<nextStep> {
  // TODO: Validate all new transaction data
  if (validateAddress(cryptocurrencyAddress, cryptoCurrency) === false) {
    throw new StepError(
      'The provided cryptocurrency address is not valid.',
      items.cryptocurrencyAddress.name
    );
  }
  try {
    const res = (await fetch(
      `${moonpayBaseAPI}/customers/email_login?apiKey=${publishableApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      }
    ).then((r) => r.json())) as EmailLoginResponse;
    if (!res.preAuthenticated) {
      throw new Error();
    }
  } catch (e) {
    throw new StepError(
      'The provided email has been rejected.',
      items.emailItem.name
    );
  }
  await createCreationTx({
    PK: `tx#${id}`,
    SK: `create`,
    Timestamp: Date.now(),
    fiatCurrency,
    cryptoCurrency,
    fiatAmount: amount,
    paymentMethod,
    cryptocurrencyAddress,
    country
  });
  const termsOfUse: items.stepItem = {
    type: 'boolean',
    name: 'termsOfUse',
    terms: [
      {
        url: 'https://onramper.com/terms-of-use/',
        humanName: "Onramper's Terms Of Use",
      },
      {
        url: 'https://onramper.com/privacy-policy/',
        humanName: "Onramper's Privacy Policy",
      },
      {
        url: 'https://moonpay.io/terms_of_use/',
        humanName: "Moonpay's Terms Of Use",
      },
      {
        url: 'https://moonpay.io/privacy_policy/',
        humanName: "Moonpay's Privacy Policy",
      },
    ],
  };
  if (country === 'us') {
    termsOfUse.terms.push({
      url: 'https://buy.moonpay.io/ZeroHashLLCServicesAgreement.pdf',
      humanName: 'Zero Hash LLC Services Agreement',
    });
  }
  return {
    type: 'form',
    url: `${baseAPIUrl}/transaction/${identifier}/verifyEmail/${encodeToken([
      id,
      email,
    ])}`,
    data: [items.verifyEmailCodeItem, termsOfUse],
  };
}
