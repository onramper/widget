import { Estimate, TokenInfo } from "layer2";
import { WalletItemData } from "../ApiContext/api/types/nextStep";
import { providers } from "ethers";

export interface StateType {
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  inAmount: number;
  fiatSymbol: string;
  txId: string;
  key: number;
  userId: string;
  wallets: WalletItemData[];
  slippageTolerance: number;
  deadline: number;
  quote: Estimate | null;
  transactionRequest: providers.TransactionRequest | null;
  customerGateway: string;
  selectedWalletAddress?: string;
}
