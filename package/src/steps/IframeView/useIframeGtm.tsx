import { useRef, useContext, useEffect } from "react";
import { NavContext } from "../../NavContext";
import { triggerGTMEvent, generateGtmCtxValue } from "../../helpers/useGTM";
import { GtmEvent, GtmEventLabel } from "../../enums";
import { APIContext, NextStep } from "../../ApiContext";
import { StepType } from "../../ApiContext/api/types/nextStep";

type UseIframeGtmProps = {
  nextStep: NextStep;
  errors: (string | undefined)[];
};

/**
 * 2 roles:
 * - sends GTM step-event for iframe if the initial load has no errors
 * - creates the GTM step-event payload to be passed on to the consumer of this hook
 */
const useIframeGtm = ({ nextStep, errors }: UseIframeGtmProps) => {
  const { collected } = useContext(APIContext);
  const { currentStep } = useContext(NavContext);

  const hasAnyErrorRef = useRef(false);
  const nextStepRef = useRef(nextStep);
  const isWaitingInitialErrorsRef = useRef(
    (nextStep.type === StepType.iframe ||
      nextStep.type === StepType.redirect) &&
      nextStepRef.current.eventLabel !== GtmEventLabel.PAYMENT_METHOD
  );
  const gtmPayloadRef = useRef({
    event: nextStep?.eventName || GtmEvent.FIAT_TO_CRYPTO,
    category: nextStep?.eventCategory || collected.selectedGateway?.id || "",
    label: nextStep?.eventLabel || nextStep?.type,
    action: `step ${currentStep() + 1}`,
    value: generateGtmCtxValue(collected, nextStep?.txId),
  });

  useEffect(() => {
    hasAnyErrorRef.current = errors.some((err) => !!err);
  }, [errors]);

  useEffect(() => {
    if (!isWaitingInitialErrorsRef.current) {
      return;
    }

    /**
     * register GTM if the iframe loaded without INITIAL errors
     * if any error appears, is expected that either one of state error message is updated or this component will be replaced by ErrorView
     */
    const timeout = setTimeout(() => {
      !hasAnyErrorRef.current && triggerGTMEvent(gtmPayloadRef.current);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return gtmPayloadRef.current;
};

export default useIframeGtm;
