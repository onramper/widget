import { BASE_API } from "../../../constants";

const getNextStep = (currentStep: string) => {
    switch (currentStep) {
      case "tryLoginBTCDirect":
        return tryLoginBTCDirectStep;
      case "tryLogin":
        return tryLoginStep;
      case "registerUser":
        return registerUserStep;
      case "verifyIDFront":
        return verifyIDFrontStep;
      case "verifyIDBack":
        return verifyIDBackStep;
      case "verifyIDSelfie":
        return verifyIDSelfieStep;
      case "verifyEmail":
        return verifyEmailStep;
      case "verifyAMLD":
        return verifyAMLDStep;
      case "wait":
        return waitStep;
      case "payment":
        return paymentStep;
      case "completed":
        return completedStep;
    }
};

// I have an account, email and password have been provided.
const tryLoginBTCDirectStep = {
  type: 'form',
  url: `${BASE_API}/transaction/BTCDirect/payment/token`,
  data: [
    {
      type: 'string',
      name: 'cryptocurrencyAddress',
      humanName: 'Cryptocurrency wallet address',
    }
  ],
}

// I don't have an account yet, only an email was provided.
const tryLoginStep = {
  type: 'form',
  url: `${BASE_API}/transaction/BTCDirect/registerUser/token`,
  data: [
    {
      type: 'string',
      name: 'firstName',
      humanName: 'First name',
    },
    {
      type: 'string',
      name: 'lastName',
      humanName: 'Last name',
    },
    {
      type: 'string',
      name: 'email',
      humanName: 'Email',
      hint: 'We will send a code to your email.',
    },
    {
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
    },
    {
      type: 'integer',
      name: 'phoneCountryCode',
      humanName: 'Phone country code',
    },
    {
      type: 'integer',
      name: 'phoneNumber',
      humanName: 'Phone number',
    },
    {
      type: 'string',
      name: 'identityDocumentFirstNames',
      humanName: 'First names as on the identity document',
    },
    {
      type: 'string',
      name: 'identityDocumentLastName',
      humanName: 'Last name as on the identity document',
    },
    {
      type: 'choice',
      name: 'identityDocumentType',
      humanName: 'Type of identity document',
      options: ['IdentityCard', 'Passport'],
    },
    {
      type: 'string',
      name: 'identityDocumentNumber',
      humanName: 'Number of the identity document',
    },
    {
      type: 'string',
      name: 'country',
      humanName: 'Country of issue of the identity document',
    },
    {
      type: 'boolean',
      name: 'termsOfUse',
      terms: [
        [
          {
            url: 'https://onramper.com/terms-of-use/',
            humanName: "Onramper's Terms Of Use",
          },
          {
            url: 'https://onramper.com/privacy-policy/',
            humanName: "Onramper's Privacy Policy",
          },
        ],
        {
          url: 'https://btcdirect.eu/en-gb/terms-of-service',
          humanName: "BTC Direct's Terms Of Service",
        },
      ],
    }
  ],
}

const registerUserStep = {
  type: 'file',
  url: `${BASE_API}/transaction/BTCDirect/verifyIDFront/token`,
  humanName: 'Identity Card - Front',
  acceptedContentTypes: ['image/jpeg', 'image/png', 'application/pdf'],
}

const verifyIDFrontStep = {
  type: 'file',
  url: `${BASE_API}/transaction/BTCDirect/verifyIDBack/token`,
  humanName: 'Identity Card - Back',
  acceptedContentTypes: ['image/jpeg', 'image/png', 'application/pdf'],
}

const verifyIDBackStep = {
  type: 'file',
  url: `${BASE_API}/transaction/BTCDirect/verifyIDSelfie/token`,
  humanName: 'Identity Card - Selfie',
  acceptedContentTypes: ['image/jpeg', 'image/png', 'application/pdf'],
}

const verifyIDSelfieStep = {
  type: 'form',
  url: `${BASE_API}/transaction/BTCDirect/verifyEmail/token`,
  data: [
    {
      type: 'string',
      name: 'verifyEmailCode',
      humanName: 'Email verification code',
    }
  ],
}

const verifyEmailStep = {
  type: 'form',
  url: `${BASE_API}/transaction/BTCDirect/verifyAMLD/token`,
  data: [
    {
      type: 'choice',
      name: 'whyAccountCreated',
      humanName: 'Why did you open an account at BTC Direct?',
      options: ['Investing', 'Trading', 'Money', 'Online gambling'],
    },
    {
      type: 'choice',
      name: 'mainSourceOfIncome',
      humanName: 'What is the origin of your assets?',
      options: [
        'Income from employment',
        'Savings',
        'Investment income',
        'Inheritance',
        'Gift',
        'Sale of enterprise',
        'Sale of property',
        'Loan',
      ],
    }
  ],
};

const verifyAMLDStep = {
  type: 'wait',
  url: `${BASE_API}/transaction/BTCDirect/wait/token`,
};

const waitStep = {
  type: 'form',
  url: `${BASE_API}/transaction/BTCDirect/payment/token`,
  data: [
    {
      type: 'string',
      name: 'cryptocurrencyAddress',
      humanName: 'Cryptocurrency wallet address',
    }
  ]
};

const paymentStep = {
    type: 'form',
    url: `${BASE_API}/transaction/BTCDirect/completed/token`,
    humanName: 'Complete payment',
    hint: 'Complete your payment. The form below is in a secure sandbox.',
    data: [
        {
            type: 'string',
            name: 'ccNumber',
            humanName: 'Credit Card Number',
          },
          {
            type: 'string',
            name: 'ccMonth',
            humanName: 'Credit Card Expiration Month',
          },
          {
            type: 'string',
            name: 'ccYear',
            humanName: 'Credit Card Expiration Year',
          },
          {
            type: 'string',
            name: 'ccCVV',
            humanName: 'Credit Card CVV',
          },
    ]
}

const completedStep = {
  type: 'completed'
}

export default {
    getNextStep
}