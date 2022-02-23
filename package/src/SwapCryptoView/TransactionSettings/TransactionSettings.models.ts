import { WallletListItem } from "../../ApiContext/api/types/nextStep";

export type TransactionSettingsProps = {
    defaultSlippage: number;
    defaultDeadline: number;
    className?: string;
    wallets: WallletListItem[]
}