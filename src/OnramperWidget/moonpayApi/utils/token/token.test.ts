import {
  randomId,
  encodeToken,
  decodeToken,
  checkTokenTypes,
  checkBodyParams,
} from '.';

test("encoding doesn't generate any unsafe URL characters", () => {
  const data = ['327Yyt32??^'];
  expect(Buffer.from(JSON.stringify(data)).toString('base64')).toContain('/');
  expect(encodeToken(data)).not.toContain('/');
});

test('decoding works well', () => {
  const data = [randomId(), '123', 321];
  expect(decodeToken(encodeToken(data))).toEqual(data);
});

test("randomIds don't repeat and don't contain '=' characters", () => {
  const pastIds: string[] = [];
  for (let i = 0; i < 100; i += 1) {
    const id = randomId();
    expect(pastIds).not.toContain(id);
    expect(id).not.toContain('=');
    pastIds.push(id);
  }
});

test('typeChecking of decoded tokens works', () => {
  // The following statement should trigger compiler errors
  // Because it mistmatches the temmplate types with the sample values (string and 0)
  // checkTokenTypes<[string]>([2], [0])

  expect(checkTokenTypes<[string, number]>(['abc', 3], ['', 0])).toBe(true);
  expect(checkTokenTypes<[string, number]>(['abc', 'wrong'], ['', 0])).toBe(
    false
  );
  expect(checkTokenTypes<[string, number]>(['abc'], ['', 0])).toBe(false); // Check length
});

const stringItem = { type: 'string' as const, humanName: '' };
test('basic body checks', () => {
  expect(() =>
    checkBodyParams({ prop: 'value' }, [{ ...stringItem, name: 'prop' }])
  ).not.toThrow();
  expect(() =>
    checkBodyParams({ prop: 'value' }, [{ ...stringItem, name: 'nonexisting' }])
  ).toThrowErrorMatchingInlineSnapshot(
    `"Parameter 'nonexisting' is not defined on json body."`
  );
  expect(() =>
    checkBodyParams({ nonstring: 2 }, [{ ...stringItem, name: 'nonstring' }])
  ).toThrowErrorMatchingInlineSnapshot(
    `"Parameter 'nonstring' found on json body is not a string."`
  );
});

const correctDateItem = {
  type: 'date' as const,
  name: 'dateObj',
  humanName: '',
  data: {} as any,
};
test('date type body checks', () => {
  expect(() =>
    checkBodyParams({ prop: 'value' }, [
      { ...correctDateItem, name: 'nonexisting' },
    ])
  ).toThrowErrorMatchingInlineSnapshot(
    `"Parameter 'nonexisting' is not defined on json body."`
  );
  expect(() =>
    checkBodyParams({ dateObj: 'value' }, [correctDateItem])
  ).toThrowErrorMatchingInlineSnapshot(
    `"Parameter 'dateObj' is a date, so it should be an object with integer number properties 'day', 'month' and 'year'. However, 'dateObj' is not an object."`
  );
  expect(() =>
    checkBodyParams({ dateObj: { day: 1 } }, [correctDateItem])
  ).toThrowErrorMatchingInlineSnapshot(
    `"Parameter 'dateObj' is a date, so it should be an object with integer number properties 'day', 'month' and 'year'. However, property 'month' is not a number."`
  );
  expect(() =>
    checkBodyParams({ dateObj: { day: 1, month: 1, year: 2 } }, [
      correctDateItem,
    ])
  ).not.toThrow();
  expect(() =>
    checkBodyParams({ dateObj: { day: 1, month: 1, year: 2.3 } }, [
      correctDateItem,
    ])
  ).toThrowErrorMatchingInlineSnapshot(
    `"Parameter 'dateObj' is a date, so it should be an object with integer number properties 'day', 'month' and 'year'. However, property 'year' is not an integer."`
  );
});

const integerItem = {
  type: 'integer' as const,
  name: 'phoneNumber',
  humanName: '',
};
test('integer body checks', () => {
  expect(() =>
    checkBodyParams({ phoneNumber: 45 }, [integerItem])
  ).not.toThrow();
  expect(() =>
    checkBodyParams({ phoneNumber: 'wrong' }, [integerItem])
  ).toThrowErrorMatchingInlineSnapshot(
    `"Parameter 'phoneNumber' found on json body is not a number."`
  );
  expect(() =>
    checkBodyParams({ phoneNumber: 1.3 }, [integerItem])
  ).toThrowErrorMatchingInlineSnapshot(
    `"Parameter 'phoneNumber' found on json body is not an integer."`
  );
});
