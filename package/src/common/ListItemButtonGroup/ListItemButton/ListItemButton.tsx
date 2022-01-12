import React, { useState } from "react";
import {
  ListItemButtonChildProps,
  ListItemButtonProps,
} from "./ListItemButton.models";
import classes from "./ListItemButton.module.css";
import commonClasses from "./../../../styles.module.css";
import { ListItemType } from "../ListItemButtonGroup.models";
import { ReactComponent as CheckvronUp } from "./../../../icons/chevron-up.svg";


const ListItem: React.FC<ListItemButtonChildProps> = (props) => {
  return (
    <li
      onClick={props.onClick}
      className={`${classes["list-item"]} ${
        props.link ? commonClasses["cursor-pointer"] : ""
      } ${props.className || ""}`}
    >
      <div className={`${commonClasses["flex-all"]} ${classes["list-icon"]}`}>
        <img src={props.icon} />
      </div>

      <div className={`${classes["list-text"]} ${commonClasses["clickable-txt"]}`}>
        {!props.link && <>{props.text}</>}
        {!!props.link && (
          <a
            href={props.link}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noreferrer"
          >
            {props.text}
          </a>
        )}
      </div>

      {props.hasChildren && (
        <CheckvronUp
          className={`${classes["chevron-toggle"]} ${
            !props.childrenVisible ? classes["down"] : ""
          }`}
        />
      )}
    </li>
  );
};

const ListItemButton: React.FC<ListItemButtonProps> = (props) => {
  const [childrenVisible, setChildrenVisible] = useState(false);

  const onClickItem = (item: ListItemType) => {
    if (props.parent.items && item.id === props.parent.id) {
      setChildrenVisible(!childrenVisible);
      return;
    }
    props.onClick(item);
  };

  return (
    <>
      <ListItem
        id={props.parent.id}
        icon={props.parent.icon}
        text={props.parent.text}
        link={props.parent.link}
        childrenVisible={childrenVisible}
        onClick={() => onClickItem(props.parent)}
        hasChildren={!!props.parent.items}
      />

      {!!props.parent.items && childrenVisible && (
        <>
          {props.parent.items.map((item) => (
            <ListItem
              className={classes["child"]}
              id={item.id}
              key={item.id}
              link={item.link}
              onClick={() => props.onClick(item)}
              icon={item.icon}
              text={item.text}
            />
          ))}
        </>
      )}
    </>
  );
};

export default ListItemButton;
