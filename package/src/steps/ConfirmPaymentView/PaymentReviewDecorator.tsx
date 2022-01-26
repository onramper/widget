import React, { useContext } from "react";
import Step from "../Step";

import { NavContext } from "../../NavContext";
import { PaymentReviewProps } from "./PaymentReview.models";
import { NextStep } from "../../ApiContext";
import ConfirmPaymentView from ".";

/**
 * serves as backwards compatibility for older functionality: the PaymentReviewStep injected by the frontend before a specific step
 * Ex. Server sends form step as the first step of Wyre. 
 *     The frontend has some logic that indicates if in this case it ought to display the 'Payment review' screen, 
 *     and if so the first step from the server will be displayed after the user presses 'continue'
 */

const injectedStep = {
  type: "paymentReview",
  progress: 30,
  useHeading: true,
  title: "Review Payment",
  description: "Please verify the details below carefully",
} as NextStep;

const PaymentReviewDecorator: React.FC<PaymentReviewProps> = (props) => {
  const { nextScreen } = useContext(NavContext);

  const onButtonAction = () => {
    nextScreen(<Step nextStep={props.nextStep} isConfirmed />);
  };

  return <ConfirmPaymentView {...props} onButtonAction={onButtonAction} nextStep={injectedStep} />;
};

export default PaymentReviewDecorator;
