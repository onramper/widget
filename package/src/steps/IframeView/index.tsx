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
import HeaderPicker from "../../common/Header/HeaderPicker/HeaderPicker";
import { PaymentProgressView } from "../PaymentProgressView";

const btcdirectFinishedOrigin =
  "https://btcdirect.sandbox.staging.onramper.tech";

const IframeView: React.FC<{
  nextStep: NextStep & { type: "iframe" | "redirect" };
}> = ({ nextStep }) => {
  const { replaceScreen, nextScreen } = useContext(NavContext);
  //const textInfo = 'Complete your payment. The form below is in a secure sandbox.'
  const [error, setError] = useState<string>();
  const [fatalError, setFatalError] = useState<string>();
  const {
    collected: { selectedGateway },
  } = useContext(APIContext);

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
            selectedGateway?.name === "Moonpay_Uniswap"
          ) {
            replaceScreen(
              <PaymentProgressView
                nextStep={{
                  type: "paymentProgress",
                  progress: 80,
                  tokenIn: {
                    name: "Wrapped Ether",
                    address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
                    symbol: "WETH",
                    decimals: 18,
                    chainId: 4,
                    logoURI:
                      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
                  },
                  tokenOut: {
                    name: "Uniswap",
                    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
                    symbol: "UNI",
                    decimals: 18,
                    chainId: 4,
                    logoURI:
                      "ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg",
                  },
                  gateway: "moonpay",
                  transactionHash:
                    "--------------------------please-fill-something-better-here",
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
    [nextStep.url, replaceScreen, selectedGateway?.name]
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
      <HeaderPicker
        title={nextStep.humanName ?? "Complete payment"}
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
