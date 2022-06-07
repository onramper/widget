import { SwapOverviewViewStep } from "../../ApiContext/api/types/nextStep";

export type SwapOverviewViewProps = {
  nextStep: SwapOverviewViewStep;
};

export const startProps: SwapOverviewViewProps = {
  nextStep: {
    type: "swapOverview",
    progress: 80,
    amountIn: 0.005,
    amountOut: 0,
    tokenIn: {
      name: "Wrapped Ether",
      address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
      symbol: "WETH",
      decimals: 18,
      chainId: 3,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    },
    tokenOut: {
      name: "Onramper Test Token",
      symbol: "OTT",
      address: "0xBe8AFb431f18C126a69B79E87cA3016936D7060C",
      logoURI:
        "https://pbs.twimg.com/profile_images/1309065154856980480/dXJItCo4_400x400.jpg",
      chainId: 3,
      decimals: 18,
    },
    fiatSymbol: "$",
    userId: "",
    txId: "Arf4m7ZCTeH7nM9v8KFXmg--",
  },
};
