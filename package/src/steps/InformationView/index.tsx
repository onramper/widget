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
  const { replaceScreen } = useContext(NavContext);
  const { apiInterface, collected } = useContext(APIContext);
  const [error, setError] = React.useState<string>();
  const [buttonText, setButtonText] = React.useState<string>(error ? "Close" : "Got it!");

  React.useEffect(()=>{
    setButtonText(error ? "Close" : "Got it!")
  }, [error])

  const handleButtonAction = async () => {
    try {
      setButtonText("Loading...")
      const payload = { partnerContext: collected.partnerContext };
      const newNextStep = await apiInterface.executeStep(
        props.nextStep,
        payload
      );
      setButtonText("Got it!")
      replaceScreen(<Step nextStep={newNextStep} />);
      return true;
    } catch (error) {
      if (error.fatal) {
        replaceScreen(<ErrorView />);
      } else {
        setError(error.message);
      }
      return false;
    }
  };

  return (
    <HelpView
      buttonText={buttonText}
      onActionClick={handleButtonAction}
      error={error}
    >
      <BodyInformation message={error ?? props.nextStep.message} />
    </HelpView>
  );
};

export default InformationView;
