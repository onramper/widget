import {
  supportedCryptoOutsideUS,
  USsupportedCrypto,
  requiredDocumentsAlpha3,
  requiredDocumentsAlpha2,
  unsupportedUSAStates,
  USAStates,
} from './moonpayCountryData';
import isoAlpha2ToAlpha3 from './utils/isoAlpha2ToAlpha3';

test("there's no overlap between crypto supported inside and oustide the US", () => {
  for (const c of supportedCryptoOutsideUS) {
    expect(USsupportedCrypto).not.toContain(c);
  }
});

test('requiredDocumentsAlpha3 takes uppercase 3-letter keys', () => {
  expect(requiredDocumentsAlpha3.USA).toBeDefined();
});

test('requiredDocumentsAlpha3 takes lowercase 2-letter keys', () => {
  expect(requiredDocumentsAlpha2.us).toBeDefined();
});

test('unsupportedUSAStates are included in usaStates', () => {
  for (const state of unsupportedUSAStates) {
    expect(USAStates).toContain(state);
  }
});

test('alpha2 and alpha3 lists are equivalent (same countries & same documents), and all countries in there are supported by iso converter', () => {
  for (const [alpha2Country, alpha2Docs] of Object.entries(
    requiredDocumentsAlpha2
  )) {
    let alpha3: string;
    try {
      alpha3 = isoAlpha2ToAlpha3(alpha2Country, '');
    } catch (e) {
      throw new Error(
        `Country code '${alpha2Country}' is not supported by isoAlpha2ToAlpha3`
      );
    }
    expect(requiredDocumentsAlpha3[alpha3]).toEqual(alpha2Docs);
    delete requiredDocumentsAlpha3[alpha3];
  }
  expect(Object.keys(requiredDocumentsAlpha3).length).toBe(0);
});
