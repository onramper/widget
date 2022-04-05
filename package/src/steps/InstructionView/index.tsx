import React, { useContext, useState } from "react";
import Step from "../Step";
import { APIContext, NextStep } from "../../ApiContext";
import { NavContext } from "../../NavContext";
import ButtonAction from "../../common/ButtonAction";
import Footer from "../../common/Footer";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import ErrorView from "../../common/ErrorView";
import InstructionBody from "./InstructionBody";

import commonStyles from "../../styles.module.css";
import styles from "./styles.module.css";

const PickOptionView: React.FC<{
  nextStep: NextStep & { type: "instruction" };
}> = ({ nextStep }) => {
  const { nextScreen } = useContext(NavContext);
  const { apiInterface } = useContext(APIContext);

  const [isLoading, setIsLoading] = useState(false);

  const handleButtonAction = async () => {
    if (nextStep.url) {
      setIsLoading(true);
      try {
        const newNextStep = await apiInterface.executeStep(
          nextStep.url,
          nextStep.type,
          {}
        );
        nextScreen(<Step nextStep={newNextStep} />);
      } catch (_error) {
        const error = _error as { fatal: any; message: string };
        if (error.fatal) {
          nextScreen(<ErrorView />);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={commonStyles.view}>
      <ProgressHeader
        percentage={nextStep.progress}
        useBackButton={!nextStep.initialStep}
      />
      <div className={`${commonStyles.body} ${styles["body-wrapper"]}`}>
        <InstructionBody sections={nextStep.sections} />
        <div
          className={`${commonStyles.body__child} ${commonStyles["grow-col"]}`}
        >
          <ButtonAction
            onClick={handleButtonAction}
            text={nextStep.buttonActionTitle}
            disabled={isLoading}
          />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PickOptionView;
