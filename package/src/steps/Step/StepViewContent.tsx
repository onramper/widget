import React, { useContext, useEffect, useState } from "react";
import stylesCommon from "../../styles.module.css";

import ErrorVisual from "../../common/ErrorVisual";

import PaymentReview from "../PaymentReviewView";
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
import EmailVerificationView from "../EmailVerificationView/EmailVerificationView";
import OrderCompleteView from "../OrderCompleteView/OrderCompleteView";
import PaymentReviewDecorator from "../PaymentReviewView/PaymentReviewDecorator";
import InstructionView from "../InstructionView";
import { triggerGTMEvent, generateGtmStepValue } from "../../helpers/useGTM";
import PopupView from "../PopupView";
import ActionableErrorView from "../ActionableErrorView";

export interface NewStepProps {
  nextStep?: NextStep;
  gtmToBeRegisterStep?: NextStep;
  isConfirmed?: boolean;
}
const StepViewContent: React.FC<NewStepProps> = ({
  nextStep,
  gtmToBeRegisterStep,
  isConfirmed,
}) => {
  const { replaceScreen, backScreen, currentStep /* , onlyScreen */ } =
    useContext(NavContext);
  const { inputInterface, collected } = useContext(APIContext);
  const [isProcessingStep, setIsProcessingStep] = useState(true);

  useEffect(() => {
    if (!nextStep) {
      setIsProcessingStep(false);
      return;
    }

    const { selectedCrypto, selectedGateway, defaultAddrs, isAddressEditable } =
      collected;

    const showReviewAsFrontendStepIfApplicable = () => {
      if (
        isConfirmed === false ||
        (!isConfirmed &&
          (nextStep.type === "iframe" ||
            nextStep.type === "requestBankTransaction") &&
          nextStep.type === "iframe" &&
          !nextStep.fullscreen)
      ) {
        let includeAddr = true;
        if (
          nextStep.type !== "iframe" &&
          nextStep.type !== "requestBankTransaction"
        ) {
          includeAddr = false;
          if (!isAddressEditable)
            inputInterface.handleInputChange(
              "cryptocurrencyAddress",
              defaultAddrs[selectedCrypto?.id ?? ""]
            );
        }

        replaceScreen(
          <PaymentReviewDecorator
            nextStep={nextStep}
            includeCryptoAddr={includeAddr}
          />
        );
        return true;
      }
      return false;
    };
    const registerStepGtmEvent = () => {
      if (!gtmToBeRegisterStep) {
        return;
      }
      triggerGTMEvent({
        event: "fiat-to-crypto",
        category: selectedGateway?.id || "",
        label: gtmToBeRegisterStep?.eventLabel || gtmToBeRegisterStep?.type,
        action: `step ${currentStep() + 1}`,
        value: generateGtmStepValue(collected),
      });
    };
    const getMatchedStepCallback = () => {
      switch (nextStep.type) {
        case "form":
          return () => replaceScreen(<FormView nextStep={nextStep} />);

        case "file":
          return () => replaceScreen(<UploadView nextStep={nextStep} />);

        case "pickOne":
          return () => replaceScreen(<PickOptionView nextStep={nextStep} />);

        case "redirect":
          return () => replaceScreen(<IframeView nextStep={nextStep} />);

        case "popup":
          return () => replaceScreen(<PopupView nextStep={nextStep} />);

        case "actionable-error":
          return () =>
            replaceScreen(<ActionableErrorView nextStep={nextStep} />);

        case "wait":
          return () => replaceScreen(<WaitView nextStep={nextStep} />);

        case "completed":
          return () =>
            replaceScreen(<SuccessView txType="instant" nextStep={nextStep} />);

        case "iframe":
          return () => replaceScreen(<IframeView nextStep={nextStep} />);

        case "requestBankTransaction":
          return () => replaceScreen(<WireTranserView nextStep={nextStep} />);

        case "information":
          return () => replaceScreen(<InformationView nextStep={nextStep} />);

        case "emailVerification":
          return () =>
            replaceScreen(<EmailVerificationView nextStep={nextStep} />);

        case "instruction":
          return () => replaceScreen(<InstructionView nextStep={nextStep} />);

        case "orderComplete":
          return () => replaceScreen(<OrderCompleteView nextStep={nextStep} />);

        case "paymentReview":
          return () => {
            if (!isAddressEditable) {
              const newAddress = defaultAddrs[selectedCrypto?.id ?? ""];
              inputInterface.handleInputChange(
                "cryptocurrencyAddress",
                newAddress
              );
            }

            replaceScreen(
              <PaymentReview nextStep={nextStep} includeCryptoAddr={true} />
            );
          };
        default:
          return undefined;
      }
    };

    if (showReviewAsFrontendStepIfApplicable()) {
      return;
    }

    const stepCallback = getMatchedStepCallback();
    if (stepCallback) {
      registerStepGtmEvent();
      stepCallback();
      return;
    }
    setIsProcessingStep(false);
  }, [
    nextStep,
    replaceScreen,
    backScreen,
    currentStep,
    isConfirmed,
    inputInterface,
    collected,
    gtmToBeRegisterStep,
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
