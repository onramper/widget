import { PaymentProgressViewStep } from "../../ApiContext/api/types/nextStep";

export type PaymentProgressViewProps = {
  nextStep: PaymentProgressViewStep;
};

export enum Status {
  Pending = "Pending",
  Success = "Success",
  Fail = "Fail",
}
