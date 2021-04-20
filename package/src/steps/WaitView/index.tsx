import React, { useContext, useEffect, useState } from "react";
import Header from "../../common/Header";
import BodyLoading from "./BodyLoading";
import styles from "../../styles.module.css";

import { NavContext } from "../../NavContext";
import { APIContext } from "../../ApiContext";
import { delay } from "../utils";
import { NextStep } from "../../ApiContext/api/types/nextStep";
import Step from "../Step";
import ErrorView from "../../common/ErrorView";

const LoadingView: React.FC<{ nextStep: NextStep & { type: "wait" } }> = (
  props
) => {
  const { nextScreen, backScreen, replaceScreen } = useContext(NavContext);
  const { apiInterface, inputInterface, collected } = useContext(APIContext);
  const { executeStep } = apiInterface;
  const [error, setError] = useState("");

  useEffect(() => {
    const callback = async () => {
      let newNextStep: NextStep = props.nextStep;
      let failed = false;
      while (newNextStep.type === "wait" && !failed) {
        try {
          await delay(100);
          const payload = { partnerContext: collected.partnerContext };
          newNextStep = await executeStep(newNextStep, payload);
          inputInterface.handleInputChange("isPartnerContextSent", true);
        } catch (error) {
          failed = true;
          if (error.fatal) nextScreen(<ErrorView message={error.message} />);
          else
            setError(
              error.message ??
                "Couldn't process your information, please, try again."
            );
          break;
        }
      }
      if (!failed) replaceScreen(<Step nextStep={newNextStep} />);
    };
    callback();
  }, [executeStep, props.nextStep, backScreen, nextScreen, replaceScreen]);

  return (
    <div className={styles.view}>
      <Header title="" backButton />
      <BodyLoading error={error} />
    </div>
  );
};

export default LoadingView;
