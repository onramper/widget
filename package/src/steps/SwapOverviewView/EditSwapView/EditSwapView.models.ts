import { TokenInfo } from "layer2";

export interface EditSwapViewInput extends TokenInfo {
  label: string;
  value: string;
  fiatConversion: number;
  fiatSymbol: string;
  currencyShortName: string;
  currencyLongName: string;
  icon?: string;
}

export type EditSwapViewProps = {
  progress?: number;
};
