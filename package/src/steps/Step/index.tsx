import React from "react";
import StepViewContent, { NewStepProps } from "./StepViewContent";
import styles from "../../styles.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";

const StepView: React.FC<NewStepProps> = (props) => {
  return (
    <div className={styles.view}>
      <ProgressHeader title="" useBackButton />
      <StepViewContent {...props} />
    </div>
  );
};

export default StepView;
