import { NextStep, APIContext } from "../../ApiContext";
import React, { useState, useEffect, useContext } from "react";
import { NavContext } from "../../NavContext";
import { StepType } from "../../ApiContext/api/types/nextStep";
import FormView from "../FormView";
import UploadView from "../UploadView";
import PaymentReview from "../PaymentReviewView";
import PickOptionView from "../PickOptionView";
import SuccessView from "../SuccessView";
import IframeView from "../IframeView";
import WireTranserView from "../WireTranserView";
import WaitView from "../WaitView";
import InformationView from "../InformationView";
import EmailVerificationView from "../EmailVerificationView/EmailVerificationView";
import OrderCompleteView from "../OrderCompleteView/OrderCompleteView";
import InstructionView from "../InstructionView";
import PopupView from "../PopupView";
import ActionableErrorView from "../ActionableErrorView";

type redirectCallbackType = (() => void) | undefined;
type CallbackType = (() => redirectCallbackType) | undefined;

export const useStepResolutionCall = (nextStep?: NextStep) => {
  const [callback, setCallback] = useState<CallbackType>();
  const { replaceScreen } = useContext(NavContext);
  const { collected, inputInterface } = useContext(APIContext);

  useEffect(() => {
    setCallback(() => () => {
      switch (nextStep?.type) {
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
            const { selectedCrypto, defaultAddrs, isAddressEditable } =
              collected;
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
    });
  }, [collected, inputInterface, nextStep, replaceScreen]);

  return callback;
};

export default useStepResolutionCall;
