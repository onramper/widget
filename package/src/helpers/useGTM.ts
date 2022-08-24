import { CollectedStateType } from "../ApiContext";
import { GtmEvent } from "../enums";

/**
 * Pushing any events to the data layer for GTM event tracking
 * @param {object} gtmObject
 */
export const triggerGTM = (gtmObject: object) => {
  window.dataLayer.push(gtmObject);
};

/**
 * GTM: Pushing custom events to the data layer for GTM event tracking
 *
 * @param {string} action
 * @param {string} category
 * @param {string}label
 * @param {any} value
 */
export const triggerGTMEvent = ({
  event,
  action,
  category,
  label,
  value,
}: {
  event: string;
  action?: string;
  category?: string;
  label?: string;
  value?: any;
}) => {
  triggerGTM({
    event,
    context: category,
    label,
    action,
    value,
  });
};

export const generateGtmCtxValue = (collected: CollectedStateType) => {
  const {
    amount,
    amountInCrypto,
    country,
    state,
    selectedCountry,
    selectedCrypto,
    selectedCurrency,
    selectedGateway,
    selectedPaymentMethod,
    selectGatewayBy,
  } = collected;

  const urlParams = selectedGateway?.nextStep?.url?.split("/");

  return {
    payment: {
      amount,
      amountInCrypto,
      selectedCurrency: selectedCurrency?.id,
      selectedPaymentMethod: selectedPaymentMethod?.id,
    },
    location: {
      country,
      selectedCountry,
      state,
    },
    crypto: {
      selectedCrypto: selectedCrypto?.id,
      selectedGateway: selectedGateway?.id,
    },
    gatewaySuggestion: selectGatewayBy,
    transactionId: urlParams?.[urlParams.length - 1],
  };
};

export const triggerLandingViewGtmFtcEvent = (
  collected: CollectedStateType
) => {
  triggerGTMEvent({
    event: GtmEvent.FIAT_TO_CRYPTO,
    category: collected.selectedGateway?.id || "",
    label: "transactionForm",
    action: `step 1`,
    value: generateGtmCtxValue(collected),
  });
};

export const triggerLandingViewGtmCtfEvent = (
  collected: CollectedStateType,
  buyStepGateway?: string
) => {
  triggerGTMEvent({
    event: GtmEvent.CRYPTO_TO_FIAT,
    category: buyStepGateway,
    label: "transactionForm",
    action: `step 1`,
    value: {
      location: {
        country: collected.country,
        selectedCountry: collected.selectedCountry,
        state: collected.state,
      },
      crypto: {
        selectedGateway: buyStepGateway,
      },
      payment: {},
    },
  });
};
