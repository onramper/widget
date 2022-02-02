import { BASE_API } from "../../../constants";
import possibleFormFieldsStep from "./possibleFomStepFields";

const personalInfoStep = {
  type: "form",
  progress: 30,
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
  description: `We have emailed confirmation link about your order to thijs@onramper.com. Your order is being processed and it may take upto 1-3 working days.`
};

const nextStep: { [key: string]: any } = {
  firstStep: personalInfoStep,
  emailVerificationStep,
  possibleFormFieldsStep,
  orderComplete
};

const getNextStep = (currentStep: string) => {
  return nextStep?.[currentStep] || possibleFormFieldsStep;
};

export default {
  getNextStep,
};
