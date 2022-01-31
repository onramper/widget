import { BASE_API } from "../../../constants";
import possibleFormFieldsStep from "./possibleFomStepFields";

const firstStep = {
  type: "form",
  progress: 30,
  humanName: "Your Details",
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
  url: `${BASE_API}/GoTo/TestGateway/finish/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`, 
  description: "Hi Thijs! We are going to create an account for you with Onramper for easy trading. ",
  progress: 40,
  data: {
    humanName: "Enter your email address",
    name: "email",
    placeholder: "e.g john.123@mail.com"
  }
}

const nextStep: { [key: string]: any } = {
  firstStep, 
  emailVerificationStep,
  completed: { type: "completed", progress: 100, trackingUrl: "/" }
};

const getNextStep = (currentStep: string) => {
  return nextStep?.[currentStep] || possibleFormFieldsStep;
};

export default {
  getNextStep,
};
