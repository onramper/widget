import React, { useContext, useEffect, useState } from "react";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import PopupLauncherView from "./PopupView";
import Step from "../Step";
import { sentryHub, ApiError } from "../../ApiContext/api/index";
import { NextStep } from "../../ApiContext";
import { NavContext } from "../../NavContext";

import styles from "../../styles.module.css";
import { StepType } from "../../ApiContext/api/types/nextStep";

const PopupView: React.FC<{
  nextStep: NextStep & { type: StepType.popup };
}> = ({ nextStep }) => {
  const { replaceScreen, nextScreen } = useContext(NavContext);
  //const textInfo = 'Complete your payment. The form below is in a secure sandbox.'
  const [error, setError] = useState<string>();
  const [processFinished, setProcessFinished] = useState<boolean>(false);
  const [uploadFailed, setUploadFailed] = useState<boolean>(false);
  const [fatalError, setFatalError] = useState<string>();

  function reportError(message: string, fatal: boolean, eventData: any) {
    sentryHub.addBreadcrumb({
      message: `Recieved a ${
        fatal ? "fatal " : ""
      } error when interacting with an iframe`,
      data: eventData,
    });
    sentryHub.captureException(new ApiError(message));
    if (fatal) {
      setFatalError(message);
    } else {
      setError(message);
    }
  }

  useEffect(() => {
    const receiveMessage = async (event: MessageEvent) => {
      console.log("Received new event", event);
      console.log(event.origin);

      sentryHub.addBreadcrumb({
        message: `Received a postMessage from ${event.origin}`,
        data: event.data,
      });

      if (event.data.gateway === "Coinify") {
        const state = event.data.state;

        setProcessFinished(true);
        if (state === "submitted") {
          replaceScreen(<Step nextStep={nextStep.nextStep as NextStep} />);
        } else {
          setUploadFailed(true);
        }
      } else if (typeof event.data === "string") {
        reportError(event.data, false, event.data);
      } else {
        reportError(
          "Unknown error. Please, contact support@onramper.com and provide the following info: " +
            nextStep.url,
          false,
          event.data
        );
      }
    };
    window.addEventListener("message", receiveMessage);
    return () => window.removeEventListener("message", receiveMessage);
  }, [
    replaceScreen,
    nextStep.nextStep,
    nextStep.type,
    nextStep.url,
    nextScreen,
  ]);

  return (
    <div className={styles.view}>
      <ProgressHeader
        title={nextStep.humanName ?? "Complete payment"}
        useBackButton
      />
      <PopupLauncherView
        textInfo={"" /*nextStep.message*/}
        error={error}
        fatalError={fatalError}
        features={
          nextStep.neededFeatures !== null ? nextStep.neededFeatures : undefined
        }
        src={nextStep.url}
        type={nextStep.type}
        failStep={nextStep.failStep}
        onErrorDismissClick={(type) =>
          type === "FATAL" ? setFatalError(undefined) : setError(undefined)
        }
        nextStep={nextStep}
        uploadFailed={uploadFailed}
        processFinished={processFinished}
      />
    </div>
  );
};

export default PopupView;
