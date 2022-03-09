import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Step from "../Step";
import { NextStep } from "../../ApiContext";
import { NavContext } from "../../NavContext";
import Heading from "../../common/Heading/Heading";
import OptionsView from "./OptionsView";
import ButtonAction from "../../common/ButtonAction";
import Footer from "../../common/Footer";

import commonStyles from "../../styles.module.css";
import styles from "./styles.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";

const PickOptionView: React.FC<{
  nextStep: NextStep & { type: "pickOne" };
}> = ({ nextStep }) => {
  const { t } = useTranslation();
  const { nextScreen } = useContext(NavContext);

  const nextStepOptions = nextStep.options || [];

  const [selectedOption, setSelectedOption] = useState(nextStepOptions[0]);
  const [isFilled, setIsFilled] = useState(false);

  const handleButtonAction = async () => {
    nextScreen(<Step nextStep={selectedOption} />);
  };

  const handleOptionChange = (i: number) => {
    setSelectedOption(nextStepOptions[i]);
  };

  useEffect(() => {
    setIsFilled(selectedOption !== undefined);
  }, [selectedOption]);

  return (
    <div className={commonStyles.view}>
      <ProgressHeader percentage={nextStep.progress} useBackButton />
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
            text={t("button.continue")}
            disabled={!isFilled}
          />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PickOptionView;
