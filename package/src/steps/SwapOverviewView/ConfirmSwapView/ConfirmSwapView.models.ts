export type ConfirmSwapInput = {
  label: string;
  value: string;
  fiatConversion: number;
  fiatSymbol: string;
  currencyShortName: string;
  currencyLongName: string;
  icon: string;
  balance?: number;
};

export type BrakdownItem = {
  label: string;
  subLabel?: string;
  value: string;
  strong?: boolean;
  hint?: string;
};

export type WallletListItem = {
  id: string;
  icon?: string;
  accountName: string;
  walletAddress?: string;
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
  wallets: WallletListItem[];
  selectedWalletId?: string;
};
