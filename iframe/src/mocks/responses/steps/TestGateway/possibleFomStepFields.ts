import { BASE_API } from "../../../constants";

const testIcon = "data:image/png;base64,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";

const creditCardFormFieldsGroup = [
  {
    type: "string",
    name: "ccNumber",
    humanName: "Credit Card Number",
  },
  {
    type: "string",
    name: "ccMonth",
    humanName: "Credit Card Expiration Month",
  },
  {
    type: "string",
    name: "ccYear",
    humanName: "Credit Card Expiration Year",
  },
  {
    type: "string",
    name: "ccCVV",
    humanName: "Credit Card CVV",
  },
];

const phoneNumberFormFieldsGroup = [
  {
    type: "integer",
    name: "phoneCountryCode",
    humanName: "Phone country code",
  },
  {
    type: "integer",
    name: "phoneNumber",
    humanName: "Phone number",
    hint:
      "Landlines and VoIP are not accepted. Please use a mobile phone number",
  },
];

const personalInfoFields = [
  {
    type: "string",
    name: "firstName",
    humanName: "First name",
  },
  {
    type: "string",
    name: "lastName",
    humanName: "Last name",
  },
  {
    type: "string",
    name: "street",
    humanName: "Street",
  },
  {
    type: "string",
    name: "town",
    humanName: "City",
  },
  {
    type: "string",
    name: "postCode",
    humanName: "Postal Code",
  },
  {
    type: "date",
    name: "dateOfBirth",
    humanName: "Date of Birth",
    data: [
      {
        type: "integer",
        humanName: "Day",
        name: "day",
      },
      {
        type: "integer",
        humanName: "Month",
        name: "month",
      },
      {
        type: "integer",
        humanName: "Year",
        name: "year",
      },
    ],
  },
  {
    type: "string",
    name: "email",
    humanName: "Email",
    hint: "Hint for email field.",
  },
  {
    type: "string",
    name: "identityDocumentLastName",
    humanName: "Last name as on the identity document",
  },
];

const allFormFields = [
  {
    type: "string",
    name: "cryptocurrencyAddress",
    humanName: "Cryptocurrency wallet address",
    hint: "This is a test hint for cypto address",
  },
  {
    type: "string",
    name: "verifyCreditCard",
    humanName: "Credit Card verification code",
    hint:
      "For the time being, most likely I'm not visible because I'm replaced by a text in the frontend!",
  },
  {
    type: "string",
    name: "verifyPhoneCode",
    humanName: "Phone verification code",
    hint: "A verification code was sent to your phone number. Fill it in here.",
  },
  {
    type: "string",
    name: "verifyEmailCode",
    humanName: "Email verification code",
    hint:
      "This is a test hint for email code which here is required on purpose",
    isRequired: true,
  },
  {
    type: "select",
    name: "name for select",
    humanName: "Select's label",
    hint: "Select's hint",
    options: [
      { humanName: "Test option #1", value: "#1" },
      { humanName: "Test option #2", value: "#2" },
      { humanName: "Test option #3", value: "#3" },
    ]
  },
  {
    type: "select",
    name: "name for select (1 item)",
    humanName: "Select's label (1 item)",
    hint: "Select's hint",
    options: [
      { humanName: "Test option #1", value: "#1" }
    ]
  },
  {
    name: "country",
    humanName: "Select country",
    type: "select",
    placeholder: "A placeholder",
    options: [
      { humanName: "Algeria", value: "DZ" },
      { humanName: "Argentina", value: "AR" },
      { humanName: "Australia", value: "AU" },
      { humanName: "United Kingdom", value: "GB" },
      { humanName: "United States of America", value: "US" },
      { humanName: "Vietnam", value: "VN" },
    ]
  },
  {
    name: "country",
    humanName: "Select country (1 item)",
    type: "select",
    placeholder: "A placeholder",
    options: [
      { humanName: "Algeria", value: "DZ" }
    ]
  },
  {
    type: "string",
    name: "state",
    humanName: "Select state",
    required: false,
  },
  {
    type: "choice",
    humanName: "Type of identity document (choice)",
    name: "documentType",
    options: [
        "Identity card",
        "Passport"
    ],
  },
  {
    type: "choice",
    humanName: "Type of identity document (choice - 1 item)",
    name: "documentType",
    options: [
        "Identity card"
    ],
  },
  ...creditCardFormFieldsGroup,
  ...phoneNumberFormFieldsGroup,
  ...personalInfoFields,
  {
    type: "string",
    name: "cryptocurrencyAddressTag",
    humanName: "Cryptocurrency address tag",
    required: false,
  },
  {
    type: "string",
    name: "password",
    humanName: "Test password input",
    placeholder: "A placeholder for password input...",
    hint: "Hint for test password input",
  },
  {
    type: "text",
    name: "a test name",
    humanName: "Label test input",
    placeholder: "Test input placeholder...",
    hint: "Hint for test input (matching the last condition)",
  },
  {
    type: "text",
    name: "a test name",
    humanName: "Label test input 2",
    placeholder: "Test input placeholder...",
    hint: "Hint for test input (matching the last condition) - icon",
    icon: testIcon,
  },
  {
    type: "text",
    name: "a test name 2",
    humanName: "Label test input 3",
    placeholder: "Test input placeholder...",
    hint: "Hint for test input 3 (matching the last condition) - icon end",
    icon: testIcon,
    iconPosition: "end"
  },
  {
    type: "boolean",
    name: "termsOfUse",
    terms: [
      {
        url: "https://onramper.com/terms-of-use/",
        humanName: "Onramper's Terms Of Use",
      },
      {
        url: "https://onramper.com/privacy-policy/",
        humanName: "Onramper's Privacy Policy",
      },
      {
        url:
          "https://www.notion.so/Transak-Terms-of-Service-6d89598211644402b3be63bc3f1468b4",
        humanName: "Transak Terms of Service",
      },
      {
        url: "https://onramper.com/privacy-policy/",
        humanName: "Additional test item added here",
      },
    ],
  },
];

export default {
  type: "form",
  progress: 59,
  humanName: "Possible form fields",
  data: allFormFields,
  url: `${BASE_API}/GoTo/TestGateway/completed/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
};
