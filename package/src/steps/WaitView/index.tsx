import React, { useContext, useEffect } from "react";
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
  const { apiInterface } = useContext(APIContext);
  const { executeStep } = apiInterface;

  useEffect(() => {
    const callback = async () => {
      let newNextStep: NextStep = props.nextStep;
      while (newNextStep.type === "wait") {
        try {
          await delay(100);
          newNextStep = await executeStep(newNextStep, {});
        } catch (error) {
          if (error.fatal) nextScreen(<ErrorView />);
          else backScreen();
          break;
        }
      }
      replaceScreen(<Step nextStep={newNextStep} />);
    };
    callback();
  }, [executeStep, props.nextStep, backScreen, nextScreen, replaceScreen]);

  return (
    <div className={styles.view}>
      <Header title="" backButton />
      <BodyLoading />
    </div>
  );
};

export default LoadingView;
