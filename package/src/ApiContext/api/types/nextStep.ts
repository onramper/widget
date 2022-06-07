import { OverviewStepItem } from "../../../common/StepsOverview/StepsOverview.models";
import { QuoteDetails, TokenInfo } from "layer2";
type StepFormBaseField = {
  placeholder?: string;
  icon?: string;
  iconPosition?: "start" | "end";
};

type StepDataItems = Array<
  StepFormBaseField &
    (
      | {
          type: "select";
          name: string;
          humanName: string;
          options: {
            value: string;
            humanName: string;
            icon?: string;
          }[];
          hint?: string;
          required?: boolean;
        }
      | {
          type: "choice";
          options: string[];
          humanName: string;
          name: string;
          hint?: string;
          required?: boolean;
        }
      | {
          type: "string" | "integer";
          humanName: string;
          name: string;
          hint?: string;
          required?: boolean;
        }
      | {
          type: "date";
          name: string;
          humanName: string;
          hint?: string;
          required?: boolean;
          data: [
            {
              type: "integer";
              humanName: "Day";
              name: "day";
            },
            {
              type: "integer";
              humanName: "Month";
              name: "month";
            },
            {
              type: "integer";
              humanName: "Year";
              name: "year";
            }
          ];
        }
      | {
          type: "boolean";
          name: "termsOfUse";
          terms: {
            url: string;
            humanName: string;
          }[];
        }
    )
>;

interface FileStep {
  type: "file";
  humanName: string;
  hint?: string;
  url: string;
  acceptedContentTypes: string[];
}

interface InfoDepositBankAccount {
  iban: string;
  bic: string;
  bankName: string;
  bankAddress: string;
  accountName: string;
  accountAddress: string;
}

type EmailVerificationStep = {
  type: "emailVerification";
  url?: string;
  description?: string;
  data: {
    humanName: string;
    name: string;
    hint?: string;
    initialValue?: string;
    placeholder: string;
  };
};

type NextStepBase = {
  useHeading?: boolean;
  title?: string;
  heading?: string;
  progress?: number;
  humanName?: string;
  description?: string;
};

export type PayamentReviewDataItem = {
  type: "StepsOverview";
  items: OverviewStepItem[];
};

export type PaymentReviewStep = {
  type: "paymentReview";
  url?: string;
  data: PayamentReviewDataItem[];
};

export type WalletItemData = {
  address: string;
  name: string;
  network: string;
  icon?: string;
  isConnected?: boolean;
};

export type BrakdownItem = {
  label: string;
  subLabel?: string;
  value: string;
  strong?: boolean;
  hint?: string;
};

export type SwapOverviewViewStep = {
  type: "swapOverview";
  progress: number;
  amountIn: number;
  amountOut: number;
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  fiatSymbol: string;
  userId: string;
  txId: string;
};

export type PaymentProgressViewStep = {
  type: "paymentProgress";
  progress: number;
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  gatewayAndDex: string;
  txId: string;
  inCurrency: string; //EUR
};

export type IframeStep = {
  type: "iframe";
  url: string;
  l2TokenData: TokenInfo;
  inAmount: number;
  inCurrency: string; //EUR
  cryptocurrencyAddress: string;
  txId: string;
  fullscreen: boolean;
  neededFeatures?: string;
};

export type RedirectStep = {
  type: "redirect";
  url: string;
  hint?: string;
  l2TokenData: TokenInfo;
  cryptocurrencyAddress: string;
  txId: string;
  inAmount: number;
  inCurrency: string; //EUR
};

type NextStep = NextStepBase &
  (
    | FileStep
    | {
        type: "information";
        url?: string;
        message: string;
        extraData?: StepDataItems;
      }
    | {
        type: "form";
        url: string;
        data: StepDataItems;
        hint?: string;
      }
    | IframeStep
    | RedirectStep
    | {
        type: "wait";
        url: string;
        extraData?: StepDataItems;
      }
    | {
        type: "pickOne";
        options: FileStep[];
        humanName?: string;
        hint?: string;
      }
    | {
        type: "completed";
        trackingUrl: string;
      }
    | {
        type: "requestBankTransaction";
        depositBankAccount: InfoDepositBankAccount;
        reference: string;
        hint: string;
      }
    | EmailVerificationStep
    | PaymentReviewStep
    | SwapOverviewViewStep
    | PaymentProgressViewStep
  );

interface FieldError {
  field: string;
  message: string;
}

type NextStepErr = FieldError[] | { message: string };

export type {
  NextStep,
  StepDataItems,
  InfoDepositBankAccount,
  FileStep,
  NextStepErr,
  FieldError,
};
