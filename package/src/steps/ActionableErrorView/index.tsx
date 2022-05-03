import React from "react";
import Header from "../../common/Header";
import styles from "../../styles.module.css";
import { NextStep } from "../../ApiContext";
import BodyActionableErrorView from "./BodyActionableErrorView";

type ActionableErrorProps = {
  nextStep: Partial<NextStep> & { type: "actionable-error" };
};

const ActionableErrorView: React.FC<ActionableErrorProps> = (props) => {
  return (
    <div className={styles.view}>
      <Header title={props.nextStep.humanName ?? ""} backButton={false} />
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
