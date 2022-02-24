import { WalletItemData } from "../../../ApiContext/api/types/nextStep";

export type DestinationWalletViewProps = {
  progress?: number;
  title: string;
  heading: string;
  description: string;
  wallets: WalletItemData[];
  cryptoName: string;
  selectedWalletId?: string;
  submitData: (wallets: WalletItemData[], walletId: string) => void;
};
