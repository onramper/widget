import React, { useContext, useState } from "react";
import Step from "../Step";
import { APIContext, NextStep } from "../../ApiContext";
import { NavContext } from "../../NavContext";
import ButtonAction from "../../common/ButtonAction";
import Footer from "../../common/Footer";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import ErrorView from "../../common/ErrorView";

import commonStyles from "../../styles.module.css";
import InstructionBody from "./InstructionBody";

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
        const newNextStep = await apiInterface.executeStep(nextStep, {});
        nextScreen(<Step nextStep={newNextStep} />);
      } catch (_error) {
        const error = _error as { fatal: any; message: string };
        if (error.fatal) {
          nextScreen(<ErrorView />);
        }
      }
    }
  };

  return (
    <div className={commonStyles.view}>
      <ProgressHeader percentage={nextStep.progress} useBackButton />
      <div className={commonStyles.body}>
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
