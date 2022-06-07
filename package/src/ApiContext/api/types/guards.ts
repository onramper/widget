import { IframeStep, NextStep, RedirectStep } from "./nextStep";

export const isIframeStep = (step: NextStep): step is IframeStep => {
  return (step as IframeStep)?.type === "iframe";
};

export const isRedirectStep = (step: NextStep): step is RedirectStep => {
  return (step as RedirectStep)?.type === "redirect";
};
