export const documents = ['passport', 'nationalIdentityCard', 'residenceCard', 'driverLicense']

export const BASE_API = process.env.STAGE === 'prod'
    ? 'https://api.onramper.com'
    : 'https://api.onramper.dev';

export const SANDBOX_HOSTNAME = process.env.STAGE === 'prod'
    ? 'sandbox.onramper.com'
    : 'sandbox.onramper.dev';