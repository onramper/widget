import { NextStep } from "../../ApiContext";

export type PaymentReviewProps = {
  nextStep: NextStep & { type: "paymentReview" };
  includeCryptoAddr?: boolean;
  onButtonAction?: () => void;
};
