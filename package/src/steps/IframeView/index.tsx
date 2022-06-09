import React, { useCallback, useContext, useEffect, useState } from "react";
import BodyIframeView from "./BodyIframeView";
import styles from "../../styles.module.css";
/* import ErrorView from '../../common/ErrorView' */
import Step from "../Step";
import { sentryHub, ApiError } from "../../ApiContext/api/index";
import { NextStep, APIContext } from "../../ApiContext";
import {
  finishCCTransaction,
  baseCreditCardSandboxUrl,
  checkTransaction,
} from "@onramper/moonpay-adapter";
import { NavContext } from "../../NavContext";
import { PaymentProgressView } from "../PaymentProgressView";
import { findWeth } from "../../utils";
import {
  isIframeStep,
  isRedirectStep,
} from "../../ApiContext/api/types/guards";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import { StepType } from "../../ApiContext/api/types/nextStep";
import useIframeGtm from "./useIframeGtm";

const btcdirectFinishedOrigin =
  "https://btcdirect.sandbox.staging.onramper.tech";

const IframeView: React.FC<{
  nextStep: NextStep & { type: StepType.iframe | StepType.redirect };
}> = ({ nextStep }) => {
  const { replaceScreen, nextScreen } = useContext(NavContext);
  //const textInfo = 'Complete your payment. The form below is in a secure sandbox.'
  const [error, setError] = useState<string>();
  const [fatalError, setFatalError] = useState<string>();
  const {
    collected: { selectedGateway },
  } = useContext(APIContext);

  const gtmPayload = useIframeGtm({
    nextStep,
    errors: [error, fatalError],
  });

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

  const handleReceiveMessage = useCallback(
    async (event: MessageEvent) => {
      if (
        ![baseCreditCardSandboxUrl, btcdirectFinishedOrigin].includes(
          event.origin
        )
      )
        return;
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
          console.log({ returnedNextStep, eventData: event.data });
          if (
            returnedNextStep.type === "completed" &&
            selectedGateway?.name === "Moonpay_Uniswap" &&
            (isIframeStep(nextStep) || isRedirectStep(nextStep))
          ) {
            replaceScreen(
              <PaymentProgressView
                nextStep={{
                  type: StepType.paymentProgress,
                  progress: 0,
                  // infer weth from output chainI
                  tokenIn: findWeth(nextStep.l2TokenData.chainId),
                  tokenOut: nextStep.l2TokenData,
                  gatewayAndDex: selectedGateway.name,
                  txId: nextStep.txId,
                  inCurrency: nextStep.inCurrency,
                }}
              />
            );
            return;
          }
          replaceScreen(<Step nextStep={returnedNextStep as NextStep} />);
        } catch (e) {
          if (e instanceof Error) {
            if (event.data.type === "card-completed") {
              (event.source as Window)?.postMessage("reset", "*");
            } else if (event.data.type === "2fa-completed") {
              /* nextScreen(<ErrorView type="TX" />) */
              reportError(e.message, true, event.data);
              return;
            }
            reportError(e.message, false, event.data);
          }
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
    },
    [nextStep, replaceScreen, selectedGateway?.name]
  );

  useEffect(
    () => {
      window.addEventListener("message", handleReceiveMessage);
      return () => window.removeEventListener("message", handleReceiveMessage);
    }, //eslint-disable=-next-line
    [
      replaceScreen,
      nextStep.type,
      nextStep.url,
      nextScreen,
      selectedGateway?.name,
      handleReceiveMessage,
    ]
  );

  return (
    <div className={styles.view}>
      <ProgressHeader
        title={nextStep.humanName ?? "Complete payment"}
        hideBurgerButton={
          nextStep.type === StepType.iframe && nextStep.fullscreen
        }
        percentage={nextStep.progress}
        useBackButton
      />
      <BodyIframeView
        textInfo={
          nextStep.type === StepType.redirect ? nextStep.hint : undefined
        }
        error={error}
        fatalError={fatalError}
        nextStep={nextStep}
        features={
          nextStep.type === StepType.iframe
            ? nextStep.neededFeatures
            : undefined
        }
        src={nextStep.url}
        type={nextStep.type}
        gtmPayload={gtmPayload}
        onErrorDismissClick={(type) =>
          type === "FATAL" ? setFatalError(undefined) : setError(undefined)
        }
        isFullScreen={
          nextStep.type === StepType.iframe ? nextStep.fullscreen : false
        }
      />
    </div>
  );
};

export default IframeView;
