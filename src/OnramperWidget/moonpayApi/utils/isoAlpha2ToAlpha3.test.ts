import isoAlpha2ToAlpha3 from './isoAlpha2ToAlpha3';

test('USA conversion', () => {
  expect(isoAlpha2ToAlpha3('us', '')).toBe('USA');
});

test('case-insensivity handling', () => {
  expect(isoAlpha2ToAlpha3('us', '')).toBe(isoAlpha2ToAlpha3('US', ''));
});

test('Kosovo is supported', () => {
  expect(isoAlpha2ToAlpha3('xk', '')).toBe('XKX');
});

test('error is thrown for nonexisting countries', () => {
  expect(() =>
    isoAlpha2ToAlpha3('su', 'country')
  ).toThrowErrorMatchingInlineSnapshot(
    `"Country provided is not a valid ISO 3166-1 alpha2 code. Examples of valid codes are 'es' for Spain, 'us' for the USA and 'gb' for Great Britain."`
  );
});
