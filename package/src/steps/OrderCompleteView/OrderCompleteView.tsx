import React from "react";
import classes from "./OrderCompleteView.module.css";
import commonClasses from "./../../styles.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import { ReactComponent as CheckmarkSuccessIcon } from "../../icons/checkmark-success.svg";
import ButtonSecondary from "../../common/Buttons/ButtonSecondary";

const OrderCompleteView: React.FC<{
  description: string;
  title: string;
}> = (props) => {
  return (
    <div className={`${commonClasses.view} ${classes["view"]}`}>
      <ProgressHeader useBackButton primary noSeparator />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <div className={classes["checkmark-wrapper"]}>
          <CheckmarkSuccessIcon />
        </div>
        <h1 className={commonClasses["remove-default"]}> {props.title} </h1>
        <h2 className={commonClasses["remove-default"]}>{props.description}</h2>
        <ButtonSecondary className={classes["button"]} text="Dismiss" />
      </main>
    </div>
  );
};

export default OrderCompleteView;
