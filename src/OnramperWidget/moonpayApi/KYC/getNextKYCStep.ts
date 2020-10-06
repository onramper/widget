import {
  moonpayBaseAPI,
  identifier,
  acceptedContentTypes,
  baseCreditCardSandboxUrl,
  baseAPIUrl, baseUploadsUrl
} from '../constants';
import { encodeToken, encodeJson } from '../utils/token';
import { StepError, InternalError } from '../errors';
import { nextStep, stepDataItems } from '../utils/lambda-response';
import { requiredDocumentsAlpha3 } from '../moonpayCountryData';
import fetch from '../utils/fetch';
import getDocumentHumanName from '../documents/getDocumentHumanName';
import { creationTxType } from './dynamoTxs';
import { limitAPIResponse, customerAPIResponse } from './api';
import * as items from './items';

function selectLimit(
  limits: limitAPIResponse,
  txType: string
): limitAPIResponse['limits'][0] {
  return limits.limits.filter((l) => l.type === txType)[0];
}

function getAlpha3Country(alpha3Country: string | null): string {
  if (alpha3Country === null) {
    throw new InternalError(
      "This point should never be reached, we are attempting to do document verification for a customer (passport...) but said customer hasn't registered it's identity yet (country is null)."
    );
  }
  return alpha3Country;
}

export default async function (
  creationTx: creationTxType,
  token: string,
  customerData: customerAPIResponse
): Promise<nextStep> {
  // TODO: This could be optimized by storing the result of limits between calls and predicting the changes to it based on our actions.
  // Essentially only the first call to the /limits endpoint is needed
  const limits = (await fetch(`${moonpayBaseAPI}/customers/me/limits`, {
    headers: {
      'X-CSRF-TOKEN':token,
    },
  }).then((res) => res.json())) as limitAPIResponse;
  let txType: string;
  if (creationTx.paymentMethod === 'creditCard') {
    txType = 'buy_credit_debit_card';
  } else if (creationTx.paymentMethod === 'bankTransfer') {
    if (creationTx.fiatCurrency === 'EUR') {
      txType = 'buy_sepa_bank_transfer';
    } else if (creationTx.fiatCurrency === 'GBP') {
      txType = 'buy_gbp_bank_transfer';
    } else {
      throw new InternalError(
        'No currency other than EUR and GBP is allowed to make bank transfers.'
      );
    }
  } else {
    throw new InternalError('Payment method not accepted.');
  }
  const txId = creationTx.PK.split('#')[1];
  const currentLimit = Math.min(
    selectLimit(limits, txType).dailyLimitRemaining,
    selectLimit(limits, txType).monthlyLimitRemaining
  );
  if (creationTx.fiatAmount <= currentLimit) {
    if (creationTx.paymentMethod === 'creditCard') {
      return {
        type: 'iframe',
        url: `${baseCreditCardSandboxUrl}?customerId=${
          customerData.id
        }&customerAddress=${encodeJson(
          customerData.address
        )}&transactionId=${txId}`,
      };
    }
    // Request bank data
    const fiatCurrency = creationTx.fiatCurrency;
    let requiredData: stepDataItems;
    if (fiatCurrency === 'EUR') {
      requiredData = [items.bankIbanItem];
    } else {
      requiredData = [items.bankSortCodeItem, items.bankAccountNumberItem];
    }
    return {
      type: 'form',
      url: `${baseAPIUrl}/transaction/${identifier}/registerBank/${encodeToken([
        txId,
        token,
        fiatCurrency,
      ])}`,
      data: requiredData,
    };
  }
  const missingKYC = limits.verificationLevels.filter(
    (level) => level.completed === false
  );
  if (missingKYC.length === 0) {
    throw new StepError(
      "Transaction couldn't be completed because it exceeds all of Moonpay's limits (monthly or daily).",
      null
    );
  } else {
    const nextKYCLevel = missingKYC[0].requirements.filter(
      (req) => req.completed === false
    )[0].identifier;
    if (nextKYCLevel === 'phone_number_verification') {
      if (customerData.phoneNumber === null) {
        // Get phone
        return {
          type: 'form',
          url: `${baseAPIUrl}/transaction/${identifier}/registerPhone/${encodeToken(
            [txId, token]
          )}`,
          data: [items.phoneCountryCodeItem, items.phoneNumberItem],
        };
      }
      // Verify phone
      return {
        type: 'form',
        url: `${baseAPIUrl}/transaction/${identifier}/verifyPhone/${encodeToken(
          [txId, token]
        )}`,
        data: [items.verifyPhoneCodeItem],
      };
    }
    if (nextKYCLevel === 'document_verification') {
      const alpha3Country = getAlpha3Country(customerData.address.country);
      const possibleDocuments = requiredDocumentsAlpha3[alpha3Country];

      return {
        type: 'pickOne',
        options: possibleDocuments.map((docId) => {
          let humanName: string;
          try {
            humanName = `${getDocumentHumanName(docId)} - Front`;
          } catch (e) {
            throw new InternalError(e);
          }
          return {
            type: 'file',
            humanName,
            url: `${baseUploadsUrl}/${identifier}/${docId}/${txId}/${alpha3Country}/${token}/front`,
            acceptedContentTypes,
          };
        }),
      };
    }
    if (nextKYCLevel === 'face_match_verification') {
      const alpha3Country = getAlpha3Country(customerData.address.country);
      return {
        type: 'file',
        humanName: 'Selfie',
        url: `${baseUploadsUrl}/${identifier}/selfie/${txId}/${alpha3Country}/${token}/front`,
        acceptedContentTypes,
      };
    }
    if (nextKYCLevel === 'address_verification') {
      const alpha3Country = getAlpha3Country(customerData.address.country);
      return {
        type: 'file',
        humanName: 'Proof of Address',
        hint:
          'Original, unedited photo or PDF of a bank statement, utility bill, tax return or council tax bill.',
        url: `${baseUploadsUrl}/${identifier}/proof_of_address/${txId}/${alpha3Country}/${token}/front`,
        acceptedContentTypes,
      };
    }
    if (nextKYCLevel === 'identity_verification') {
      throw new InternalError(
        'It is impossible to reach this point without finishing identity verification.'
      );
    } else {
      throw new StepError(
        'Required KYC level is not supported by Onramper.',
        null
      );
    }
  }
}
