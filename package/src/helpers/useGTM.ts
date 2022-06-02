import { CollectedStateType } from "../ApiContext";

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

export const generateGtmStepValue = (collected: CollectedStateType) => {
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
  } = collected;

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
  };
};

export const triggerLandingViewGtmEvent = (collected: CollectedStateType) => {
  triggerGTMEvent({
    event: "fiat-to-crypto",
    category: collected.selectedGateway?.id || "",
    label: "transactionForm",
    action: `step 1`,
    value: generateGtmStepValue(collected),
  });
};
