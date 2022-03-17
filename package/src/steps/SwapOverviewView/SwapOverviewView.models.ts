import {
  SwapOverviewStepData,
  SwapOverviewVewStep,
} from "../../ApiContext/api/types/nextStep";

export type SwapOverviewViewProps = {
  nextStep: SwapOverviewVewStep;
};

export type ConfirmSwapParam = {
  data: SwapOverviewStepData;
};