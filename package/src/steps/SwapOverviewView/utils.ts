import { QuoteDetails } from "layer2";
import { NextStep } from "../../ApiContext";
import { EditSwapViewProps } from "./EditSwapView/EditSwapView.models";
import {
  ConfirmSwapEditResults,
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
    defaultDeadline: data.deadline,
    defaultSlippage: data.slippage,
    wallets: data.walletsData.wallets,
    selectedWalletId: data.walletsData.selectedWalletId,
  };
};

export const updatedStepFromEditSwap = (
  nextStep: NextStep & { type: "transactionOverview" },
  quote: QuoteDetails,
  results: ConfirmSwapEditResults
) => {
  const {
    spentValue,
    receivedValue,
    selectedWalletId,
    wallets,
    deadline,
    slippage,
  } = results;

  nextStep.data.transactionData.amountDecimals = spentValue;
  nextStep.data.transactionData.quoteGasAdjustedDecimals = receivedValue;
  quote.amountDecimals = spentValue;
  quote.quoteGasAdjustedDecimals = receivedValue;

  nextStep.data.walletsData.selectedWalletId = selectedWalletId;
  nextStep.data.walletsData.wallets = wallets;
  nextStep.data.slippage = slippage;
  nextStep.data.deadline = deadline;
};
