import { WalletItemData } from "../../../ApiContext/api/types/nextStep";

export type TransactionSettingsProps = {
    defaultSlippage: number;
    className?: string;
    selectedWalletAddress?: string;
    cryptoName: string;
    slippage: string;
    deadline: string;
    onChangeWalletAddress: (id: string) => void;
    onChangeSlippage: (value: string) => void;
    onChangeDeadline: (value: string) => void;
    wallets: WalletItemData[];
    updateWallets: (items: WalletItemData[]) => void;
}