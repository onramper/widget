import { Step, UNISWAP_DEFAULTS as defaultSettings } from "layer2";
import { StateType } from "./models";

const initialState: StateType = {
  key: 0,
  userId: "",
  inAmount: 0,
  txId: "---transaction--id---",
  quote: {
    blockNumber: "",
    amount: "",
    amountDecimals: "",
    quote: "",
    quoteDecimals: "",
    quoteGasAdjusted: "",
    quoteGasAdjustedDecimals: "",
    gasUseEstimateQuote: "",
    gasUseEstimateQuoteDecimals: "",
    gasUseEstimate: "",
    gasUseEstimateUSD: "",
    gasPriceWei: "",
    route: [],
    routeString: "",
    quoteId: "",
  },
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
  lifiQuote: {} as Step,
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
