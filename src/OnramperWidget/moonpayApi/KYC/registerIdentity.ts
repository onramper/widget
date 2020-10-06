import { moonpayBaseAPI, identifier, baseAPIUrl } from '../constants';
import { nextStep, dateInfo } from '../utils/lambda-response';
import ddb from '../utils/dynamodb';
import { encodeToken } from '../utils/token';
import { identityTX, getCreationTx, getTxAuthToken } from './dynamoTxs';
import countryAlpha2To3 from '../utils/isoAlpha2ToAlpha3';
import { customerIdentityData, customerAPIResponse } from './api';
import {
  fiatData,
  unsupportedUSAStates,
  USAStates,
  USsupportedCrypto,
} from '../moonpayCountryData';
import getNextKYCStep from './getNextKYCStep';
import fetch from '../utils/fetch';
import { stateItem, countryItem } from './items';
import { StepError, FetchError } from '../errors';

export function generateDate({ year, month, day }: dateInfo): string {
  const pad = (strN: number, n: number) => String(strN).padStart(n, '0');
  return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}T00:00:00.000Z`;
}

// The country used in this call is a country directly provided by the user,
// not the one we guess based on their IP address
export default async function (
  id: string,
  firstName: string,
  lastName: string,
  dateOfBirth: dateInfo,
  street: string,
  town: string,
  postCode: string,
  state: string | undefined,
  providedCountry: string
): Promise<nextStep> {
  const tokenTx = getTxAuthToken(id);
  const creationTx = getCreationTx(id);
  const country = countryAlpha2To3(providedCountry, countryItem.name); // May throw if country is not found
  const customerData: customerIdentityData = {
    firstName,
    lastName,
    dateOfBirth: generateDate(dateOfBirth),
    address: {
      street,
      town,
      postCode,
      country,
    },
    defaultCurrencyId: fiatData[(await creationTx).fiatCurrency].id,
  };
  if (country === 'USA') {
    if (
      state === undefined ||
      typeof state !== 'string' ||
      state.length === 0
    ) {
      return {
        type: 'form',
        url: `${baseAPIUrl}/transaction/${identifier}/identityState/${encodeToken(
          [
            id,
            firstName,
            lastName,
            dateOfBirth.day,
            dateOfBirth.month,
            dateOfBirth.year,
            street,
            town,
            postCode,
            providedCountry,
          ]
        )}`,
        data: [stateItem],
      };
    }
    const processedState = state.toUpperCase();
    if (!USAStates.includes(processedState)) {
      throw new StepError(
        `State provided is not a valid ISO 3166-1 alpha2 subdivision code for the US. Examples of valid codes are 'mt' for Montana and 'nv' for Nevada.`,
        stateItem.name
      );
    }
    if (unsupportedUSAStates.includes(processedState)) {
      throw new StepError(
        'This state is not supported by Moonpay.',
        stateItem.name
      );
    }
    customerData.address.state = processedState;
    // Extra check on selected cryptocurrency (varies by country and it is possible to end up with an unaccepted currency if you are a USA resident with a different IP)
    const cryptoCurrency = (await creationTx).cryptoCurrency;
    if (!USsupportedCrypto.map((c) => c.code).includes(cryptoCurrency)) {
      throw new StepError(
        `Cryptocurrency '${cryptoCurrency}' can't be sold to USA residents.`,
        null
      );
    }
  }
  // Track customer actions
  ddb.put({
    PK: `tx#${id}`,
    SK: `registerIdentity`,
    Timestamp: Date.now(),
    alpha3Country: country,
    alpha2Country: providedCountry,
  } as identityTX);
  try {
    const updatedCustomerData = (await fetch(`${moonpayBaseAPI}/customers/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': (await tokenTx).csrfToken,
      },
      body: JSON.stringify(customerData),
    }).then((res) => res.json())) as customerAPIResponse;
    return getNextKYCStep(
      await creationTx,
      (await tokenTx).csrfToken,
      updatedCustomerData
    );
  } catch (e) {
    if (e instanceof FetchError) {
      if (
        e.errorObject.message ===
        "Invalid body, check 'errors' property for more info."
      ) {
        let error = e.errorObject.errors[0];
        if (error.constraints === undefined) {
          error = error.children[0];
        }
        throw new StepError(
          Object.values(error.constraints).join(', '),
          error.property
        );
      } else {
        throw new StepError(e.errorObject.message, null);
      }
    } else {
      throw e;
    }
  }
}
