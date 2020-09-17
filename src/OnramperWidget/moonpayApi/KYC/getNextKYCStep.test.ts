import getNextKYCStep from './getNextKYCStep';
import { setFetchReturn } from '../utils/fetch';
jest.mock('../utils/fetch')

const limitAPISampleResponse =
  '{"limits":[{"type":"buy_credit_debit_card","dailyLimit":58.89,"dailyLimitRemaining":58.89,"monthlyLimit":176.68,"monthlyLimitRemaining":176.68},{"type":"buy_gbp_bank_transfer","dailyLimit":58.89,"dailyLimitRemaining":58.89,"monthlyLimit":176.68,"monthlyLimitRemaining":176.68},{"type":"buy_sepa_bank_transfer","dailyLimit":58.89,"dailyLimitRemaining":58.89,"monthlyLimit":176.68,"monthlyLimitRemaining":176.68}],"verificationLevels":[{"name":"Level 1","requirements":[{"completed":true,"identifier":"identity_verification"}],"completed":true},{"name":"Level 2","requirements":[{"completed":false,"identifier":"document_verification"},{"completed":false,"identifier":"face_match_verification","showLivenessCheck":true}],"completed":false},{"name":"Level 3","requirements":[{"completed":false,"identifier":"address_verification"}],"completed":false}],"limitIncreaseEligible":true}';
test('requests where amount is slightly higher than 50 EUR lead to document upload (extended KYC)', async () => {
  setFetchReturn(limitAPISampleResponse);
  const highAmount = await getNextKYCStep(
    {
      PK: 'tx#123',
      paymentMethod: 'creditCard',
      fiatAmount: 60,
    } as any,
    'sumAuthToken',
    { address: { country: 'ESP' } } as any
  );
  expect(highAmount.type).toBe('pickOne');
  expect(highAmount).toMatchInlineSnapshot(`
    Object {
      "options": Array [
        Object {
          "acceptedContentTypes": Array [
            "image/jpeg",
            "image/png",
            "application/pdf",
          ],
          "humanName": "Passport - Front",
          "type": "file",
          "url": "https://upload.onramper.com/Moonpay/passport/123/ESP/sumAuthToken/front",
        },
        Object {
          "acceptedContentTypes": Array [
            "image/jpeg",
            "image/png",
            "application/pdf",
          ],
          "humanName": "Driver's License - Front",
          "type": "file",
          "url": "https://upload.onramper.com/Moonpay/driving_licence/123/ESP/sumAuthToken/front",
        },
        Object {
          "acceptedContentTypes": Array [
            "image/jpeg",
            "image/png",
            "application/pdf",
          ],
          "humanName": "National Identity Card - Front",
          "type": "file",
          "url": "https://upload.onramper.com/Moonpay/national_identity_card/123/ESP/sumAuthToken/front",
        },
        Object {
          "acceptedContentTypes": Array [
            "image/jpeg",
            "image/png",
            "application/pdf",
          ],
          "humanName": "Residence Card - Front",
          "type": "file",
          "url": "https://upload.onramper.com/Moonpay/residence_permit/123/ESP/sumAuthToken/front",
        },
      ],
      "type": "pickOne",
    }
  `);
  setFetchReturn(limitAPISampleResponse);
  const lowAmount = await getNextKYCStep(
    {
      PK: 'tx#123',
      paymentMethod: 'creditCard',
      fiatAmount: 40,
    } as any,
    '',
    { address: { country: 'ESP' } } as any
  );
  expect(lowAmount.type).toBe('iframe');
  expect(lowAmount).toMatchInlineSnapshot(`
    Object {
      "type": "iframe",
      "url": "https://sandbox.onramper.com?customerId=undefined&customerAddress=eyJjb3VudHJ5IjoiRVNQIn0=&transactionId=123",
    }
  `);
});
