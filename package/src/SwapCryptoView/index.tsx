import styles from "../styles.module.css";
import React, { useState } from "react";
import ProgressHeader from "../common/Header/ProgressHeader/ProgressHeader";
import SwapOverviewView from "../steps/SwapOverviewView/SwapOverviewView";
import transactionOverview from "../../../iframe/src/mocks/responses/steps/TestGateway/steps";

const SwapCryptoView = () => {
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
    <div className={styles.view}>
      <ProgressHeader
        noSeparator
        useBackButton
        percentage={(100 / steps.length) * progress}
      />
      <SwapOverviewView nextStep={transactionOverview} />
    </div>
  );
};

export default SwapCryptoView;
