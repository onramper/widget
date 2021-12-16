import React from "react";
import BaseInput from "./BaseInput/BaseInput";
import { BaseInputProps } from "./BaseInput/BaseInput.models";

const DateInput: React.FC<BaseInputProps> = (props) => {

    // const handleInputChange = useCallback(
    //     (e: React.ChangeEvent<HTMLInputElement>) => {
            
    //         const value = e.currentTarget.value === ""
    //             ? e.currentTarget.value
    //             : type === "number"
    //             ? +e.currentTarget.value
    //             : e.currentTarget.value;
    //         if (!value && value !== "" && type === "number") return false;
    //         if (e.currentTarget.type === "date" && typeof value === "string") {
    //         const date = {
    //             year: value.split("-")[0],
    //             month: value.split("-")[1],
    //             day: value.split("-")[2],
    //         };
    //         onChange?.(e.currentTarget.name, date, e.currentTarget.type);
    //         return;
    //         }
    //         onChange?.(e.currentTarget.name, value, e.currentTarget.type);
    //     },
    //     [onChange, type]
    //     );

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

export default DateInput;
