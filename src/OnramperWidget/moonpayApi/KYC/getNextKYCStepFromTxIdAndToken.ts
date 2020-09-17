import { getCreationTx } from './dynamoTxs';
import { setFiatCurrency } from './api';
import getNextKYCStep from './getNextKYCStep';

export default async function (
  id: string,
  token: string
): ReturnType<typeof getNextKYCStep> {
  const creationTx = await getCreationTx(id);
  // TODO: In most of the times where this is called,
  // the currency has already been set, so we could just store
  // the customer data in a previous call and pull it from dynamo here
  // thus making everything faster by removing a network call
  const customerData = await setFiatCurrency(token, creationTx.fiatCurrency);
  return getNextKYCStep(creationTx, token, customerData);
}
