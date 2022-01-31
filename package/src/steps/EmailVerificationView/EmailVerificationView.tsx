import React, { useCallback, useContext, useState } from "react";
import { APIContext, NextStep } from "../../ApiContext";
import classes from "./EmailVerificationView.module.css";
import commonClasses from "./../../styles.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import logo from "../../icons/onramper-logo.png";
import Footer from "../../common/Footer";
import ButtonAction from "../../common/ButtonAction";
import ErrorView from "../../common/ErrorView";
import Step from "../Step";
import { NavContext } from "../../NavContext";
import InputDelegator from "../../common/Input/InputDelegator";

const EmailVerificationView: React.FC<{
  nextStep: NextStep & { type: "emailVerification" };
}> = ({ nextStep }) => {
  const [field] = useState(nextStep.data);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const { nextScreen } = useContext(NavContext);
  const { apiInterface, inputInterface, collected } = useContext(APIContext);

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

  const onChange = useCallback(
    (name: string, value: any) => {
      inputInterface.handleInputChange(name, value);
    },
    [inputInterface]
  );

  const value = collected[field.name] ?? "";
  const isFilled = !!value;

  return (
    <div className={commonClasses.view}>
      <ProgressHeader percentage={nextStep.progress} useBackButton />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <div className={classes["logo-wrapper"]}>
          <img src={logo} />
        </div>
        
        <h1 className={commonClasses["remove-default"]}>{nextStep.title}</h1>
        <h2 className={commonClasses["remove-default"]}>
          {nextStep.description}
        </h2>

        <InputDelegator
          hint={field.hint}
          error={errorMessage}
          name="email"
          value={value}
          onChange={onChange}
          className={commonClasses["body-form-child"]}
          label={field.humanName}
          type="text"
          placeholder={field.placeholder}
        />

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

export default EmailVerificationView;
