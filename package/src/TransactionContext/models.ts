import { QuoteDetails, TokenInfo } from "layer2";
import { WalletItemData } from "../ApiContext/api/types/nextStep";

export type StateType = {
  key: number;
  userId: string;
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  currentQuote: QuoteDetails;
  fiatSymbol: string;
  fiatConversion: number;
  wallets: WalletItemData[];
  selectedWalletAddress?: string;
  slippageTolerance: number;
  deadline: number;
};
