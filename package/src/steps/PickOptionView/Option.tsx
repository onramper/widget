import React from "react";

import checked from "./../../icons/checked.svg";
import styles from "./styles.module.css";

type OptionType = {
  index: number;
  title: string;
  selected?: boolean;
  description?: string;
  image?: string;
  onSelected: (index: number) => void;
  setSelectedIndex: (index: number) => void;
};

const Option: React.FC<OptionType> = ({
  title,
  description,
  image,
  selected = false,
  onSelected,
  setSelectedIndex,
  index,
}) => {
  return (
    <div
      className={`${styles.option} ${selected ? styles.selected : ""}`}
      onClick={() => {
        onSelected(index);
        setSelectedIndex(index);
      }}
    >
      {image && (
        <div className={styles["img-wrapper"]}>
          <img className={styles.img} src={image} />
        </div>
      )}

      <div className={styles["title-wrapper"]}>
        <div className={styles["title"]}>{title}</div>
        {description && (
          <div className={styles["description"]}>{description}</div>
        )}
      </div>
      {selected && (
        <div className={styles.checked}>
          <img src={checked} />
        </div>
      )}
    </div>
  );
};

export default Option;
