import React, { useCallback, useContext, useState } from "react";
import { APIContext } from "../../ApiContext";
import ErrorView from "../../common/ErrorView";
import { NavContext } from "../../NavContext";
import Step from "../Step";
import { ConfrimSwapViewProps } from "./ConfrimSwapView.models";
import commonClasses from "../../styles.module.css";
import classes from "./ConfrimSwapView.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import Footer from "../../common/Footer";
import ButtonAction from "../../common/Buttons/ButtonAction";
import Heading from "../../common/Heading/Heading";

const ConfrimSwapView: React.FC<ConfrimSwapViewProps> = ({ nextStep }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const { nextScreen } = useContext(NavContext);
  const { apiInterface } = useContext(APIContext);

  const onActionButton = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const newNextStep = await apiInterface.executeStep(nextStep, {});
      nextScreen(<Step nextStep={newNextStep} />);
    } catch (_error) {
      const error = _error as { fatal: any; message: string };
      if (error.fatal) {
        nextScreen(<ErrorView />);
        return;
      }
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  }, [apiInterface, nextScreen, nextStep]);

  const isFilled = true;

  return (
    <div className={commonClasses.view}>
      <ProgressHeader percentage={nextStep.progress} useBackButton />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <Heading text={nextStep.heading} textSubHeading={nextStep.description} />
        
        {errorMessage && errorMessage}

        <div
          className={`${commonClasses["body-form-child"]} ${commonClasses["grow-col"]}`}
        >
          <ButtonAction
            onClick={onActionButton}
            text={isLoading ? "Sending..." : "Continue"}
            disabled={!isFilled || isLoading}
          />
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default ConfrimSwapView;
