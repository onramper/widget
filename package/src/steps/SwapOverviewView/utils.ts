import { EditSwapViewProps } from "./EditSwapView/EditSwapView.models";
import {
  ConfirmSwapParam,
} from "./SwapOverviewView.models";

export const createConfirmSwapProps: (
  param: ConfirmSwapParam
) => Omit<EditSwapViewProps, "submitData"> = ({
  data,
  parsedTokenIn,
  tokenOut,
  fiatConversion,
  tokenInURL,
  tokenOutURL,
  quote,
  slippageTolerance,
  deadline
}) => {
  return {
    cryptoSpent: {
      ...parsedTokenIn,
      label: "You spend",
      value: quote.amountDecimals,
      balance: data.balance,
      fiatConversion,
      fiatSymbol: data.fiatSymbol,
      currencyShortName: parsedTokenIn.symbol,
      currencyLongName: parsedTokenIn.name,
      icon: tokenInURL,
    },
    cryptoReceived: {
      ...tokenOut,
      label: "You receive",
      value: quote.quoteGasAdjustedDecimals,
      fiatConversion,
      fiatSymbol: data.fiatSymbol,
      currencyShortName: data.tokenOut.symbol,
      currencyLongName: data.tokenOut.name,
      icon: tokenOutURL,
    },
    feeBreakdown: {
      label: "Fee breakdown:",
      groups: data.feeBreakdown,
    },
    warning:
      "Above mentioned figures are valid for 1 minute based upon current market rates.",
    wallets: data.walletsData.wallets,
    selectedWalletId: data.walletsData.selectedWalletId,
    slippageTolerance,
    deadline
  };
};
