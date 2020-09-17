import { registerEmail } from '.';
import { decodeToken } from '../utils/token';
import ddb from '../utils/dynamodb';
jest.mock('../utils/fetch');

beforeAll(()=>{
  Date.now = jest.fn(() =>
    new Date(Date.UTC(2020, 1, 1, 1)).valueOf()
  );
})

test('transaction process works properly', async () => {
  let url = "https://api.onramper.dev/transaction/Moonpay/email/WyIyMElJcXRhbE05U205ek9FOTlpbjRBLS0iLDEwMiwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd";
  const token = url.split('/').pop()!;
  url = (
    await (registerEmail as any)(
      ...decodeToken(token),
      'test@test.com',
      'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      'es'
    )
  ).url;
  expect(await ddb.scan()).toMatchSnapshot();
});

// TODO: Test phone verification flow (country = US)
