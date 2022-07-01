import LIFI, { ConfigUpdate, QuoteRequest } from "@lifinance/sdk";
import { utils } from "ethers";
import { TokenInfo } from "layer2";

// if ?prod=true
const isProd = (): boolean => {
  const url = new URL(window.location.href);
  const prodValue = url.searchParams.get("prod");
  if (prodValue) return true;
  return false;
};

const lifiUrl = isProd()
  ? "https://li.quest/v1/"
  : "https://staging.li.quest/v1/";

const lifiConfig: ConfigUpdate = {
  apiUrl: lifiUrl,
};

export const lifi = new LIFI(lifiConfig);

export const getLifiQuote = async (
  tokenIn: TokenInfo,
  tokenOut: TokenInfo,
  inputAmount: number, // not formatted
  userAccount: string,
  destinationAddress?: string,
  signal?: AbortSignal,
  slippage: number = 0.05
) => {
  const formattedAmount = utils
    .parseUnits(inputAmount.toString(), tokenIn.decimals)
    .toString();
  const request: QuoteRequest = {
    fromChain: tokenIn.chainId,
    fromToken: tokenIn.address,
    fromAddress: userAccount,
    fromAmount: formattedAmount,
    toChain: tokenOut.chainId,
    toToken: tokenOut.address,
    toAddress: destinationAddress,
    slippage: slippage,
  };
  return lifi.getQuote(request, { signal });
};
