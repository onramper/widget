import React from "react";
import BaseInput from "./BaseInput/BaseInput";
import { BaseInputProps } from "./BaseInput/BaseInput.models";

const NumberInput: React.FC<BaseInputProps> = (props) => {
  return (
    <BaseInput
      disabled={props.disabled}
      symbol={props.symbol}
      placeholder={props.placeholder}
      label={props.label}
      className={props.className}
      icon={props.icon}
      iconPosition={props.iconPosition}
      symbolPosition={props.symbolPosition}
      value={props.value}
      type="number"
      name={props.name}
      onIconClick={props.onIconClick}
      onHintClick={props.onHintClick}
      error={props.error}
      hint={props.hint}
      hintButton={props.hintButton}
      clickableIcon={props.clickableIcon}
      maxLength={props.maxLength}
      info={props.info}
      iconTitle={props.iconTitle}
      isRequired={props.isRequired}
    />
  );
};

export default NumberInput;
