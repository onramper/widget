import { NextStep, APIContext } from "../../ApiContext";
import { useState, useRef, useEffect, useContext } from "react";
import { NavContext } from "../../NavContext";
import {
  triggerGTMEvent,
  GtmEventNames,
  generateGtmStepValue,
} from "../../helpers/useGTM";

const stepIgnoreList = ["iframe", "redirect", "information"];

export const useStepGtmCall = (step?: NextStep) => {
  const [callback, setCallback] = useState(() => () => {});
  const firstRenderRef = useRef(false);
  const { currentStep } = useContext(NavContext);
  const { collected } = useContext(APIContext);

  useEffect(() => {
    if (firstRenderRef.current) {
      return;
    }
    firstRenderRef.current = true;

    if (!step || stepIgnoreList.indexOf(step.type) > -1) {
      return;
    }

    const action = (() => {
      if (step.type === "wait") {
        return `(waiting for) step ${currentStep() + 1}`;
      }
      return `step ${currentStep()}`;
    })();

    setCallback(() => {
      triggerGTMEvent({
        event: step?.eventName || GtmEventNames.FiatToCrypto,
        category: step?.eventCategory || collected?.selectedGateway?.id || "",
        label: step?.eventLabel || step?.type,
        action,
        value: generateGtmStepValue(collected),
      });
    });
  }, [collected, currentStep, step]);

  return callback;
};
