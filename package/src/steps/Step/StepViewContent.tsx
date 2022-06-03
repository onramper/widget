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
import PopupView from "../PopupView";
import ActionableErrorView from "../ActionableErrorView";
import { useStepGtmCall } from "./hooks";
import { StepType } from "../../ApiContext/api/types/nextStep";

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
  const { replaceScreen } = useContext(NavContext);
  const { inputInterface, collected } = useContext(APIContext);
  const [isProcessingStep, setIsProcessingStep] = useState(true);
  const registerStepGtmEvent = useStepGtmCall(gtmToBeRegisterStep);

  useEffect(() => {
    if (!nextStep) {
      setIsProcessingStep(false);
      return;
    }

    const { selectedCrypto, defaultAddrs, isAddressEditable } = collected;

    const showReviewAsFrontendStepIfApplicable = () => {
      if (
        isConfirmed === false ||
        (!isConfirmed &&
          (nextStep.type === StepType.iframe ||
            nextStep.type === StepType.requestBankTransaction) &&
          nextStep.type === StepType.iframe &&
          !nextStep.fullscreen)
      ) {
        let includeAddr = true;
        if (
          nextStep.type !== StepType.iframe &&
          nextStep.type !== StepType.requestBankTransaction
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
    const getMatchedStepCallback = () => {
      switch (nextStep.type) {
        case StepType.form:
          return () => replaceScreen(<FormView nextStep={nextStep} />);

        case StepType.file:
          return () => replaceScreen(<UploadView nextStep={nextStep} />);

        case StepType.pickOne:
          return () => replaceScreen(<PickOptionView nextStep={nextStep} />);

        case StepType.redirect:
          return () => replaceScreen(<IframeView nextStep={nextStep} />);

        case StepType.popup:
          return () => replaceScreen(<PopupView nextStep={nextStep} />);

        case StepType.actionableError:
          return () =>
            replaceScreen(<ActionableErrorView nextStep={nextStep} />);

        case StepType.wait:
          return () => replaceScreen(<WaitView nextStep={nextStep} />);

        case StepType.completed:
          return () =>
            replaceScreen(<SuccessView txType="instant" nextStep={nextStep} />);

        case StepType.iframe:
          return () => replaceScreen(<IframeView nextStep={nextStep} />);

        case StepType.requestBankTransaction:
          return () => replaceScreen(<WireTranserView nextStep={nextStep} />);

        case StepType.information:
          return () => replaceScreen(<InformationView nextStep={nextStep} />);

        case StepType.emailVerification:
          return () =>
            replaceScreen(<EmailVerificationView nextStep={nextStep} />);

        case StepType.instruction:
          return () => replaceScreen(<InstructionView nextStep={nextStep} />);

        case StepType.orderComplete:
          return () => replaceScreen(<OrderCompleteView nextStep={nextStep} />);

        case StepType.paymentReview:
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
    isConfirmed,
    inputInterface,
    collected,
    registerStepGtmEvent,
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
