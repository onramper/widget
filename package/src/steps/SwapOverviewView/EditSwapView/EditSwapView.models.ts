import { TokenInfo } from "layer2";
import {
  BrakdownItem,
  WalletItemData,
} from "../../../ApiContext/api/types/nextStep";
import { ConfirmSwapEditResults } from "../SwapOverviewView.models";

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
  feeBreakdown: {
    label: string;
    groups: BrakdownItem[][];
  };
  warning: string;
  deadline: number;
  slippageTolerance: number;
  wallets: WalletItemData[];
  selectedWalletAddress?: string;
  submitData: (results: ConfirmSwapEditResults) => void;
};
