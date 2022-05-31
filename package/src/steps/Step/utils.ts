import { NextStepError, StepDataItems, CollectedStateType } from "../../ApiContext";

export const processError = (
  error: NextStepError,
  nextStepData: StepDataItems
) => {
  let newErr = new NextStepError("NextStep error");
  if (error.fields) {
    newErr.message =
      error.fields.filter(
        (err) => !nextStepData?.find((data) => data.name === err.field)
      )[0]?.message + "  Go back and fix it.";
    /* if (!newErr.message)
            newErr.fields = error.fields */
  } else if (error.field) {
    if (nextStepData?.find((data) => data.name === error.field)) newErr = error;
    else newErr.message = `${error.message} Go back and fix it.`;
  } else if (error.message) newErr.message = error.message;

  return newErr;
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
