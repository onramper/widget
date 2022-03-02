import React, { useContext } from "react";
import classes from "./OrderCompleteView.module.css";
import commonClasses from "./../../styles.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import Lottie from "lottie-react";
import successAnimation from "../../icons/animations/success.json";
import ButtonSecondary from "../../common/Buttons/ButtonSecondary";
import { APIContext } from "../../ApiContext";
import { useNav } from "../../NavContext";
import BuyCryptoView from "../../BuyCryptoView";

const OrderCompleteView: React.FC<{
  description: string;
  title: string;
}> = (props) => {
  const { collected } = useContext(APIContext);
  const { onlyScreen } = useNav();

  return (
    <div className={`${commonClasses.view} ${classes["view"]}`}>
      <ProgressHeader primary noSeparator />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <div className={classes["checkmark-wrapper"]}>
          <Lottie
            loop={false}
            animationData={successAnimation}
          />
        </div>
        <h1 className={commonClasses["remove-default"]}> {props.title} </h1>
        <h2 className={commonClasses["remove-default"]}>{props.description}</h2>

        <div className={classes["bottom-section"]}>
          <ButtonSecondary
            onClick={
              collected.redirectURL
                ? () => window.open(collected.redirectURL, "_parent")
                : () => onlyScreen(<BuyCryptoView />)
            }
            primary
            text="Dismiss"
          />
        </div>
      </main>
    </div>
  );
};

export default OrderCompleteView;
