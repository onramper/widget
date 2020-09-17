import { stepDataItems } from '../utils/lambda-response';

export type stepItem = stepDataItems[0];

export const dateOfBirthItem: stepItem = {
  type: 'date',
  name: 'dateOfBirth',
  humanName: 'Date of Birth',
  data: [
    {
      type: 'integer',
      humanName: 'Day',
      name: 'day',
    },
    {
      type: 'integer',
      humanName: 'Month',
      name: 'month',
    },
    {
      type: 'integer',
      humanName: 'Year',
      name: 'year',
    },
  ],
};

export const firstNameItem: stepItem = {
  type: 'string',
  name: 'firstName',
  humanName: 'First name',
};

export const lastNameItem: stepItem = {
  type: 'string',
  name: 'lastName',
  humanName: 'Last Name',
};
export const streetItem: stepItem = {
  type: 'string',
  name: 'street',
  humanName: 'Street',
};

export const townItem: stepItem = {
  type: 'string',
  name: 'town',
  humanName: 'City',
};

export const postCodeItem: stepItem = {
  type: 'string',
  name: 'postCode',
  humanName: 'Postal Code',
};

export const countryItem: stepItem = {
  type: 'string',
  name: 'country',
  humanName: 'Country',
};

export const stateItem: stepItem = {
  type: 'string',
  name: 'state',
  humanName: 'State',
};

export const optionalStateItem: stepItem = {
  ...stateItem,
  hint: 'Only required if you ',
  required: false,
};

export const emailItem: stepItem = {
  type: 'string',
  name: 'email',
  humanName: 'Email',
  hint: 'We will send a code to your email.',
};

export const verifyEmailCodeItem: stepItem = {
  type: 'string',
  name: 'verifyEmailCode',
  humanName: 'Email verification code',
};

export const phoneNumberItem: stepItem = {
  type: 'integer',
  name: 'phoneNumber',
  humanName: 'Phone number',
};

export const phoneCountryCodeItem: stepItem = {
  type: 'integer',
  name: 'phoneCountryCode',
  humanName: 'Country code',
};

export const verifyPhoneCodeItem: stepItem = {
  type: 'string',
  name: 'verifyPhoneCode',
  humanName: 'Phone verification code',
};

export const bankIbanItem: stepItem = {
  type: 'string',
  name: 'bankIban',
  humanName: 'IBAN',
};

export const bankSortCodeItem: stepItem = {
  type: 'string',
  name: 'bankSortCode',
  humanName: 'Sort code',
};

export const bankAccountNumberItem: stepItem = {
  type: 'string',
  name: 'bankAccountNumber',
  humanName: 'Bank account number',
};

export const cryptocurrencyAddress: stepItem = {
  type: 'string',
  name: 'cryptocurrencyAddress',
  humanName: 'Cryptocurrency wallet address',
};

export const transactionId: stepItem = {
  type: 'string',
  name: 'transactionId',
  humanName: 'Transaction Id',
};

export const creditCardTokenId: stepItem = {
  type: 'string',
  name: 'ccTokenId',
  humanName: 'Credit Card Token Id',
};
