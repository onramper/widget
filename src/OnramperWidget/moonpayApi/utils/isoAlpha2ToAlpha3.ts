import { alpha2to3 } from 'iso3166-alpha-converter';
import StepError from '../errors/StepError';

export default function (alpha2: string, fieldName: string) {
  const alpha3 = alpha2to3[alpha2.toLowerCase()];
  if (alpha3 === undefined) {
    if (alpha2.toLowerCase() === 'xk') {
      return 'XKX';
    }
    throw new StepError(
      "Country provided is not a valid ISO 3166-1 alpha2 code. Examples of valid codes are 'es' for Spain, 'us' for the USA and 'gb' for Great Britain.",
      fieldName
    );
  }
  return alpha3;
}
