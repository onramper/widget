import React, { useContext } from "react";
import { NavContext } from "../../../NavContext";
import Menu from "../Menu/Menu";
import { ProgressHeaderProps } from "./ProgressHeader.models";
import classes from "./ProgressHeader.module.css";
import headerClasses from "../Header.module.css";
import { ReactComponent as IconMenu } from "../../../icons/menu-var-2.svg";
import { ReactComponent as ArrowLeftIcon } from "../../../icons/arrow-left.svg";
import { ReactComponent as CloseMenu } from "../../../icons/menu-close.svg";

const ProgressHeader: React.FC<ProgressHeaderProps> = (props) => {
  const { nextScreen, backScreen } = useContext(NavContext);
  const {
    onMenuClick = () =>
      nextScreen(<Menu className={headerClasses["header-menu"]} />),
  } = props;

  const handleBackClick = () => {
    props?.onBackClick && props?.onBackClick();
    backScreen();
  };

  return (
    <nav
      className={`${classes["default"]} ${
        props.primary ? classes.primary : ""
      } ${classes["header"]}`}
      style={props.noSeparator ? { border: "none" } : undefined}
    >
      {props.useExitButton && props.onExitClick && (
        <button onClick={props.onExitClick}>
          <CloseMenu className={classes["header-burger-icon"]} />
        </button>
      )}
      {props.useBackButton && (
        <ArrowLeftIcon
          className={classes["arrow-back"]}
          onClick={handleBackClick}
        />
      )}

      <div className={`${classes["middle-content"]} ${classes["header-text"]}`}>
        {props.title || ""}
      </div>

      <div
        className={headerClasses["header-icon-container"]}
        style={!props.hideBurgerButton ? undefined : { visibility: "hidden" }}
      >
        <IconMenu
          className={classes["header-burger-icon"]}
          onClick={props.hideBurgerButton ? undefined : onMenuClick}
        />
      </div>

      {props.noSeparator && (
        <div
          className={classes["progress-bar"]}
          style={{ width: `${props.percentage || 0}%` }}
        ></div>
      )}
    </nav>
  );
};

export default ProgressHeader;
