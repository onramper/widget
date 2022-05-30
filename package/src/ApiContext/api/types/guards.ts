import { IframeStep, NextStep, RedirectStep } from "./nextStep";

// a type guard to check step
export const isIframeStep = (step: NextStep): step is IframeStep => {
  return (step as IframeStep)?.type === "iframe";
};

// a type guard to check if Route Details is valid. ie. has method params
export const isRedirectStep = (step: NextStep): step is RedirectStep => {
  return (step as RedirectStep)?.type === "redirect";
};
