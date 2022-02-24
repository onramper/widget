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

type OrderCompleteStep = {
  type: "orderComplete";
  description?: string;
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
  walletAddress: string;
  accountName: string;
  id: string;
  balance: number;
  icon?: string;
  isConnected?: boolean;
};
export type DestinationWalletStep = {
  type: "destinationWallet";
  url: string;
  data: WalletItemData[];
  cryptoName: string;
  selectedWalletId?: string;
};

export type BrakdownItem = {
  label: string;
  subLabel?: string;
  value: string;
  strong?: boolean;
  hint?: string;
};

export type SwapOverviewStepData = {
  userData: {
    userAddress: string;
  };
  transactionData: QuoteDetails;
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  fiatSymbol: string;
  balance: number;
  defaultDeadline: number;
  defaultSlippage: number;
  feeBreakdown: BrakdownItem[][];
  walletsData: {
    wallets: WalletItemData[];
    selectedWalletId?: string;
  }
};

export type SwapOverviewVewStep = {
  type: "transactionOverview";
  data: SwapOverviewStepData;
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
    | {
        type: "iframe";
        url: string;
        fullscreen: boolean;
        neededFeatures?: string;
      }
    | {
        type: "redirect";
        url: string;
        hint?: string;
      }
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
    | OrderCompleteStep
    | PaymentReviewStep
    | DestinationWalletStep
    | SwapOverviewVewStep
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
