import { NextStep, APIContext } from "../../ApiContext";
import { useState, useRef, useEffect, useContext } from "react";
import { NavContext } from "../../NavContext";
import {
  triggerGTMEvent,
  GtmEventNames,
  generateGtmStepValue,
} from "../../helpers/useGTM";
import { StepType } from "../../ApiContext/api/types/nextStep";

const stepIgnoreList = [
  StepType.iframe,
  StepType.redirect,
  StepType.information,
  StepType.completed,
];

export const useStepGtmCall = (step?: NextStep) => {
  const [callback, setCallback] = useState<() => void>();
  const firstRenderRef = useRef(false);
  const { currentStep } = useContext(NavContext);
  const { collected } = useContext(APIContext);

  useEffect(() => {
    if (firstRenderRef.current) {
      return;
    }
    firstRenderRef.current = true;

    if (!step || stepIgnoreList.indexOf(step.type) > -1) {
      setCallback(() => () => {});
      return;
    }

    const action = (() => {
      if (step.type === StepType.wait) {
        return `(waiting for) step ${currentStep() + 1}`;
      }
      return `step ${currentStep()}`;
    })();

    setCallback(() => () => {
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
