export const documents = ['passport', 'nationalIdentityCard', 'residenceCard', 'driverLicense']

export const BASE_API = process.env.STAGE === 'prod'
    ? 'https://onramper.tech'
    : 'https://test.onramper.tech';

export const SANDBOX_HOSTNAME = process.env.STAGE === 'prod'
    ? 'sandbox.onramper.com'
    : 'sandbox.onramper.dev';

export const MERCURYO_HOSTNAME = 'exchange.mercuryo.io'

export const MOONPAY_HOSTNAME = process.env.STAGE === 'prod'
    ? 'buy.moonpay.com'
    : 'buy-staging.moonpay.com';