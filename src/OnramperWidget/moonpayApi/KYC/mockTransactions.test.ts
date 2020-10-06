import { createMockCreationTx, createMockTxAuthToken } from './mockTransactions';
import { getCreationTx, getTxAuthToken } from './dynamoTxs';

describe('txs created with the mock creation calls can be retrieved with normal get operations', () => {
  test('CreationTx', async () => {
    await createMockCreationTx({});
    expect((await getCreationTx('123')).SK).toBe('create');
  });
  test('TxAuthToken', async () => {
    await createMockTxAuthToken({});
    expect((await getTxAuthToken('123')).SK).toBe('verifyEmail');
  });
});
