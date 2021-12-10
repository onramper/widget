import React from "react";
import Header from "../../common/Header";
import BodySuccessView from "./BodyActionableErrorView";
import styles from "../../styles.module.css";
import { NextStep, NextStepError } from "../../ApiContext";
import { APIContext } from "../../ApiContext";
import { EVENTS, emit } from "../../Onramper";
import BodyActionableErrorView from "./BodyActionableErrorView";

type ActionableErrorProps = {
  nextStep: Partial<NextStep> & { type: "actionable-error" };
};

const ActionableErrorView: React.FC<ActionableErrorProps> = (props) => {
  const { collected } = React.useContext(APIContext);


  return (
    <div className={styles.view}>
      <Header
        title={
          props.nextStep.humanName ?? ""
        }
        backButton={false}
      />
      {(
        <BodyActionableErrorView
          title = {props.nextStep.title}
          message = {props.nextStep.message}
          fatal = {props.nextStep.fatal}
          step = {props.nextStep.nextStep}
          optionalUrl = {props.nextStep.optionalUrl}
        />
      )}
    </div>
  );
};

export default ActionableErrorView;
