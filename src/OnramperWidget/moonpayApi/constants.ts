export const publishableApiKey = 'pk_test_PjABKr88VlgosyTueq3exrVnYYLd4ZB';
export const moonpayBaseAPI = 'https://api.moonpay.io/v3';
// This identifier is also referenced by copy in `infra/src/lambda-edge.ts`, any changes here should also be applied there
export const identifier = 'Moonpay';
export const acceptedContentTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf',
];
export const baseCreditCardSandboxUrl =
  process.env.REACT_APP_STAGE !== 'prod'
    ? 'https://sandbox.onramper.com'
    : 'https://sandbox.onramper.dev';
export const baseAPIUrl =
    process.env.REACT_APP_STAGE !== 'prod'
      ? 'https://api.onramper.com'
      : 'https://api.onramper.dev';
export const baseUploadsUrl =
    process.env.REACT_APP_STAGE !== 'prod'
      ? 'https://upload.onramper.com'
      : 'https://upload.onramper.dev';
  