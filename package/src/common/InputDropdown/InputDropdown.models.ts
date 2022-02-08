import { DropdownHandleProps } from "../DropdownHandle/DropdownHandle.models";

export type InputDropdownProps = {
    label: string;
    value: string;
    hint?: string;
    suffix?: string;
    error?: string;
    disabled?: boolean;
    useEditIcon?: boolean;
    handleProps: DropdownHandleProps;
    className?: string;
    isInitialLoading?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onMaxClick?: () => void;
  };