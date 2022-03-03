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
  balance?: number;
}

export type EditSwapViewProps = {
  progress?: number;
  cryptoSpent: EditSwapViewInput;
  cryptoReceived: EditSwapViewInput;
  feeBreakdown: {
    label: string;
    groups: BrakdownItem[][];
  };
  warning: string;
  defaultDeadline: number;
  defaultSlippage: number;
  wallets: WalletItemData[];
  selectedWalletId?: string;
  submitData: (results: ConfirmSwapEditResults) => void;
};
