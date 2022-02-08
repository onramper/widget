import { DropdownHandleProps } from "../DropdownHandle/DropdownHandle.models";

export type InputDropdownProps = {
    label: string;
    value: string;
    error?: string;
    disabled?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    handleProps: DropdownHandleProps;
    className?: string;
    isInitialLoading?: boolean;
  };