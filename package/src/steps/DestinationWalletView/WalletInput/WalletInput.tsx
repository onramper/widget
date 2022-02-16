import React from "react";
import InputDelegator from "../../../common/Input/InputDelegator";
import classes from "./WalletInput.module.css";
import { ReactComponent as EnterIcon } from "../../../icons/enter.svg";

const WalletInput: React.FC<{
  onSubmit: () => void;
  errorMessage?: string;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}> = (props) => {
  return (
    <InputDelegator
      label=""
      name="walletAddress"
      placeholder="e.g 0x3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5"
      icon={<EnterIcon />}
      iconPosition="end"
      onIconClick={props.onSubmit}
      onEnter={props.onSubmit}
      externalIconClassName={classes["input-icon"]}
      error={props.errorMessage}
      value={props.value}
      className={classes["address-input"]}
      onChange={(name: string, value: string) => {
        props.onChange(value);
      }}
      autoFocus
    />
  );
};

export default WalletInput;
