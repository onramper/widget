import React from "react";
import { TabGroupProps } from "./TabGroup.models";
import styles from "./TabGroup.module.css";

const TabGroup: React.FC<TabGroupProps> = (
  props: TabGroupProps
) => {
  return (
    <div className={styles.wrapper}>
      {props.items.map((label: string, i: number) => (
        <div onClick={() => props.onClickItem(i)} key={i} className={`${styles["option-wrapper"]} ${i === props.indexSelected ? styles.selected : ""}`}>
          {label}
        </div>
      ))}
    </div>
  );
};
export default TabGroup;
