import React, { useContext } from "react";
import styles from "./styles.module.css";

import IconMenu from "../../icons/menu.svg";
import {ReactComponent as IconLeftArrow} from "../../icons/arrow-left.svg";
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
      className={`${styles.header} ${
        props.noSeparator ? styles["header--no-separator"] : ""
      } ${props.secondaryTitle ? styles["header--secondary"] : ""}`}
    >
      {backButton && (
        <IconLeftArrow 
          className={`${styles.header__child}`} 
          onClick={() => backScreen()}
        />
      )}
      <span
        className={`${styles.header__child} ${styles["header__child--title"]}`}
      >
        <h1>{title}</h1>
        {props.secondaryTitle && (
          <h1
            onClick={props.onSecondaryTitleClick}
            className={`${styles["header-title--secondary"]}`}
          >
            {props.secondaryTitle}
          </h1>
        )}
      </span>
      {!hideBurgerButton && (
        <img
          onClick={onMenuClick}
          alt="menu"
          className={`${styles.header__child} ${styles["header__burger-icon"]}`}
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
