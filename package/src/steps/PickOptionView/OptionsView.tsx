import React, { useState } from "react";
import { PickOneOption } from "../../ApiContext";
import Option from "./Option";

import styles from "./styles.module.css";

type OptionsType = {
  options: PickOneOption[];
  handleOptionChange: (index: number) => void;
};

const OptionsView: React.FC<OptionsType> = ({
  options,
  handleOptionChange,
}) => {
  const [selectecIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className={styles["option-wrapper"]}>
      {options.map((option, index) => (
        <Option
          index={index}
          key={index}
          selected={selectecIndex === index}
          title={option.title}
          description={option.description}
          icon={option.icon}
          onSelected={handleOptionChange}
          setSelectedIndex={setSelectedIndex}
        />
      ))}
    </div>
  );
};

export default OptionsView;
