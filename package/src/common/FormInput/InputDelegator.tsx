import React from "react";
import BaseInput from "./BaseInput/BaseInput";
import { InputFacadeProps } from "./BaseInput/BaseInput.models";
import DateInput from "./DateInput";
import NumberInput from "./NumberInput";

const InputDelegator: React.FC<InputFacadeProps> = (props) => {
  if (props.type === "number") {
    return <NumberInput {...props} />;
  }

  if (props.type === "date") {
    return <DateInput {...props} />;
  }

  return (
    <BaseInput
      {...props}
      handleInputChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange?.(e.currentTarget.name, e.currentTarget.value, e.currentTarget.type);
      }}
    />
  );
};

export default InputDelegator;