import styles from "../styles.module.css";
import React, { useState } from "react";
import ProgressHeader from "../common/Header/ProgressHeader/ProgressHeader";

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
      <button onClick={handleBack}>back</button>
      <button onClick={handleForward}>forward</button>
    </div>
  );
};

export default SwapCryptoView;
