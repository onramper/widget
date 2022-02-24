import React, { useContext } from "react";
import classes from "./styles.module.css";
import commonClasses from "../../styles.module.css";

import IconMenu from "../../icons/menu.svg";
import { ReactComponent as IconLeftArrow } from "../../icons/arrow-left.svg";
import IconClose from "../../icons/close-menu.svg";

import { NavContext } from "../../NavContext";
import Menu from "./Menu/Menu";

export type HeaderType = {
  title: string;
  secondaryTitle?: string;
  backButton?: boolean;
  hideBurgerButton?: boolean;
  noSeparator?: boolean;
  onMenuClick?: () => void;
  onSecondaryTitleClick?: () => void;
};

const Header: React.FC<HeaderType> = (props) => {
  const { nextScreen, backScreen } = useContext(NavContext);
  const {
    title,
    backButton,
    hideBurgerButton,
    onMenuClick = () => nextScreen(<Menu />),
  } = props;

  return (
    <nav
      className={`${classes.header} ${
        props.noSeparator ? classes["header--no-separator"] : ""
      } ${props.secondaryTitle ? classes["header--secondary"] : ""}`}
    >
      {backButton && (
        <IconLeftArrow
          className={`${classes.header__child} ${commonClasses["cursor-pointer"]}`}
          onClick={() => backScreen()}
        />
      )}
      <span
        className={`${classes.header__child} ${classes["header__child--title"]}`}
      >
        <h1>{title}</h1>
        {props.secondaryTitle && (
          <h1
            onClick={props.onSecondaryTitleClick}
            className={`${classes["header-title--secondary"]}`}
          >
            {props.secondaryTitle}
          </h1>
        )}
      </span>
      {!hideBurgerButton && (
        <img
          onClick={onMenuClick}
          alt="menu"
          className={`${classes.header__child} ${classes["header__burger-icon"]}`}
          src={title === "Menu" ? IconClose : IconMenu}
        />
      )}
    </nav>
  );
};

Header.defaultProps = {
  backButton: false,
};

export default Header;
