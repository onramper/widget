import React, { useState } from "react";
import InputText from "../Input/InputText";
import IconMetamask from "../../icons/metamask.png";
import IconImToken from "../../icons/imtoken.png";

const TemporarDebugComponent: React.FC = () => {
    const [value, setValue] = useState("");


  return (
    <div style={{ flexGrow: 1 }}>
      <InputText
        disabled={false}
        symbol="This input symbol"
        placeholder="input placeholder"
        label={`This input label`}
        className="some-class"
        icon={IconImToken}
        iconPosition="end"
        symbolPosition="start"
        onChange={(name: string, value: string) => {
            setValue(value);
        }}
        value={value}
        type={"text"}
        name="cryptocurrencyAddress"
        onIconClick={() => {
            alert("icon click")
        }}
        error={value === "" ? "input error" : undefined}
        hint={`this input hint`}
        hintButton
        onHintClick={() => {
            alert("hint click")
        }}
        clickableIcon
        maxLength={255}
        info={"input info "}
        iconTitle={`Icon title stuff`}
        isRequired={true}
      />
    </div>
  );
};
  
export default TemporarDebugComponent;
