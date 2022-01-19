import { BASE_API } from "../../../constants";

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
    hint: "Hint for test input (input that matches the last condition)",
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
