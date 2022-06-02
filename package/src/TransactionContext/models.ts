import { QuoteDetails, TokenInfo } from "layer2";
import { WalletItemData } from "../ApiContext/api/types/nextStep";

export interface StateType {
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  inAmount: number;
  fiatSymbol: string;
  txId: string;
  key: number;
  userId: string;
  wallets: WalletItemData[];
  selectedWalletAddress?: string;
  slippageTolerance: number;
  deadline: number;
  quote: QuoteDetails;
}
