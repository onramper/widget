import { NextStep } from "../../ApiContext";
import { PayamentReviewDataItem } from "../../ApiContext/api/types/nextStep";

export type PaymentReviewProps = {
  nextStep: NextStep & { type: "paymentReview" };
  includeCryptoAddr?: boolean;
  onButtonAction?: () => void;
};

export type BodyConfirmPaymentViewType = {
  onActionButton: () => void;
  heading?: string;
  subHeading?: string;
  errorMessage?: string;
  isLoading?: boolean;
  overviewSteps: PayamentReviewDataItem[];
};
