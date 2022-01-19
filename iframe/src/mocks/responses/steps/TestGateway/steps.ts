import { BASE_API } from "../../../constants";
import possibleFormFieldsStep from "./possibleFomStepFields";

const firstStep = {
  type: "form",
  progress: 30,
  humanName: "Your Details",
  url: `${BASE_API}/GoTo/TestGateway/emailStep/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
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
      humanName: "Phone number",
      placeholder: "654 56 84 56",
    },
  ],
};

const nextStep: { [key: string]: any } = {
  firstStep, 
  completed: { type: "completed", progress: 100, trackingUrl: "/" }
};

const getNextStep = (currentStep: string) => {
  return nextStep?.[currentStep] || possibleFormFieldsStep;
};

export default {
  getNextStep,
};
