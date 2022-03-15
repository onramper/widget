import React from "react";
import { HeaderMenuProps } from "./HeaderMenu.models";
import classes from "./HeaderMenu.module.css";
import { ReactComponent as MenuCloseIcon } from "./../../../icons/menu-close.svg";

const HeaderMenu: React.FC<HeaderMenuProps> = (props) => {
  return (
    <nav className={`${classes["wrapper"]} ${props.className || ""}`}>
      <div itemProp="text" className={classes["text"]}>
        {props.title}
      </div>
      <button onClick={props.handleDismiss}>
        <MenuCloseIcon className={classes["close-icon"]} />
      </button>
    </nav>
  );
};

export default HeaderMenu;
