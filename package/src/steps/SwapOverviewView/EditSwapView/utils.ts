import { QuoteDetails } from "layer2";

export const generateBreakdown = (
  quote: QuoteDetails,
  tokenOutSymbol: string,
  slippage: number,
  priceImpact?: number
) => {
  return [
    [
      {
        label: "Expected Output",
        value: `${Number(quote.quoteDecimals).toFixed(
          5
        )} ${tokenOutSymbol}`,
        strong: true,
      },
      ...(priceImpact === undefined
        ? []
        : [
            {
              label: "USD Price Impact",
              value: `${priceImpact.toFixed(2)}%`,
              strong: true,
              hint: "An estimation of the difference between USD conversions of the input and output amounts.",
            },
          ]),
    ],
    [
      {
        label: "Minimum recieved after slippage ",
        subLabel: `(${slippage.toFixed(2)} %)`,
        value: `${(
          Number(quote.quoteGasAdjustedDecimals) -
          (slippage / 100) * Number(quote.quoteGasAdjustedDecimals)
        ).toFixed(5)} ${tokenOutSymbol}`,
      },
      {
        label: "Network Fee",
        value: `~$${Number(quote.gasUseEstimateUSD).toFixed(2)}`,
      },
    ],
  ];
};
