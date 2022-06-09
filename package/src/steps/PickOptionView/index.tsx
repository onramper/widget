import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Step from "../Step";
import { NextStep, PickOneOption } from "../../ApiContext";
import { NavContext } from "../../NavContext";
import Heading from "../../common/Heading/Heading";
import OptionsView from "./OptionsView";
import ButtonAction from "../../common/ButtonAction";
import Footer from "../../common/Footer";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import ErrorView from "../../common/ErrorView";

import commonStyles from "../../styles.module.css";
import styles from "./styles.module.css";
import InfoBox from "../../common/InfoBox";
import { StepType } from "../../ApiContext/api/types/nextStep";

const PickOptionView: React.FC<{
  nextStep: NextStep & { type: StepType.pickOne };
}> = ({ nextStep }) => {
  const { t } = useTranslation();
  const { nextScreen } = useContext(NavContext);

  const nextStepOptions = nextStep.options || [];

  const [selectedOption, setSelectedOption] = useState<PickOneOption | null>(
    null
  );
  const [isFilled, setIsFilled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>();

  const handleButtonAction = async () => {
    setErrorMsg(undefined);
    setIsLoading(true);
    try {
      if (selectedOption) {
        nextScreen(
          <Step
            gtmToBeRegisterStep={nextStep}
            nextStep={selectedOption.nextStep}
          />
        );
      }
    } catch (_error) {
      const error = _error as { fatal: any; message: string };
      if (error.fatal) {
        nextScreen(<ErrorView />);
      } else {
        setErrorMsg(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionChange = (i: number) => {
    setSelectedOption(nextStepOptions[i]);
  };

  useEffect(() => {
    setIsFilled(selectedOption !== null);
  }, [selectedOption]);

  return (
    <div className={commonStyles.view}>
      <ProgressHeader percentage={nextStep.progress} useBackButton />
      <div className={commonStyles.body}>
        {errorMsg && (
          <InfoBox
            type="error"
            in={!!errorMsg}
            className={`${commonStyles.body__child}`}
            canBeDismissed
            onDismissClick={() => setErrorMsg(undefined)}
            focus
          >
            {errorMsg}
          </InfoBox>
        )}
        <div className={styles["header-wrapper"]}>
          {nextStep.title && (
            <Heading text={nextStep.title} className={styles.heading} />
          )}

          {nextStep.description && (
            <Heading
              textSubHeading={nextStep.description}
              className={styles.heading}
            />
          )}
        </div>
        <OptionsView
          options={nextStepOptions}
          handleOptionChange={handleOptionChange}
        />
        <div
          className={`${commonStyles.body__child} ${commonStyles["grow-col"]}`}
        >
          <ButtonAction
            onClick={handleButtonAction}
            text={
              isLoading
                ? t("button.sending")
                : nextStep.buttonActionTitle || t("button.continue")
            }
            disabled={!isFilled || isLoading}
          />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PickOptionView;
