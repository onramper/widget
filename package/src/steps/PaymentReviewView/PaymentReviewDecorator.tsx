import React, { useContext, useRef } from "react";
import Step from "../Step";

import { NavContext } from "../../NavContext";
import { PaymentReviewProps } from "./PaymentReview.models";
import { NextStep, APIContext, CollectedStateType } from "../../ApiContext";
import ConfirmPaymentView from ".";
import {
  PaymentReviewStep,
  StepType,
} from "../../ApiContext/api/types/nextStep";
import { triggerGTMEvent, generateGtmCtxValue } from "../../helpers/useGTM";
import { GtmEvent } from "../../enums";

/**
 * Temporary solution:
 * serves as backwards compatibility for older functionality: the PaymentReviewStep injected by the frontend before a specific step
 * Ex. Server sends form step as the first step of Wyre.
 *     The frontend has some logic that indicates if in this case it ought to display the 'Payment review' screen,
 *     and if so the first step from the server will be displayed after the user presses 'continue'
 *
 */

const generateInjectedStep = (
  collected: CollectedStateType,
  nextStep: NextStep,
  includeCryptoAddr?: boolean
) => {
  const payAmount = collected.amountInCrypto
    ? collected.selectedGateway?.receivedCrypto || 0
    : collected.amount;
  const cryptoAmount = collected.amountInCrypto
    ? collected.amount
    : collected.selectedGateway?.receivedCrypto || 0;

  const getFiatItems = () => {
    const fiatSubItems = [];
    if (collected.selectedGateway?.fees !== undefined) {
      fiatSubItems.push({
        contentValues: {
          label: "Transfer Fee",
          value: `${collected.selectedGateway.fees} ${collected.selectedCurrency?.name}`,
        },
      });
    }
    if (collected.selectedGateway?.rate !== undefined) {
      fiatSubItems.push({
        contentValues: {
          label: "Conversion Rate",
          value: `${collected.selectedGateway.rate} ${collected.selectedCurrency?.name}`,
        },
      });
    }
    return fiatSubItems;
  };

  const getTransactionTime = () => {
    if (!collected.selectedGateway?.duration) {
      return [];
    }

    return [
      {
        type: StepType.stepsOverview,
        items: [
          {
            description: "Expected transaction time",
            title: collected.selectedGateway.duration.message,
            name: "ExpectedTransationTime",
          },
        ],
      },
    ];
  };

  const getAddressTag = () => {
    if (!includeCryptoAddr) {
      return [];
    }

    return [
      {
        type: StepType.stepsOverview,
        items: [
          {
            description: "Wallet address",
            title: collected.cryptocurrencyAddress?.address,
            name: "WalletAddress",
          },
        ],
      },
      {
        type: StepType.stepsOverview,
        items: [
          {
            description: "Address tag",
            title: collected.cryptocurrencyAddress?.memo,
            name: "AddressTag",
          },
        ],
      },
    ].filter((i) => !!i.items[0].title);
  };

  return {
    type: StepType.paymentReview,
    progress: nextStep.progress,
    useHeading: true,
    title: "Review Payment",
    description: "Please verify the details below carefully",
    data: [
      {
        type: StepType.stepsOverview,
        items: [
          {
            description: "You pay",
            title: `${payAmount} ${collected.selectedCurrency?.name}`,
            name: "fiatCurrency",
            icon: collected.selectedCurrency?.icon,
            items: getFiatItems(),
          },
          {
            description: "You receive",
            name: "cryptoCurrency",
            title: `${cryptoAmount} ${collected.selectedCrypto?.name || ""}`,
            icon: collected.selectedCrypto?.icon,
            info: "This might differ due to market volatility.",
          },
        ],
      },
      ...getTransactionTime(),
      ...getAddressTag(),
    ],
  } as PaymentReviewStep;
};

const PaymentReviewDecorator: React.FC<
  Omit<PaymentReviewProps, "nextStep"> & { nextStep: NextStep }
> = (props) => {
  const { nextScreen, currentStep } = useContext(NavContext);
  const { collected } = useContext(APIContext);
  const stepRef = useRef(
    generateInjectedStep(collected, props.nextStep, props.includeCryptoAddr)
  );

  const onButtonAction = () => {
    triggerGTMEvent({
      event: GtmEvent.FIAT_TO_CRYPTO,
      category:
        props.nextStep?.eventCategory || collected.selectedGateway?.id || "",
      label: "review",
      action: `step ${currentStep() + 1}`,
      value: generateGtmCtxValue(collected, props.nextStep?.txId),
    });
    nextScreen(<Step nextStep={props.nextStep} isConfirmed />);
  };

  return (
    <ConfirmPaymentView
      {...props}
      onButtonAction={onButtonAction}
      nextStep={stepRef.current}
    />
  );
};

export default PaymentReviewDecorator;
