import { moonpayBaseAPI, baseCreditCardSandboxUrl } from './constants';
import { nextStep } from './utils/lambda-response';
import fetch from './utils/fetch';
import ddb from './utils/dynamodb';
import { getCreationTx, getTxJwtToken } from './KYC/dynamoTxs';
import { StepError, FetchError } from './errors';

interface TransactionResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  baseCurrencyAmount: number;
  quoteCurrencyAmount: null;
  feeAmount: number;
  extraFeeAmount: number;
  areFeesIncluded: boolean;
  status: 'pending' | 'waitingAuthorization';
  failureReason: null;
  walletAddress: string;
  walletAddressTag: null;
  cryptoTransactionId: null;
  returnUrl: string;
  redirectUrl: null | string;
  baseCurrencyId: string;
  currencyId: string;
  customerId: string;
  cardId: string;
  bankAccountId: null;
  bankDepositInformation: null;
  bankTransferReference: null;
  eurRate: number;
  usdRate: number;
  gbpRate: number;
  externalTransactionId: null;
}

export default async function (
  txId: string,
  ccTokenId: string
): Promise<nextStep> {
  try {
    const jwtTx = getTxJwtToken(txId);
    const creationTx = await getCreationTx(txId);
    const moonpayTx = (await fetch(`${moonpayBaseAPI}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${(await jwtTx).jwtToken}`,
      },
      body: JSON.stringify({
        baseCurrencyAmount: creationTx.fiatAmount,
        extraFeePercentage: 0, // TODO
        areFeesIncluded: true,
        walletAddress: creationTx.cryptocurrencyAddress,
        baseCurrencyCode: creationTx.fiatCurrency.toLowerCase(),
        currencyCode: creationTx.cryptoCurrency.toLowerCase(),
        returnUrl: `${baseCreditCardSandboxUrl}/finished.html`,
        tokenId: ccTokenId,
      }),
    }).then((res) => res.json())) as TransactionResponse;
    ddb.put({
      PK: `tx#${txId}`,
      SK: `complete`,
      Timestamp: Date.now(),
      status: moonpayTx.status,
    });
    if (moonpayTx.status === 'waitingAuthorization') {
      return {
        type: 'redirect',
        url: moonpayTx.redirectUrl!,
      };
    }
    return {
      type: 'completed',
    };
  } catch (e) {
    if (e instanceof FetchError) {
      let errorMessage = e.errorObject.message;
      if (errorMessage === 'Wallet address does not match regex') {
        errorMessage =
          'Wallet address does not match regex. Note that if you are using a test API Key only testnet addresses are allowed';
      }
      throw new StepError(`Transaction failed: ${errorMessage}.`, null);
    } else if (e instanceof StepError) {
      throw e;
    } else {
      throw new StepError(`Transaction failed for unexpected reasons.`, null);
    }
  }
}
