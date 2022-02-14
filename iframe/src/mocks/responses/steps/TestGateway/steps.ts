import { BASE_API } from "../../../constants";
import possibleFormFieldsStep from "./possibleFomStepFields";
import paymentReviewStep from "./stepPaymentReview";

const personalInfoStep = {
  type: "form",
  progress: 40,
  url: `${BASE_API}/GoTo/TestGateway/emailVerificationStep/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
  title: "Your details",
  useHeading: true,
  data: [
    {
      type: "string",
      name: "fullname",
      humanName: "Full name",
      placeholder: "e.g JohnDoe",
    },
    {
      type: "integer",
      name: "phoneCountryCode",
      humanName: "Phone country code",
    },
    {
      type: "integer",
      name: "phoneNumber",
      humanName: "Phone number"
    },
  ],
};

const emailVerificationStep = {
  type: "emailVerification",
  title: "Get onboard with us!", 
  url: `${BASE_API}/GoTo/TestGateway/possibleFormFieldsStep/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`, 
  description: "Hi Thijs! We are going to create an account for you with Onramper for easy trading. ",
  progress: 40,
  data: {
    humanName: "Enter your email address",
    name: "email",
    initialValue: "john.123@mail.com",
    placeholder: "e.g john.123@mail.com"
  }
}

const orderComplete = {
  type: "orderComplete",
  title: "We've successfully received your order",
  description: `We have emailed confirmation link about your order to thijs@onramper.com. Your order is being processed and it may take up to 1-3 working days.`
};

const destinationWallet = {
  type: "destinationWallet",
  title: "Your wallet", 
  heading: "Add destination wallet (Optional)", 
  description: "Choose which wallet you would like your funds to be deposited in",
  url: `${BASE_API}/GoTo/TestGateway/willsee/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`, 
  data: [
		{
			walletAddress: "9b2475c48b4111eca8a30242ac12000",
			accountName: "MetaMask Wallet",
			id: "metamask",
			balance: "0.21"
		},
		{
			walletAddress: "9b247eb68b4111eca8a30242ac12000",
			accountName: "Account 1",
			id: "account1",
			balance: "0.0061"
		}
	],
  cryptoName: "ETH",
  selectedWalletId: undefined
}

const nextStep: { [key: string]: any } = {
  firstStep: paymentReviewStep,
  personalInfoStep,
  emailVerificationStep,
  possibleFormFieldsStep,
  orderComplete,
  destinationWallet
};

const getNextStep = (currentStep: string) => {
  return nextStep?.[currentStep] || possibleFormFieldsStep;
};

export default {
  getNextStep,
};
