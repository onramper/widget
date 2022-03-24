import { useUsdPriceImpact } from "../../../../../layer2/dist";
import { useTransactionContext } from "./useTransactionContext";
import { QuoteDetails } from "layer2";

export const usePriceImpact = (quote: QuoteDetails) => {
  const { tokenIn, tokenOut } = useTransactionContext();
  return useUsdPriceImpact(
    tokenIn,
    tokenOut,
    Number(quote.amountDecimals),
    Number(quote.quoteGasAdjustedDecimals)
  );
};
