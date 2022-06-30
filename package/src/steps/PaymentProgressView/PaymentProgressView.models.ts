import { PaymentProgressViewStep } from "../../ApiContext/api/types/nextStep";

export type PaymentProgressViewProps = {
  nextStep?: PaymentProgressViewStep;
};

export type SwapData = Omit<
  PaymentProgressViewStep,
  "type" | "progress" | "txId"
>;

export enum Status {
  Pending = "Pending",
  Success = "Success",
  Fail = "Fail",
}

// some defaults to use if rendering component from email and we only know the txId
export const defaults: SwapData = {
  tokenIn: {
    name: "Input Token Name",
    address: "In address",
    symbol: "WETH",
    decimals: 18,
    chainId: 3,
    logoURI: "",
  },
  tokenOut: {
    name: "Output Token Name",
    address: "output token address",
    symbol: "OUT",
    decimals: 18,
    chainId: 3,
    logoURI: "",
  },
  customerGateway: "Gateway_DExchange",
  inCurrency: "USD",
};
