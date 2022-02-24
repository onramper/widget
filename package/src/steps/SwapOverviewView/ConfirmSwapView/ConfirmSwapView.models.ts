import { NextStep } from "../../../ApiContext";

export type ConfirmSwapViewProps = {
  nextStep: NextStep & {
    type: "confirmSwap";
  };
};
