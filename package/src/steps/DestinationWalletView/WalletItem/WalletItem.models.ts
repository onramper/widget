export type WalletItemProps = {
    label: string;
    title: string;
    info: string;
    icon?: string;
    isChecked: boolean;
    isConnected?: boolean;
    onCheck: () => void;
    onDelete?: () => void;
    address?: string;
    onSubmitAddress?: (value: string) => Promise<void>;
} 