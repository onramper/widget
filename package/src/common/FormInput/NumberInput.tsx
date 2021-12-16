import React, { useCallback } from "react";
import BaseInput from "./BaseInput/BaseInput";
import { InputFacadeProps } from "./BaseInput/BaseInput.models";

const NumberInput: React.FC<InputFacadeProps> = (props) => {

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value === "" ? "" : +e.currentTarget.value;

      if (!value && value !== "") return false;

      props.onChange?.(e.currentTarget.name, value, e.currentTarget.type);
    },
    [props]
  );

  return (
    <BaseInput
      {...props}
      type="number"
      handleInputChange={handleInputChange}
    />
  );
};

export default NumberInput;
