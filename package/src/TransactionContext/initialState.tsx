import { UNISWAP_DEFAULTS as defaultSettings } from "layer2";
import { StateType } from "./models";

const initialState: StateType = {
  key: 0,
  userId: "",
  inAmount: 0,
  txId: "---transaction--id---",
  quote: null,
  transactionRequest: null,
  selectedWalletAddress: undefined,
  tokenIn: {
    name: "",
    address: "",
    symbol: "",
    decimals: 18,
    chainId: 3,
    logoURI: "",
  },
  tokenOut: {
    name: "",
    address: "",
    symbol: "",
    decimals: 18,
    chainId: 3,
    logoURI: "",
  },
  wallets: [],
  customerGateway: "gateway_dex",
  fiatSymbol: "$",
  slippageTolerance: defaultSettings.slippageTolerance,
  deadline: defaultSettings.deadline,
};

export default initialState;
// key: number; **
// wallets: WalletItemData[];
// selectedWalletAddress?: string;
// slippageTolerance: number; **
// deadline: number; **
// quote?: QuoteDetails;
