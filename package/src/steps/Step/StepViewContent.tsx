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
import { triggerGTMEvent } from "../../helpers/useGTM";

export interface NewStepProps {
  nextStep?: NextStep;
  isConfirmed?: boolean;
  initialStep
}
const StepViewContent: React.FC<NewStepProps> = ({ nextStep, isConfirmed }) => {
  const { replaceScreen, backScreen, currentStep /* , onlyScreen */ } =
    useContext(NavContext);
  const { inputInterface, collected } = useContext(APIContext);
  const [isProcessingStep, setIsProcessingStep] = useState(true);

  useEffect(() => {
    const {
      amount,
      amountInCrypto,
      country,
      state,
      selectedCountry,
      selectedCrypto,
      selectedCurrency,
      selectedGateway,
      selectedPaymentMethod,
      defaultAddrs,
      isAddressEditable,
    } = collected;

    triggerGTMEvent({
      event: "fiat-to-crypto",
      category: selectedGateway?.id || "",
      label: nextStep?.type,
      action: "step",
      value: {
        step: currentStep(),
        payment: {
          amount,
          amountInCrypto,
          selectedCurrency: selectedCurrency?.id,
          selectedPaymentMethod: selectedPaymentMethod?.id,
        },
        location: {
          country,
          selectedCountry,
          state,
        },
        crypto: {
          selectedCrypto: selectedCrypto?.id,
          selectedGateway: selectedGateway?.id,
        },
      },
    });

    if (!nextStep) {
      setIsProcessingStep(false);
      return;
    }
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
      return;
    }

    const showPaymentReview = (
      nextStep: NextStep & { type: "paymentReview" }
    ) => {
      if (!isAddressEditable) {
        const newAddress = defaultAddrs[selectedCrypto?.id ?? ""];

        inputInterface.handleInputChange("cryptocurrencyAddress", newAddress);
      }

      replaceScreen(
        <PaymentReview nextStep={nextStep} includeCryptoAddr={true} />
      );
    };

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
        replaceScreen(<SuccessView txType="instant" nextStep={nextStep} />);
        break;
      case "iframe":
        replaceScreen(<IframeView nextStep={nextStep} />);
        break;
      case "requestBankTransaction":
        replaceScreen(<WireTranserView nextStep={nextStep} />);
        break;
      case "information":
        replaceScreen(<InformationView nextStep={nextStep} />);
        break;
      case "emailVerification":
        replaceScreen(<EmailVerificationView nextStep={nextStep} />);
        break;
      case "instruction":
        replaceScreen(<InstructionView nextStep={nextStep} />);
        break;
      case "orderComplete":
        replaceScreen(<OrderCompleteView nextStep={nextStep} />);
        break;
      case "paymentReview":
        showPaymentReview(nextStep);
        break;
      default:
        break;
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
