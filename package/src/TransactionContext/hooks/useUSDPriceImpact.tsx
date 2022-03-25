import { useTransactionContext } from "./useTransactionContext";
import { QuoteDetails, useUsdPriceImpact } from "layer2";

export const useUSDPriceImpact = (quote: QuoteDetails) => {
  const { tokenIn, tokenOut } = useTransactionContext();
  return useUsdPriceImpact(
    tokenIn,
    tokenOut,
    Number(quote.amountDecimals),
    Number(quote.quoteGasAdjustedDecimals)
  );
};
