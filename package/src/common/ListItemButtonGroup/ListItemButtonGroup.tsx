import React from "react";
import ListItemButton from "./ListItemButton/ListItemButton";
import {
  ListItemButtonGroupProps,
  ListItemType,
} from "./ListItemButtonGroup.models";
import classes from "./ListItemButtonGroup.module.css";

const ListItemButtonGroup: React.FC<ListItemButtonGroupProps> = (props) => {
  console.log(props.items);
  const onClick = (item: ListItemType) => {
    props.onClick?.(item);
    if (item.link) {
      props.onClick?.(item);
      window.open(item.link);
    }
  };

  return (
    <div className={`${classes["wrapper"]} ${props.className || ""}`}>
      {props.items.map((item) => (
        <ListItemButton key={item.id} parent={item} onClick={onClick} />
      ))}
    </div>
  );
};

export default ListItemButtonGroup;
