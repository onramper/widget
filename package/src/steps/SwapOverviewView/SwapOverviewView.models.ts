import {
  SwapOverviewStepData,
  SwapOverviewVewStep,
} from "../../ApiContext/api/types/nextStep";

export type SwapOverviewViewProps = {
  nextStep: SwapOverviewVewStep;
};

export type ConfirmSwapEditResults = {
  deadline: number;
  slippage: number;
};

export type ConfirmSwapParam = {
  data: SwapOverviewStepData;
  slippageTolerance: number;
  deadline: number;
};