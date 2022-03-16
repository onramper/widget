import { QuoteDetails, TokenInfo } from "layer2";
import {
  SwapOverviewStepData,
  SwapOverviewVewStep,
  WalletItemData,
} from "../../ApiContext/api/types/nextStep";

export type SwapOverviewViewProps = {
  nextStep: SwapOverviewVewStep;
};

export type ConfirmSwapEditResults = {
  spentValue: string;
  receivedValue: string;
  selectedWalletAddress?: string;
  wallets: WalletItemData[];
  deadline: number;
  slippage: number;
};

export type ConfirmSwapParam = {
  data: SwapOverviewStepData;
  parsedTokenIn: TokenInfo;
  tokenOut: TokenInfo;
  fiatConversion: number;
  tokenInURL: string;
  tokenOutURL: string;
  quote: QuoteDetails;
  slippageTolerance: number;
  deadline: number;
  wallets: WalletItemData[];
  selectedWalletAddress?: string;
};
