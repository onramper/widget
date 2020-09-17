import ddb from '../utils/dynamodb';
import { creationTxType, emailVerifiedTx, createCreationTx } from './dynamoTxs';

export async function createMockCreationTx(tx: Partial<creationTxType>) {
  await createCreationTx({
    PK: `tx#123`,
    SK: `create`,
    Timestamp: 12340,
    fiatCurrency: 'EUR',
    cryptoCurrency: 'BTC',
    fiatAmount: 100,
    paymentMethod: 'creditCard',
    country: 'es',
    cryptocurrencyAddress: '0xpleb',
    ...tx,
  });
}
export async function createMockTxJwtToken(tx: Partial<emailVerifiedTx>) {
  await ddb.put({
    PK: `tx#123`,
    SK: `verifyEmail`,
    Timestamp: 12345,
    jwtToken: 'moonpayJwtToken',
    ...tx,
  });
}

export async function createAllMockTxs(id: string = '123') {
  await createMockCreationTx({ PK: `tx#${id}` });
  await createMockTxJwtToken({ PK: `tx#${id}` });
}
