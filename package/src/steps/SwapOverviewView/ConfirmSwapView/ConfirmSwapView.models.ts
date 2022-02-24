import { BrakdownItem, WalletItemData } from "../../../ApiContext/api/types/nextStep";

export type ConfirmSwapInput = {
  label: string;
  value: string;
  fiatConversion: number;
  fiatSymbol: string;
  currencyShortName: string;
  currencyLongName: string;
  icon?: string;
  balance?: number;
};

export type ConfirmSwapViewProps = {
  progress?: number;
  cryptoSpent: ConfirmSwapInput;
  cryptoReceived: ConfirmSwapInput;
  feeBreakdown: {
    label: string;
    groups: BrakdownItem[][];
  };
  warning: string;
  defaultDeadline: number;
  defaultSlippage: number;
  wallets: WalletItemData[];
  selectedWalletId?: string;
};
