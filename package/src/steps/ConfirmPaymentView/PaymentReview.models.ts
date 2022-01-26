import { NextStep } from "../../ApiContext";

export type PaymentReviewProps = {
  nextStep: NextStep;
  includeCryptoAddr?: boolean;
  onButtonAction?: () => void;
};
