import React from "react";
import { NextStep } from "../../ApiContext";
import classes from "./OrderCompleteView.module.css";
import commonClasses from "./../../styles.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import { ReactComponent as CheckmarkSuccessIcon } from "../../icons/checkmark-success.svg";

const OrderCompleteView: React.FC<{
  nextStep: NextStep & { type: "orderComplete" };
}> = ({ nextStep }) => {
  return (
    <div className={`${commonClasses.view} ${classes["view"]}`}>
      <ProgressHeader
        useBackButton={!nextStep.initialStep}
        primary
        noSeparator
      />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <div className={classes["checkmark-wrapper"]}>
          <CheckmarkSuccessIcon />
        </div>
        <h1 className={commonClasses["remove-default"]}> {nextStep.title} </h1>
        <h2 className={commonClasses["remove-default"]}>
          {nextStep.description}
        </h2>
      </main>
    </div>
  );
};

export default OrderCompleteView;
