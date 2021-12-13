import React from "react";
import styles from "./List.module.css";
import { ListItemProps } from "./List.models";

const ListItem: React.FC<ListItemProps> = (props: ListItemProps) => {
  return (
    <li
      className={`${props.isSelected ? styles["selected"] : ""}`}
      onClick={() => props.onClick(props.index)}
    >
      {props.icon && (<img
          alt="Icon"
          className={styles["list-item__icon"]}
          src={props.icon}
        />
      )}
      
      <div className={styles["list-item__child"]}>
        <div className={styles["list-item__name"]}> {props.name} </div>
        {props.info && (<div className={`${styles["list-item__info"]}`}> {props.info} </div>)}
      </div>

      {props.rightSection && <> {props.rightSection} </>}
    </li>
  );
};

export default ListItem;
