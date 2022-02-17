import React, { useCallback, useContext } from "react";
import { TransactionErrorOverlayProps } from "./TransactionErrorOverlay.models";
import commonClasses from "../../styles.module.css";
import classes from "./TransactionErrorOverlay.module.css";
import { ReactComponent as SettingsIcon } from "./../../icons/settings.svg";
import { NavContext } from "../../NavContext";
import ButtonAction from "../../common/ButtonAction";

const TransactionErrorOverlay: React.FC<TransactionErrorOverlayProps> = () => {
  const { backScreen } = useContext(NavContext);

  const onDismiss = useCallback(() => {
    backScreen();
  }, [backScreen]);

  return (
    <div className={`${commonClasses.view} ${classes["view"]}`}>
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <div className={`${classes["inner-wrapper"]}`}>
          <SettingsIcon className={classes["setting-icon"]} />
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
