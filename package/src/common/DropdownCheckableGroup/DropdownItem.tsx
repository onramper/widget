import React, { useRef } from "react";
import { ListItem } from "./DropdownCheckableGroup.models";
import commonClasses from "../../styles.module.css";
import classes from "./DropdownCheckableGroup.module.css";
import { ReactComponent as CheckMarkIcon } from "../../icons/checkmark.svg";
import { CSSTransition } from "react-transition-group";
import TextEllipsis from "../TextEllipsis/TextEllipsis";

const DropdownItem: React.FC<
  ListItem & {
    onClick?: () => void;
    isChecked?: boolean;
    iconRight?: React.ReactNode;
    isCheckHidden?: boolean;
  }
> = (props) => {
  return (
    <div
      className={`${classes["item"]} ${commonClasses["cursor-pointer"]}`}
      onClick={() => props.onClick && props.onClick()}
    >
      <ItemCheck
        isCheckHidden={!!props.isCheckHidden}
        isChecked={!!props.isChecked}
      />

      <div className={classes["item-content"]}>
        <div className={classes["icon-wrapper"]}>
          {props.icon && <img src={props.icon} alt="icon" />}
          {!props.icon && <div className={classes["default-item-icon"]}></div>}
        </div>
        <div className={classes["item-title"]}>{props.title}</div>
        <TextEllipsis text={props.info || ""} className={classes["info"]} />
      </div>

      {!!props.iconRight && props.iconRight}
    </div>
  );
};

const ItemCheck: React.FC<{ isCheckHidden: boolean; isChecked: boolean }> = (
  props
) => {
  const iconWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      nodeRef={iconWrapperRef}
      in={!props.isCheckHidden}
      timeout={200}
      classNames={{
        enter: classes["h-collapse-enter"],
        enterActive: classes["h-collapse-enter-active"],
        exit: classes["h-collapse-exit"],
        exitActive: classes["h-collapse-exit-active"],
      }}
      unmountOnExit={true}
    >
      <div
        ref={iconWrapperRef}
        className={`${classes["item-check-wrapper"]} ${
          props.isChecked ? classes["checked"] : ""
        }`}
      >
        <CheckMarkIcon className={classes["item-check"]} />
      </div>
    </CSSTransition>
  );
};

export default DropdownItem;
