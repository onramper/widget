import { fiatData } from '../moonpayCountryData';
import { moonpayBaseAPI } from '../constants';
import fetch from '../utils/fetch';

export interface customerIdentityData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: {
    street: string;
    town: string;
    postCode: string;
    country: string;
    state?: string;
  };
  defaultCurrencyId: string;
}

export interface limitAPIResponse {
  limits: {
    type:
      | 'buy_credit_debit_card'
      | 'buy_gbp_bank_transfer'
      | 'buy_sepa_bank_transfer';
    dailyLimit: number;
    dailyLimitRemaining: number;
    monthlyLimit: number;
    monthlyLimitRemaining: number;
  }[];
  verificationLevels: {
    name: string;
    requirements: {
      completed: boolean;
      identifier:
        | 'identity_verification'
        | 'document_verification'
        | 'face_match_verification'
        | 'address_verification'
        | 'phone_number_verification';
    }[];
    completed: boolean;
  }[];
  limitIncreaseEligible: boolean;
}

export interface verifyEmailAPIResponse {
  csrfToken: string;
  customer: {
    id: string;
    createdAt: string;
    updatedAt: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    walletAddress: string | null;
    phoneNumber: string | null;
    isPhoneNumberVerified: boolean;
    dateOfBirth: string | null;
    liveMode: boolean;
    defaultCurrencyId: string;
    address: {
      street: string | null;
      subStreet: string | null;
      town: string | null;
      postCode: string | null;
      state: string | null;
      country: string | null;
    };
  };
}

export interface customerAPIResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  walletAddress: string | null;
  phoneNumber: string | null;
  isPhoneNumberVerified: boolean;
  dateOfBirth: string | null;
  liveMode: boolean;
  defaultCurrencyId: string;
  address: {
    street: string | null;
    subStreet: string | null;
    town: string | null;
    postCode: string | null;
    state: string | null;
    country: string | null;
  };
  externalCustomerId: string | null;
}

export async function setFiatCurrency(
  token: string,
  fiatCurrency: string
): Promise<customerAPIResponse> {
  return fetch(`${moonpayBaseAPI}/customers/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      defaultCurrencyId: fiatData[fiatCurrency].id,
    }),
  }).then((res) => res.json());
}
