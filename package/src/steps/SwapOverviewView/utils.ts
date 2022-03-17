import { EditSwapViewProps } from "./EditSwapView/EditSwapView.models";
import {
  ConfirmSwapParam,
} from "./SwapOverviewView.models";

export const createConfirmSwapProps: (
  param: ConfirmSwapParam
) => Omit<EditSwapViewProps, "submitData"> = ({
  data,
  slippageTolerance,
  deadline,
  wallets,
  selectedWalletAddress,
}) => {
  return {
    feeBreakdown: {
      label: "Fee breakdown:",
      groups: data.feeBreakdown,
    },
    warning:
      "Above mentioned figures are valid for 1 minute based upon current market rates.",
    wallets,
    selectedWalletAddress,
    slippageTolerance,
    deadline
  };
};
