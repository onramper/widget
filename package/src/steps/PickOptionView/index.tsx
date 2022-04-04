import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Step from "../Step";
import { APIContext, NextStep } from "../../ApiContext";
import { NavContext } from "../../NavContext";
import Heading from "../../common/Heading/Heading";
import OptionsView from "./OptionsView";
import ButtonAction from "../../common/ButtonAction";
import Footer from "../../common/Footer";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import ErrorView from "../../common/ErrorView";

import commonStyles from "../../styles.module.css";
import styles from "./styles.module.css";

const PickOptionView: React.FC<{
  nextStep: NextStep & { type: "pickOne" };
}> = ({ nextStep }) => {
  const { t } = useTranslation();
  const { nextScreen } = useContext(NavContext);
  const { apiInterface } = useContext(APIContext);

  const nextStepOptions = nextStep.options || [];

  const [selectedOption, setSelectedOption] = useState(nextStepOptions[0]);
  const [isFilled, setIsFilled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonAction = async () => {
    setIsLoading(true);
    try {
      const newNextStep = await apiInterface.executeStep(
        selectedOption.url,
        selectedOption.type,
        {}
      );
      nextScreen(<Step nextStep={newNextStep} />);
    } catch (_error) {
      const error = _error as { fatal: any; message: string };
      if (error.fatal) {
        nextScreen(<ErrorView />);
      }
    }
  };

  const handleOptionChange = (i: number) => {
    setSelectedOption(nextStepOptions[i]);
  };

  useEffect(() => {
    setIsFilled(selectedOption !== undefined);
  }, [selectedOption]);

  return (
    <div className={commonStyles.view}>
      <ProgressHeader percentage={nextStep.progress} useBackButton={!nextStep.initialStep} />
      <div className={commonStyles.body}>
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
            text={nextStep.buttonActionTitle || t("button.continue")}
            disabled={!isFilled && isLoading}
          />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PickOptionView;
