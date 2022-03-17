import { QuoteDetails, TokenInfo } from "layer2";
import { WalletItemData } from "../ApiContext/api/types/nextStep";

export type StateType = {
  key: number;
  wallets: WalletItemData[];
  selectedWalletAddress?: string;
  userId: string;
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  currentQuote: QuoteDetails;
};
