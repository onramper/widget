import { moonpayBaseAPI } from './constants';
import { nextStep } from './utils/lambda-response';
import fetch from './utils/fetch';
import ddb from './utils/dynamodb';
import { getCreationTx } from './KYC/dynamoTxs';
import { StepError } from './errors';

interface CreateBankResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  iban: string | null;
  bic: string | null;
  accountNumber: string | null;
  sortCode: string | null;
  bankName: string;
  currencyId: string;
  customerId: string;
}

interface CreateBankTransactionResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  baseCurrencyAmount: number;
  quoteCurrencyAmount: null;
  feeAmount: number;
  extraFeeAmount: number;
  areFeesIncluded: boolean;
  status: 'waitingPayment';
  failureReason: null;
  walletAddress: string;
  walletAddressTag: null;
  cryptoTransactionId: null;
  returnUrl: null;
  redirectUrl: null;
  baseCurrencyId: string;
  currencyId: string;
  customerId: string;
  cardId: null;
  bankAccountId: string;
  bankDepositInformation: {
    iban: string;
    bic: string;
    bankName: string;
    bankAddress: string;
    accountName: string;
    accountAddress: string;
  };
  bankTransferReference: string;
  eurRate: number;
  usdRate: number;
  gbpRate: number;
  externalTransactionId: null;
}

export default async function (
  txId: string,
  jwtToken: string,
  bankInfo:
    | {
        currencyCode: 'eur';
        iban: string;
      }
    | {
        currencyCode: 'gbp';
        accountNumber: string;
        sortCode: string;
      }
): Promise<nextStep> {
  try {
    const bankResponse = (await fetch(`${moonpayBaseAPI}/bank_accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(bankInfo),
    }).then((res) => res.json())) as CreateBankResponse;
    const creationTx = await getCreationTx(txId);
    const txCreationResponse = (await fetch(`${moonpayBaseAPI}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        baseCurrencyAmount: creationTx.fiatAmount,
        extraFeePercentage: 0, // TODO
        areFeesIncluded: true,
        walletAddress: creationTx.cryptocurrencyAddress,
        baseCurrencyCode: bankInfo.currencyCode,
        currencyCode: creationTx.cryptoCurrency.toLowerCase(),
        bankAccountId: bankResponse.id,
      }),
    }).then((res) => res.json())) as CreateBankTransactionResponse;
    ddb.put({
      PK: `tx#${txId}`,
      SK: `complete`,
      Timestamp: Date.now(),
      status: txCreationResponse.status,
    });
    return {
      type: 'requestBankTransaction',
      depositBankAccount: txCreationResponse.bankDepositInformation,
      reference: txCreationResponse.bankTransferReference,
      hint: `Transfer ${creationTx.fiatAmount} ${bankInfo.currencyCode} into the bank account provided to complete the transaction. Your transaction must cite the reference '${txCreationResponse.bankTransferReference}' to be valid.`,
    };
  } catch (e) {
    throw new StepError('Bank or currency not supported by Moonpay.', null);
  }
}
