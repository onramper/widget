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
}) => {
  return {
    feeBreakdown: {
      label: "Fee breakdown:",
      groups: data.feeBreakdown,
    },
    slippageTolerance,
    deadline
  };
};
