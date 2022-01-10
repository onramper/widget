import React, { useContext, useEffect, useState } from "react";
import Header from "../../common/Header";
import BodyIframeView from "./BodyIframeView";
import styles from "../../styles.module.css";
/* import ErrorView from '../../common/ErrorView' */

import Step from "../Step";

import { sentryHub, ApiError } from "../../ApiContext/api/index";
import { NextStep } from "../../ApiContext";
import {
  finishCCTransaction,
  baseCreditCardSandboxUrl,
  checkTransaction,
} from "@onramper/moonpay-adapter";

import { NavContext } from "../../NavContext";
import { t } from "i18next";

const btcdirectFinishedOrigin = "https://btcdirect.sandbox.staging.onramper.tech";

const IframeView: React.FC<{
  nextStep: NextStep & { type: "iframe" | "redirect" };
}> = ({ nextStep }) => {
  const { replaceScreen, nextScreen } = useContext(NavContext);
  //const textInfo = 'Complete your payment. The form below is in a secure sandbox.'
  const [error, setError] = useState<string>();
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
      if (![baseCreditCardSandboxUrl, btcdirectFinishedOrigin, event.origin].includes(event.origin)) return;
      if (event.data.type === "INIT") {
        setError(undefined);
        setFatalError(undefined);
        return;
      }
      sentryHub.addBreadcrumb({
        message: `Received a postMessage from ${event.origin}`,
        data: event.data,
      });

      if (event.data.gateway === "Moonpay") {
        let returnedNextStep: any; //: NextStep;
        try {
          if (event.data.type === "card-completed") {
            returnedNextStep = await finishCCTransaction(
              event.data.transactionId,
              event.data.ccTokenId
            );
          } else if (event.data.type === "2fa-completed") {
            returnedNextStep = await checkTransaction(
              event.data.moonpayTxId,
              event.data.onramperTxId
            );
          } else {
            throw new Error("Unexpected response received");
          }
          replaceScreen(<Step nextStep={returnedNextStep as NextStep} />);
        } catch (e) {
          if (event.data.type === "card-completed") {
            (event.source as Window)?.postMessage("reset", "*");
          } else if (event.data.type === "2fa-completed") {
            /* nextScreen(<ErrorView type="TX" />) */
            reportError(e.message, true, event.data);
            return;
          }
          reportError(e.message, false, event.data);
        }
      } else if (event.data.type) {
        replaceScreen(<Step nextStep={event.data as NextStep} />);
      } else if (typeof event.data === "string") {
        reportError(event.data, false, event.data);
      } else {
        reportError(
          "Unknow error. Please, contact help@onramper.com and provide the following info: " +
            nextStep.url,
          false,
          event.data
        );
      }
    };
    window.addEventListener("message", receiveMessage);
    return () => window.removeEventListener("message", receiveMessage);
  }, [replaceScreen, nextStep.type, nextStep.url, nextScreen]);

  return (
    <div className={styles.view}>
      <Header
        title={nextStep.humanName ?? t('miscViews.completePayment')}
        hideBurgerButton={nextStep.type === "iframe" && nextStep.fullscreen}
        backButton
      />
      <BodyIframeView
        textInfo={nextStep.type === "redirect" ? nextStep.hint : undefined}
        error={error}
        fatalError={fatalError}
        features={
          nextStep.type === "iframe" ? nextStep.neededFeatures : undefined
        }
        src={nextStep.url}
        type={nextStep.type}
        onErrorDismissClick={(type) =>
          type === "FATAL" ? setFatalError(undefined) : setError(undefined)
        }
        isFullScreen={nextStep.type === "iframe" ? nextStep.fullscreen : false}
      />
    </div>
  );
};

export default IframeView;
