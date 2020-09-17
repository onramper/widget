import FetchError from './FetchError';

test('Error constructor takes objects and makes them available', () => {
  const obj = {
    errors: [],
    message: 'Wallet address does not match regex',
    type: 'BadRequestError',
  };
  const err = new FetchError(obj);
  expect(err.errorObject).toEqual(obj);
  expect(err).toMatchInlineSnapshot(
    `[FetchError: {"errors":[],"message":"Wallet address does not match regex","type":"BadRequestError"}]`
  );
});
