import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { APIContext } from "../ApiContext";
import { BASE_API } from "../ApiContext/api/constants";
import ErrorView from "../common/ErrorView";
import { NavContext } from "../NavContext";
import Step from "../steps/Step";
import LogoOnramper from "../icons/onramper_logo_icon.svg";

import styles from "./styles.module.css";

const DynamicLandingPageView: React.FC = () => {
  const [errorOccurred, setErrorOccurred] = useState(false);
  const { gateway, step, token, session } = useParams();
  const {
    apiInterface,
    inputInterface: { handleBulkInputChange },
  } = useContext(APIContext);
  const { nextScreen } = useContext(NavContext);

  const getNextStepUrl = (gateway: string, step: string, token: string) => {
    return `${BASE_API}/transaction/${gateway}/${step}/${token}`;
  };

  const routeToStep = useCallback(async () => {
    setErrorOccurred(false);
    if (gateway && step && token && session) {
      try {
        const sessionData = await apiInterface.getSessionData(session);
        if (sessionData) {
          handleBulkInputChange(JSON.parse(sessionData.sessionData));
          const newNextStep = await apiInterface.executeStep(
            getNextStepUrl(gateway, step, token),
            undefined,
            {}
          );

          newNextStep.initialStep = true;
          nextScreen(<Step nextStep={newNextStep} />);
        } else {
          throw new Error("Cannot find any user inputs");
        }
      } catch (_error) {
        setErrorOccurred(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    routeToStep();
  }, [routeToStep]);

  return (
    <>
      {errorOccurred ? (
        <div className={styles.errorWrapper}>
          <ErrorView type="API" callback={routeToStep} />
        </div>
      ) : (
        <div className={styles.loadingWrapper}>
          <img src={LogoOnramper} />
          <div className={styles.message}>Loading...</div>
        </div>
      )}
    </>
  );
};

export default DynamicLandingPageView;
