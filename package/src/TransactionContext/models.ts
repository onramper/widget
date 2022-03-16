import { WalletItemData } from "../ApiContext/api/types/nextStep"

export type StateType = {
    wallets: WalletItemData[],
    selectedWalletAddress?: string;
    userId: string;
}

export type InitParams = {
    userId: string;
}