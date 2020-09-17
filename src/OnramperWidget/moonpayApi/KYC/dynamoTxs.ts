import ddb from '../utils/dynamodb';
import { StepError } from '../errors';

export interface creationTxType {
  PK: string;
  SK: `create`;
  Timestamp: number;
  fiatCurrency: string;
  cryptoCurrency: string;
  fiatAmount: number;
  paymentMethod: string;
  cryptocurrencyAddress: string;
  country: string;
}

export interface emailVerifiedTx {
  PK: string;
  SK: `verifyEmail`;
  Timestamp: number;
  jwtToken: string;
}

export interface identityTX {
  PK: string;
  SK: `registerIdentity`;
  Timestamp: number;
  alpha3Country: string;
  alpha2Country: string;
}

export function createCreationTx(tx: creationTxType) {
  return ddb.put(tx);
}

export async function getCreationTx(id: string): Promise<creationTxType> {
  const tx = await ddb.get({
      PK: `tx#${id}`,
      SK: `create`,
  });
  if (tx === undefined) {
    throw new StepError(
      'The transaction that you are attempting to continue has not been created.',
      null
    );
  }
  return tx as creationTxType;
}

export async function getTxJwtToken(id: string): Promise<emailVerifiedTx> {
  const tx = await ddb.get({
      PK: `tx#${id}`,
      SK: `verifyEmail`,
  });
  if (tx === undefined) {
    throw new StepError(
      "Customer hasn't been authenticated through email yet.",
      null
    );
  }
  return tx as emailVerifiedTx;
}
