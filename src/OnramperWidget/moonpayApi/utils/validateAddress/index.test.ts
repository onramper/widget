import validateAddress from '.';
import { supportedCryptoOutsideUS, USsupportedCrypto } from '../../moonpayCountryData';

test('all types of BTC addresses are deemed as valid', () => {
  // P2PKH
  expect(validateAddress('1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', 'BTC')).toBe(
    true
  );
  // P2SH
  expect(validateAddress('3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy', 'BTC')).toBe(
    true
  );
  // Bech32
  expect(
    validateAddress('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', 'BTC')
  ).toBe(true);
  // Litecoin address
  expect(
    validateAddress('ltc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', 'BTC')
  ).toBe(false);
});

test('ETH addresses validation works', () => {
  expect(
    validateAddress('0x00222EaD2D0F83A71F645d3d9634599EC8222830', 'ETH')
  ).toBe(true);
  expect(
    validateAddress('wrong', 'ETH')
  ).toBe(false);
});

test('Error is thrown when an unknown currency is encountered', () => {
  expect(() => validateAddress('', 'UWU')).toThrowErrorMatchingInlineSnapshot(
    `"Cryptocurrency not supported"`
  );
});

test('all the different currencies supported by Onramper are covered', () => {
  const allCrypto = supportedCryptoOutsideUS.concat(USsupportedCrypto).map(curr => curr.code)
  for (const crypto of allCrypto) {
    expect(() => validateAddress('', crypto)).not.toThrow();
  }
});