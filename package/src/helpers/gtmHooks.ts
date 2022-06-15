import { useRef, useContext, useEffect } from "react";
import { NavContext } from "./../NavContext";
import { triggerGTMEvent, generateGtmCtxValue, GtmEventNames } from "./useGTM";
import { APIContext, NextStep } from "./../ApiContext";

export const useStepGtm = (nextStep: NextStep) => {
  const { collected } = useContext(APIContext);
  const { currentStep } = useContext(NavContext);
  const firstRenderRef = useRef(false);

  useEffect(() => {
    if (firstRenderRef.current) {
      return;
    }
    firstRenderRef.current = true;

    triggerGTMEvent({
      event: nextStep?.eventName || GtmEventNames.FiatToCrypto,
      category: nextStep?.eventCategory || collected.selectedGateway?.id || "",
      label: nextStep?.eventLabel || nextStep?.type,
      action: `step ${currentStep() + 1}`,
      value: generateGtmCtxValue(collected),
    });
  }, [collected, currentStep, nextStep]);
  return "";
};
