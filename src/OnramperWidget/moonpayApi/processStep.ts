import {
  decodeToken,
  checkTokenTypes,
  checkBodyParams,
} from './utils/token';
import { StepError } from './errors';
import {
  registerEmail,
  verifyEmail,
  registerPhone,
  verifyPhone,
  registerIdentity,
} from './KYC';
import { nextStep } from './utils/lambda-response';
import * as items from './KYC/items';
import getNextKYCStepFromTxIdAndToken from './KYC/getNextKYCStepFromTxIdAndToken';
import finishCCTransaction from './finishCCTransaction';
import registerBank from './registerBank';

// Separated cause it's too bulky
function processIdentityState(tokenValues: (string | number)[], body: any) {
  if (
    !checkTokenTypes<
      [
        string,
        string,
        string,
        number,
        number,
        number,
        string,
        string,
        string,
        string
      ]
    >(tokenValues, ['', '', '', 0, 0, 0, '', '', '', ''])
  ) {
    throw new StepError('URL is incorrect.', null);
  }
  const [
    id,
    firstName,
    lastName,
    day,
    month,
    year,
    street,
    town,
    postCode,
    providedCountry,
  ] = tokenValues;
  checkBodyParams(body, [items.stateItem]);
  const state = body[items.stateItem.name];
  if (state === '') {
    throw new StepError(
      `Parameter ${items.stateItem.name} must not be empty.`,
      items.stateItem.name
    );
  }
  return registerIdentity(
    id,
    firstName,
    lastName,
    { day, month, year },
    street,
    town,
    postCode,
    body[items.stateItem.name],
    providedCountry
  );
}

export default function (
  step: string,
  token: string,
  body: any,
  country: string
): Promise<nextStep> {
  let tokenValues: (string | number)[];
  try {
    tokenValues = decodeToken(token);
  } catch (e) {
    throw new StepError('URL is incorrect.', null);
  }
  if (step === 'email') {
    if (
      !checkTokenTypes<[string, number, string, string, string]>(tokenValues, [
        '',
        0,
        '',
        '',
        '',
      ])
    ) {
      throw new StepError('URL is incorrect.', null);
    }
    const [
      id,
      amount,
      fiatCurrency,
      cryptoCurrency,
      paymentMethod,
    ] = tokenValues;
    checkBodyParams(body, [items.emailItem, items.cryptocurrencyAddress]);
    return registerEmail(
      id,
      amount,
      fiatCurrency,
      cryptoCurrency,
      paymentMethod,
      body[items.emailItem.name],
      body[items.cryptocurrencyAddress.name],
      country
    );
  }
  if (step === 'verifyEmail') {
    if (!checkTokenTypes<[string, string]>(tokenValues, ['', ''])) {
      throw new StepError('URL is incorrect.', null);
    }
    const [id, email] = tokenValues;
    checkBodyParams(body, [items.verifyEmailCodeItem]);
    return verifyEmail(
      id,
      email,
      body[items.verifyEmailCodeItem.name],
      country
    );
  }
  if (step === 'identity') {
    if (!checkTokenTypes<[string]>(tokenValues, [''])) {
      throw new StepError('URL is incorrect.', null);
    }
    const [id] = tokenValues;
    checkBodyParams(body, [
      items.firstNameItem,
      items.lastNameItem,
      items.dateOfBirthItem,
      items.streetItem,
      items.townItem,
      items.postCodeItem,
      items.countryItem,
    ]); // Doesn't include 'state', it's optional
    return registerIdentity(
      id,
      body[items.firstNameItem.name],
      body[items.lastNameItem.name],
      body[items.dateOfBirthItem.name],
      body[items.streetItem.name],
      body[items.townItem.name],
      body[items.postCodeItem.name],
      body[items.stateItem.name],
      body[items.countryItem.name]
    );
  }
  if (step === 'identityState') {
    return processIdentityState(tokenValues, body);
  }
  if (step === 'getNextKYCStep') {
    if (!checkTokenTypes<[string, string]>(tokenValues, ['', ''])) {
      throw new StepError('URL is incorrect.', null);
    }
    const [id, jwtToken] = tokenValues;
    return getNextKYCStepFromTxIdAndToken(id, jwtToken);
  }
  if (step === 'registerPhone') {
    if (!checkTokenTypes<[string, string]>(tokenValues, ['', ''])) {
      throw new StepError('URL is incorrect.', null);
    }
    const [id, jwtToken] = tokenValues;
    checkBodyParams(body, [items.phoneCountryCodeItem, items.phoneNumberItem]);
    return registerPhone(
      id,
      jwtToken,
      body[items.phoneCountryCodeItem.name],
      body[items.phoneNumberItem.name]
    );
  }
  if (step === 'verifyPhone') {
    if (!checkTokenTypes<[string, string]>(tokenValues, ['', ''])) {
      throw new StepError('URL is incorrect.', null);
    }
    const [id, jwtToken] = tokenValues;
    checkBodyParams(body, [items.verifyPhoneCodeItem]);
    return verifyPhone(id, jwtToken, body[items.verifyPhoneCodeItem.name]);
  }
  if (step === 'registerBank') {
    if (!checkTokenTypes<[string, string, string]>(tokenValues, ['', '', ''])) {
      throw new StepError('URL is incorrect.', null);
    }
    const [id, jwtToken, fiatCurrency] = tokenValues;
    if (fiatCurrency === 'EUR') {
      checkBodyParams(body, [items.bankIbanItem]);
      return registerBank(id, jwtToken, {
        currencyCode: 'eur',
        iban: body[items.bankIbanItem.name],
      });
    }
    if (fiatCurrency === 'GBP') {
      checkBodyParams(body, [
        items.bankSortCodeItem,
        items.bankAccountNumberItem,
      ]);
      return registerBank(id, jwtToken, {
        currencyCode: 'gbp',
        accountNumber: body[items.bankAccountNumberItem.name],
        sortCode: body[items.bankSortCodeItem.name],
      });
    }
    throw new StepError('URL is incorrect, unaccepted fiat currency.', null);
  }
  if (step === 'registerCreditCardToken') {
    checkBodyParams(body, [items.transactionId, items.creditCardTokenId]);
    return finishCCTransaction(
      body[items.transactionId.name],
      body[items.creditCardTokenId.name]
    );
  }
  throw new StepError(`Step '${step}' is not defined for Moonpay.`, null);
}
