import { NextStep } from "../../ApiContext";
import { ConfirmSwapViewProps } from "./ConfirmSwapView/ConfirmSwapView.models";
import {
  ConfirmSwapEditResults,
  ConfirmSwapParam,
} from "./SwapOverviewView.models";

export const createConfirmSwapProps: (
  param: ConfirmSwapParam
) => Omit<ConfirmSwapViewProps, "submitData"> = ({
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
  results: ConfirmSwapEditResults
) => {
  const { spentValue, receivedValue, balance, selectedWalletId, wallets, deadline, slippage } =
    results;
    
  nextStep.data.transactionData.amountDecimals = spentValue;
  nextStep.data.transactionData.quoteGasAdjustedDecimals = receivedValue;
  nextStep.data.balance = balance;
  nextStep.data.walletsData.selectedWalletId = selectedWalletId;
  nextStep.data.walletsData.wallets = wallets;
  nextStep.data.slippage = slippage;
  nextStep.data.deadline = deadline;

  return nextStep;
};
