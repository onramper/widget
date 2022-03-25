export type WalletItemProps = {
    label: string;
    icon?: string;
    isChecked: boolean;
    isConnected?: boolean;
    onCheck: () => void;
    onDelete?: () => void;
    address?: string;
    onEditAddress?: (value: string) => Promise<void>;
    setError?: (value?: string) => void;
    error?: string;
} 