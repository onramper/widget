import React, { useContext } from "react";
import { NavContext } from "../../../NavContext";
import Menu from "../Menu/Menu";
import { ProgressHeaderProps } from "./ProgressHeader.models";
import classes from "./ProgressHeader.module.css";
import headerClasses from "../Header.module.css";
import iconMenu from "../../../icons/menu-var-2.svg";
import iconLeftArrow from "../../../icons/arrow-left.svg";

const ProgressHeader: React.FC<ProgressHeaderProps> = (props) => {
  const { nextScreen, backScreen } = useContext(NavContext);
  const { onMenuClick = () => nextScreen(<Menu className={headerClasses["header-menu"]}/>) } = props;

  return (
    <nav className={classes["header"]}>
      {props.useBackButton && (
        <img
          src={iconLeftArrow}
          onClick={() => backScreen()}
          className={classes["arrow-back"]}
          alt="back"
        />
      )}

      <div className={`${classes["middle-content"]} ${classes["header-text"]}`}>
        {props.title || ""}
      </div>
      <div className={classes["header-burger-icon"]}>
        <img
          onClick={onMenuClick}
          alt="menu"
          className={`${headerClasses["header-burger-icon"]}`}
          src={iconMenu}
        />
      </div>

      <div
        className={classes["progress-bar"]}
        style={{ width: `${props.percentage}%` }}
      ></div>
    </nav>
  );
};

export default ProgressHeader;