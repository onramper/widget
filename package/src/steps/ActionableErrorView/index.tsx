import React from "react";
import { NextStep } from "../../ApiContext";
import BodyActionableErrorView from "./BodyActionableErrorView";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";

import styles from "../../styles.module.css";

type ActionableErrorProps = {
  nextStep: Partial<NextStep> & { type: "actionable-error" };
};

const ActionableErrorView: React.FC<ActionableErrorProps> = (props) => {
  return (
    <div className={styles.view}>
      <ProgressHeader title={props.nextStep.humanName ?? ""} />
      <BodyActionableErrorView
        title={props.nextStep.title}
        message={props.nextStep.message}
        fatal={props.nextStep.fatal}
        step={props.nextStep.nextStep}
        optionalUrl={props.nextStep.optionalUrl}
      />
    </div>
  );
};

export default ActionableErrorView;
