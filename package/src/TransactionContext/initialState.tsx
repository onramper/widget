import { DEFAULTS as defaultSettings } from "layer2";
import { StateType } from "./models";

const initialState: StateType = {
  key: 0,
  userId: "",
  txId: "---transaction--id---",
  quote: {
    blockNumber: "0",
    amount: "0",
    amountDecimals: "0",
    quote: "0",
    quoteDecimals: "0",
    quoteGasAdjusted: "0",
    quoteGasAdjustedDecimals: "0",
    gasUseEstimateQuote: "0",
    gasUseEstimateQuoteDecimals: "0",
    gasUseEstimate: "0",
    gasUseEstimateUSD: "0",
    gasPriceWei: "0",
    route: [],
    routeString: "",
    quoteId: "0",
  },
  tokenIn: {
    name: "",
    address: "",
    symbol: "",
    decimals: 18,
    chainId: 4,
    logoURI: "",
  },
  tokenOut: {
    name: "",
    address: "",
    symbol: "",
    decimals: 18,
    chainId: 4,
    logoURI: "",
  },
  wallets: [],
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
