import { createMockCreationTx, createMockTxJwtToken } from './mockTransactions';
import { getCreationTx, getTxJwtToken } from './dynamoTxs';

describe('txs created with the mock creation calls can be retrieved with normal get operations', () => {
  test('CreationTx', async () => {
    await createMockCreationTx({});
    expect((await getCreationTx('123')).SK).toBe('create');
  });
  test('TxJwtToken', async () => {
    await createMockTxJwtToken({});
    expect((await getTxJwtToken('123')).SK).toBe('verifyEmail');
  });
});
