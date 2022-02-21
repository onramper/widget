import React, { useCallback, useContext, useState } from "react";
import { APIContext } from "../../ApiContext";
import ErrorView from "../../common/ErrorView";
import { NavContext } from "../../NavContext";
import Step from "../Step";
import { ConfrimSwapViewProps } from "./ConfrimSwapView.models";
import commonClasses from "../../styles.module.css";
import inputClasses from "../../common/InputDropdown/InputDropdown.module.css";
import classes from "./ConfrimSwapView.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import Footer from "../../common/Footer";
import ButtonAction from "../../common/Buttons/ButtonAction";
import Heading from "../../common/Heading/Heading";
import InputDropdown from "../../common/InputDropdown/InputDropdown";

const ConfrimSwapView: React.FC<ConfrimSwapViewProps> = ({ nextStep }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [inputs] = useState(nextStep.inputs);

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
        <Heading
          text={nextStep.heading}
          textSubHeading={nextStep.description}
        />

        {/* TODO: remove this and add actual error component */}
        {errorMessage && errorMessage}

        {inputs.map((item, index) => (
          <InputDropdown
            key={index}
            label={item.label}
            value={item.value}
            // TODO: ADD onchange
            onChange={() => {}}
            className={inputClasses["swap-screen"]}
            hint={item.balance === undefined ? undefined : `Balance: ${item.balance}`}
            // TODO: ADD max handler
            onMaxClick={item.hasMax ? () => {} : undefined}
            suffix={`(${item.fiatSymbol}${item.fiatConversion})`}
            handleProps={{
              icon: item.icon,
              value: item.currencyName,
              disabled: true,
            }}
            useEditIcon={true}
            readonly={item.readonly}
          />
        ))}

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
