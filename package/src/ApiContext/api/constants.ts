export const documents = [
  "passport",
  "nationalIdentityCard",
  "residenceCard",
  "driverLicense",
];

export const BASE_API = (() => {
  switch (process.env.STAGE) {
    case "local":
      return "http://localhost:3000/dev";
    case "l2":
      return "https://l2.onramper.tech"; //  "https://bwspdt92de.execute-api.us-west-1.amazonaws.com" ;
    case "prod":
      return "https://onramper.tech";
    default: // Includes `dev` and `demo` stages.
      return "https://staging.onramper.tech";
  }
})();

export const isDemoEnv = process.env.STAGE === "demo";

export const SANDBOX_HOSTNAME =
  process.env.STAGE === "prod"
    ? "sandbox.onramper.tech"
    : "sandbox.staging.onramper.tech";

export const MERCURYO_HOSTNAME = "exchange.mercuryo.io";

export const MOONPAY_HOSTNAME =
  process.env.STAGE === "prod" ? "buy.moonpay.com" : "buy-staging.moonpay.com";

export const COINIFY_HOSTNAME =
  process.env.STAGE === "prod"
    ? "https://trade-ui.coinify.com"
    : "https://trade-ui.sandbox.coinify.com";

export const GTM_ID =
  process.env.STAGE === "prod" ? "GTM-MKWPFXR" : "GTM-W8KDKZR";

export const DEFAULT_GTM_DATA_LAYER = "dataLayer";
