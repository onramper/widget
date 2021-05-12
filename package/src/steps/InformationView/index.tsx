import React, { useContext } from "react";
import BodyInformation from "./BodyInformation";

import { NavContext } from "../../NavContext";
import { APIContext } from "../../ApiContext";

import { NextStep } from "../../ApiContext/api/types/nextStep";
import HelpView from "../../common/HelpView";
import Step from "../Step";
import ErrorView from "../../common/ErrorView";

const InformationView: React.FC<{
  nextStep: NextStep & { type: "information" };
}> = (props) => {
  const { nextScreen } = useContext(NavContext);
  const { apiInterface, collected } = useContext(APIContext);
  const [error, setError] = React.useState<string>();

  const handleButtonAction = async () => {
    try {
      const payload = { partnerContext: collected.partnerContext };
      const newNextStep = await apiInterface.executeStep(
        props.nextStep,
        payload
      );
      nextScreen(<Step nextStep={newNextStep} />);
      return true;
    } catch (error) {
      if (error.fatal) {
        nextScreen(<ErrorView />);
      } else {
        setError(error.message);
      }
      return false;
    }
  };

  return (
    <HelpView
      buttonText={error ? "Close" : "Got it!"}
      onActionClick={handleButtonAction}
      error={error}
    >
      <BodyInformation message={error ?? props.nextStep.message} />
    </HelpView>
  );
};

export default InformationView;
