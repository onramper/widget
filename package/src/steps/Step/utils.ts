import { NextStepError, StepDataItems } from "../../ApiContext";

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
