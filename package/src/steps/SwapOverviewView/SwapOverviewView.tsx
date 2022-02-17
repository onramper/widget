import React, { useState } from "react";
import { SwapOverviewViewProps } from "./SwapOverviewView.models";
import commonClasses from "../../styles.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import { NextStep } from "../../ApiContext";

const SwapOverviewView: React.FC<{
  nextStep: NextStep & { type: "transactionOverview" };
}> = ({ nextStep }) => {
  const steps = ["one", "two", "three", "four", "five"];
  const [progress, setProgress] = useState(0);

  const handleBack = () => {
    if (progress > 0) {
      setProgress(progress - 1);
    }
  };

  const handleForward = () => {
    if (progress < steps.length) {
      setProgress(progress + 1);
    }
  };

  return (
    <div className={commonClasses.view}>
      <ProgressHeader
        noSeparator
        useBackButton
        percentage={(100 / steps.length) * progress}
      />
      <main className={`${commonClasses.body}`}>SwapOverviewView</main>
    </div>
  );
};

export default SwapOverviewView;
