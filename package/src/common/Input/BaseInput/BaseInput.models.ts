import React, { ReactChild } from "react";
import type { DateType } from "../../Input/DatePicker";

export type InputFacadeProps = {
  max?: string;
  disabled?: boolean;
  symbol?: string;
  placeholder?: string;
  label?: string;
  className?: string;
  icon?: string | React.ReactNode;
  iconPosition?: "start" | "end";
  symbolPosition?: "start" | "end";
  externalIconClassName?: string;
  onChange?: (name: string, value: any, type?: string) => void;
  onEnter?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
  value?: number | string | DateType;
  type?: string;
  name: string;
  onIconClick?: (name: string, value: string, label: string) => void;
  error?: string | boolean;
  hint?: string;
  hintButton?: boolean;
  onHintClick?: () => void;
  clickableIcon?: boolean;
  maxLength?: number;
  info?: string;
  iconTitle?: string;
  isRequired?: boolean;
  variant?: "setting";
  align?: "right" | "left" | "center";
  autoFocus?: boolean;
};

export type BaseInputProps = Omit<InputFacadeProps, "onChange"> & {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void | boolean;
  iconClassName?: "icon-chevron" | "icon-date";
  inputSupportFallbackNode?: ReactChild;
  inputNotSupported?: boolean;
  formatValue?: (value?: any) => string;
};
