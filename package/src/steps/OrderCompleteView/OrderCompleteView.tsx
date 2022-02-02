import React, { useCallback, useContext } from "react";
import { APIContext, NextStep } from "../../ApiContext";
import BuyCryptoView from "../../BuyCryptoView";
import { NavContext } from "../../NavContext";
import classes from "./OrderCompleteView.module.css";
import commonClasses from "./../../styles.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import ButtonAction from "../../common/ButtonAction";
import Footer from "../../common/Footer";

const OrderCompleteView: React.FC<{
  nextStep: NextStep & { type: "orderComplete" };
}> = () => {
  const { collected } = useContext(APIContext);
  const { onlyScreen } = useContext(NavContext);

  const navigateHome = useCallback(() => {
    if (collected.redirectURL) {
      window.open(collected.redirectURL, "_parent");
      return;
    }
    onlyScreen(<BuyCryptoView />);
  }, [collected.redirectURL, onlyScreen]);

  return (
    <div className={`${commonClasses.view} ${classes["view"]}`}>
      <ProgressHeader useBackButton primary noSeparator />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <h2>Complete screen</h2>
        <ButtonAction onClick={navigateHome} text={"Buy more crypto"} />
      </main>
    </div>
  );
};

export default OrderCompleteView;
