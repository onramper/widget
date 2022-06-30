import LIFI, { ConfigUpdate, QuoteRequest } from "@lifinance/sdk";
import { utils } from "ethers";
import { TokenInfo } from "layer2";

const testEnvConfig: ConfigUpdate = {
  apiUrl: "https://staging.li.quest/v1/",
};

export const lifi = new LIFI(
  process.env.STAGE !== "prod" ? testEnvConfig : undefined
);

export const getLifiQuote = async (
  tokenIn: TokenInfo,
  tokenOut: TokenInfo,
  inputAmount: number, // not formatted
  destinationAddress?: string,
  signal?: AbortSignal
) => {
  const formattedAmount = utils
    .parseUnits(inputAmount.toString(), tokenIn.decimals)
    .toString();
  const request: QuoteRequest = {
    fromChain: tokenIn.chainId,
    fromToken: tokenIn.address,
    fromAddress: tokenIn.address,
    fromAmount: formattedAmount,
    toChain: tokenOut.chainId,
    toToken: tokenOut.address,
    toAddress: destinationAddress,
  };
  return lifi.getQuote(request, { signal });
};
