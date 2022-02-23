import { WallletListItem } from "../../ApiContext/api/types/nextStep";

export type TransactionSettingsProps = {
    defaultSlippage: number;
    defaultDeadline: number;
    className?: string;
    selectedWalletId?: string;
    onChangeWalletId: (id: string) => void;
    wallets: WallletListItem[]
}