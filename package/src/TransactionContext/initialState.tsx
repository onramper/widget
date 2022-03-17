import { StateType } from "./models";
import { DEFAULTS as defaultSettings } from "layer2";

export default {
  key: 0,
  userId: "",
  currentQuote: {
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
  fiatConversion: 200,
  slippageTolerance: defaultSettings.slippageTolerance,
  deadline: defaultSettings.deadline
} as StateType;
