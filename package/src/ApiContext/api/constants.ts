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
      return "https://l2.onramper.tech";
    case "prod":
      return "https://onramper.tech";
    default:
      return "http://localhost:3000/dev";
  }
})();

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
