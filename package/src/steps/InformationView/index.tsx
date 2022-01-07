import React, { useContext } from "react";
import BodyInformation from "./BodyInformation";

import { NavContext } from "../../NavContext";
import { APIContext } from "../../ApiContext";

import { NextStep } from "../../ApiContext/api/types/nextStep";
import HelpView from "../../common/HelpView";
import Step from "../Step";
import ErrorView from "../../common/ErrorView";
import { t } from "i18next";

const InformationView: React.FC<{
  nextStep: NextStep & { type: "information" };
}> = (props) => {
  const { replaceScreen, backScreen } = useContext(NavContext);
  const { apiInterface, collected } = useContext(APIContext);
  const [error, setError] = React.useState<string>();
  const [buttonText, setButtonText] = React.useState<string>(
    error ? t('informationView.close') : t('informationView.gotIt')
  );
  const [collectedStore] = React.useState(collected);

  React.useEffect(() => {
    setButtonText(error ? t('informationView.close') : t('informationView.gotIt'));
  }, [error]);

  const handleButtonAction = async () => {
    try {
      setButtonText(t('mainScreen.loadingText'));
      let payload = { partnerContext: collectedStore.partnerContext };
      let newNextStep: NextStep = props.nextStep;
      if (newNextStep.type === "information" && newNextStep.url === undefined) {
        backScreen();
        return false;
      }
      if (
        newNextStep.type === "information" &&
        newNextStep.extraData &&
        newNextStep.extraData.length > 0
      ) {
        newNextStep.extraData.forEach((data) => {
          let value = collectedStore[data.name];
          if (data.name === "cryptocurrencyAddress")
            value = collectedStore[data.name]?.address;
          else if (data.name === "cryptocurrencyAddressTag")
            value = collectedStore["cryptocurrencyAddress"]?.memo;
          else value = collectedStore[data.name];
          payload = {
            ...payload,
            [data.name]: value,
          };
        });
      }
      newNextStep = await apiInterface.executeStep(newNextStep, payload);
      setButtonText(t('informationView.gotIt'));
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
