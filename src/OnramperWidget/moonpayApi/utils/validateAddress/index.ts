import moonpayRegexes from './moonpayRegexes';

export default function (address: string, cryptocurrency: string): boolean {
  let valid: boolean;
  const regex = moonpayRegexes[cryptocurrency];
  if (regex === undefined) {
    throw new Error('Cryptocurrency not supported');
  } else {
    valid = regex.test(address);
  }
  return valid;
}
