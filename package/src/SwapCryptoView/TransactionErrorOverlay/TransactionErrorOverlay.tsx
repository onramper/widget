import React, { useCallback, useContext } from "react";
import { TransactionErrorOverlayProps } from "./TransactionErrorOverlay.models";
import commonClasses from "../../styles.module.css";
import classes from "./TransactionErrorOverlay.module.css";
import { ReactComponent as SettingsIcon } from "./../../icons/settings.svg";
import { ReactComponent as CloseIcon } from "./../../icons/settings.svg";
import { NavContext } from "../../NavContext";
import ButtonAction from "../../common/ButtonAction";

const TransactionErrorOverlay: React.FC<TransactionErrorOverlayProps> = (
  props
) => {
  const { backScreen } = useContext(NavContext);

  const onDismiss = useCallback(() => {
    backScreen();
  }, [backScreen]);

  return (
    <div className={`${commonClasses.view} ${classes["view"]}`}>
      <nav>
        <div> Failed </div>
        <CloseIcon className={classes["close-icon"]} />
      </nav>

      <main className={commonClasses.body}>
        <div className={classes["wrapper"]}>
          <div className={classes["settings-wrapper"]}>
            <SettingsIcon className={classes["setting-icon"]} />
          </div>
          
          <div className={classes["title"]}>Transaction Failed</div>
          <div className={classes["text-alert"]}>{props.textAlert}</div>
          <div className={classes["description"]}>{props.description}</div>

          <ButtonAction
            className={classes["dismiss-btn"]}
            onClick={onDismiss}
            text={"Dismiss"}
          />
        </div>
      </main>
    </div>
  );
};

export default TransactionErrorOverlay;
