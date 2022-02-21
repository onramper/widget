import { NextStep } from "../../ApiContext";

export type ConfrimSwapViewProps = {
  nextStep: NextStep & {
    type: "confirmSwap";
  };
};
