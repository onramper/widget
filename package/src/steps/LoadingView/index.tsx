import React from "react";
import BodyLoading from "./BodyLoading";
import { NextStep, StepType } from "../../ApiContext/api/types/nextStep";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";

import styles from "../../styles.module.css";

const LoadingView: React.FC<{
  nextStep: NextStep & { type: StepType.completed };
}> = () =>
  /*  props */
  {
    return (
      <div className={styles.view}>
        <ProgressHeader title={`Completing verification`} useBackButton />
        <BodyLoading />
      </div>
    );
  };

export default LoadingView;
