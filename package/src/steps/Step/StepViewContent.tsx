import React, { useContext, useEffect, useState } from "react";
import stylesCommon from "../../styles.module.css";

import ErrorVisual from "../../common/ErrorVisual";

import ConfirmPaymentView from "../ConfirmPaymentView";
import UploadView from "../UploadView";
import PickOptionView from "../PickOptionView";
import FormView from "../FormView";
import SuccessView from "../SuccessView";
import IframeView from "../IframeView";
import WireTranserView from "../WireTranserView";
import WaitView from "../WaitView";

import { NavContext } from "../../NavContext";

import { APIContext, NextStep } from "../../ApiContext";
import InformationView from "../InformationView";
import Footer from "../../common/Footer";

export interface NewStepProps {
  nextStep?: NextStep;
  isConfirmed?: boolean;
}
const StepViewContent: React.FC<NewStepProps> = ({ nextStep, isConfirmed }) => {
  const { replaceScreen, backScreen /* , onlyScreen */ } = useContext(
    NavContext
  );
  const { inputInterface, collected } = useContext(APIContext);
  const [isProcessingStep, setIsProcessingStep] = useState(true);

  useEffect(() => {
    if (!nextStep) {
      setIsProcessingStep(false);
      return;
    }
    if (
      isConfirmed === false ||
      (!isConfirmed &&
        (nextStep.type === "iframe" ||
          nextStep.type === "requestBankTransaction") && nextStep.type==='iframe' && !nextStep.fullscreen)
    ) {
      let includeAddr = true;
      if (
        nextStep.type !== "iframe" &&
        nextStep.type !== "requestBankTransaction"
      ) {
        includeAddr = false;
        if (!collected.isAddressEditable)
          inputInterface.handleInputChange(
            "cryptocurrencyAddress",
            collected.defaultAddrs[collected.selectedCrypto?.id ?? ""]
          );
      }
      replaceScreen(
        <ConfirmPaymentView
          nextStep={nextStep}
          includeCryptoAddr={includeAddr}
        />
      );
      return;
    }
    switch (nextStep.type) {
      case "form":
        replaceScreen(<FormView nextStep={nextStep} />);
        break;
      case "file":
        replaceScreen(<UploadView nextStep={nextStep} />);
        break;
      case "pickOne":
        replaceScreen(<PickOptionView nextStep={nextStep} />);
        break;
      case "redirect":
        replaceScreen(<IframeView nextStep={nextStep} />);
        break;
      case "wait":
        replaceScreen(<WaitView nextStep={nextStep} />);
        break;
      case "completed":
        replaceScreen(<SuccessView txType="instant" nextStep={nextStep} />); //onlyScreen(<SuccessView txType='instant' />)
        break;
      case "iframe":
        replaceScreen(<IframeView nextStep={nextStep} />);
        break;
      case "requestBankTransaction":
        replaceScreen(<WireTranserView nextStep={nextStep} />); //onlyScreen(<WireTranserView nextStep={nextStep} />)
        break;
      case "information":
        replaceScreen(<InformationView nextStep={nextStep} />);
        break;
      default:
        break;
    }
    setIsProcessingStep(false);
  }, [
    nextStep,
    replaceScreen,
    backScreen,
    isConfirmed,
    inputInterface,
    collected.defaultAddrs,
    collected.selectedCrypto?.id,
    collected.isAddressEditable,
  ]);

  return (
    <main className={stylesCommon.body}>
      {!isProcessingStep && (
        <div className={`${stylesCommon.body__child} ${stylesCommon.grow}`}>
          <ErrorVisual message="An error occurred while trying to connect to server. Please try again later." />
        </div>
      )}
      <Footer />
    </main>
  );
};

export default StepViewContent;
