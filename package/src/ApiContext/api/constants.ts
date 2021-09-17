export const documents = [
  "passport",
  "nationalIdentityCard",
  "residenceCard",
  "driverLicense",
];

export const BASE_API =
  process.env.STAGE === "prod"
    ? "https://onramper.tech"
    : "https://onramper.tech";

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
