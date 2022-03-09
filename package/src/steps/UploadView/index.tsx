import React, { useContext, useState } from "react";
import Header from "../../common/Header";
import BodyUpload from "./BodyUpload";
import styles from "../../styles.module.css";

import { NavContext } from "../../NavContext";
import { APIContext } from "../../ApiContext";

import { NextStep } from "../../ApiContext/api/types/nextStep";
import Step from "../Step";
import ErrorView from "../../common/ErrorView";

const UploadView: React.FC<{ nextStep: NextStep & { type: "file" } }> = (
  props
) => {
  const { nextScreen } = useContext(NavContext);
  /* const textInfo = `Attach your ${props.nextStep.humanName} here so we can verify your identity.` */

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>();
  const { apiInterface } = useContext(APIContext);

  const handleButtonAction = async (file: File) => {
    setIsLoading(true);
    setErrorMsg(undefined);

    try {
      const newNextStep = await apiInterface.executeStep(props.nextStep, file);
      nextScreen(<Step nextStep={newNextStep} />);
    } catch (_error) {
      const error = _error as { fatal: any; message: string };
      if (error.fatal) {
        nextScreen(<ErrorView />);
        return;
      } else {
        setErrorMsg(error.message);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.view}>
      <Header title={`Upload ${props.nextStep.humanName ?? ""}`} backButton />
      <BodyUpload
        onActionButton={handleButtonAction}
        textInfo={props.nextStep.description}
        isLoading={isLoading}
        errorMsg={errorMsg}
        acceptedContentTypes={props.nextStep.acceptedContentTypes}
      />
    </div>
  );
};

export default UploadView;
