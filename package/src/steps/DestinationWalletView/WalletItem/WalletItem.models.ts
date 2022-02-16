export type WalletItemProps = {
    label: string;
    title: string;
    info: string;
    icon?: string;
    isChecked: boolean;
    isConnected?: boolean;
    onDelete?: () => void;
    onChangeAddress?: (value: string) => void;
    address?: string;
    onSubmitAddress?: () => void;
} 