export const documents = [
  "passport",
  "nationalIdentityCard",
  "residenceCard",
  "driverLicense",
];

export const BASE_API = (() => {
  switch (process.env.STAGE) {
    case "local":
      return "http://localhost:3000/l2";
    case "l2":
      return "https://l2.onramper.tech/dev"; //  "https://bwspdt92de.execute-api.us-west-1.amazonaws.com" ;
    case "prod":
      return "https://onramper.tech";
    case "demo":
      return "https://staging.onramper.tech";
    default:
      return "http://localhost:3000/dev";
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

export const G_TAG_ID =
  process.env.STAGE === "prod" ? "GTM-MKWPFXR" : "GTM-W8KDKZR";
