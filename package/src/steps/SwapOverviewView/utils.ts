import { TokenInfo } from "layer2";
import { SwapOverviewStepData } from "../../ApiContext/api/types/nextStep";
import { ConfirmSwapViewProps } from "./ConfirmSwapView/ConfirmSwapView.models";

type ConfirmSwapParam = {
  data: SwapOverviewStepData;
  parsedTokenIn: TokenInfo;
  fiatConversion: number;
  tokenInURL: string;
  tokenOutURL: string;
};

export const createConfirmSwapProps: (
  param: ConfirmSwapParam
) => ConfirmSwapViewProps = ({
  data,
  parsedTokenIn,
  fiatConversion,
  tokenInURL,
  tokenOutURL,
}) => {
  return {
    cryptoSpent: {
      label: "You spend",
      value: data.transactionData.amountDecimals,
      balance: data.balance,
      fiatConversion,
      fiatSymbol: data.fiatSymbol,
      currencyShortName: parsedTokenIn.symbol,
      currencyLongName: parsedTokenIn.name,
      icon: tokenInURL,
    },
    cryptoReceived: {
      label: "You receive",
      value: data.transactionData.quoteGasAdjustedDecimals,
      fiatConversion,
      fiatSymbol: data.fiatSymbol,
      currencyShortName: data.tokenOut.symbol,
      currencyLongName: data.tokenOut.name,
      icon: tokenOutURL,
    },
    feeBreakdown: {
      label: "Fee breakdown:",
      groups: data.feeBreakdown
    },
    warning:
      "Above mentioned figures are valid for 1 minute based upon current market rates.",
    defaultDeadline: data.defaultSlippage,
    defaultSlippage: data.defaultSlippage,
    wallets: data.walletsData.wallets,
    selectedWalletId: data.walletsData.selectedWalletId
  };
};
