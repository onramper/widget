import { WalletItemData } from "../../../ApiContext/api/types/nextStep";

export type TransactionSettingsProps = {
    className?: string;
    selectedWalletAddress?: string;
    cryptoName: string;
    onChangeWalletAddress: (id: string) => void;
    wallets: WalletItemData[];
    updateWallets: (items: WalletItemData[]) => void;
}