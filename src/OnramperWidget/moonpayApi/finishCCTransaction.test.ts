import finishCCTransaction from './finishCCTransaction';
import {
  simulateSingleFetchFailure,
  setFetchReturn,
} from './utils/fetch';
import { createAllMockTxs, createMockTxJwtToken } from './KYC/mockTransactions';
jest.mock('./utils/fetch');

beforeEach(()=>{
  localStorage.clear();
})

test('Address error is properly propagated', async () => {
  simulateSingleFetchFailure(
    null,
    '{"errors":[],"message":"Wallet address does not match regex","type":"BadRequestError"}'
  );
  await createAllMockTxs('123');
  return expect(
    finishCCTransaction('123', 'mock-cc-token')
  ).rejects.toMatchInlineSnapshot(
    `[StepError: Transaction failed: Wallet address does not match regex. Note that if you are using a test API Key only testnet addresses are allowed.]`
  );
});

test("Returns descriptive error when transaction doesn't exist", async () => {
  await createMockTxJwtToken({});
  return expect(
    finishCCTransaction('123', 'mock-cc-token')
  ).rejects.toMatchInlineSnapshot(
    `[StepError: The transaction that you are attempting to continue has not been created.]`
  );
});

test('If 3D secure is not required the response marks the transaction as completed', async () => {
  await createAllMockTxs('123');
  setFetchReturn('{"status": "completed"}');
  expect(await finishCCTransaction('123', 'mock-cc-token'))
    .toMatchInlineSnapshot(`
    Object {
      "type": "completed",
    }
  `);
});

test('If 3D secure is required we respond with a redirect', async () => {
  await createAllMockTxs('123');
  const res = await finishCCTransaction('123', 'mock-cc-token');
  expect(res.type).toBe('redirect');
  expect(res).toMatchInlineSnapshot(`
      Object {
        "type": "redirect",
        "url": "https://api.moonpay.io/v3/device_authorization?transactionId=70590bd8-0e78-40e1-9086-137d57c2d048&sid=bcc5563c-47b9-4c69-834d-a5232c0a2d46",
      }
    `);
});
