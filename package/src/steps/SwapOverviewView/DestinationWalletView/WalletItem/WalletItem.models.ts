export type WalletItemProps = {
    label: string;
    icon?: string;
    isChecked: boolean;
    isConnected?: boolean;
    onCheck: () => void;
    onDelete?: () => void;
    address?: string;
    onSubmitAddress?: (value: string) => Promise<void>;
} 