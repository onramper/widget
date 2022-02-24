import { NextStep } from "../../../ApiContext";

export type DestinationWalletViewProps = {
  nextStep: NextStep & { type: "destinationWallet" };
};
