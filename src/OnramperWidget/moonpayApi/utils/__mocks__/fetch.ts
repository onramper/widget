import FetchError from '../../errors/FetchError';

const fetchMock = jest.fn() as jest.Mock<typeof fetch>;

const apiResponses = {
  'https://api.moonpay.io/v3/files/s3_signed_request':
    '{"key":"1596652108131","signedRequest":"https://moonpay-documents.s3-accelerate.amazonaws.com/1596652108131?AWSAccessKeyId=AKIATXOOZY3A25LUDLWI&Content-Type=image%2Fjpeg&Expires=1596652708&Signature=9paR%2BwC5VwMLcpJI5mTXwFnorZo%3D&x-amz-server-side-encryption=AES256"}',
  'https://api.moonpay.io/v3/transactions':
    '{"baseCurrencyAmount":100,"feeAmount":4.99,"extraFeeAmount":0,"areFeesIncluded":false,"status":"waitingAuthorization","walletAddress":"0x9c76ae45c36a4da3801a5ba387bbfa3c073ecae2","returnUrl":"https://sandbox.onramper.dev/finished.html","baseCurrencyId":"71435a8d-211c-4664-a59e-2a5361a6c5a7","currencyId":"8d305f63-1fd7-4e01-a220-8445e591aec4","customerId":"b06133f5-e4bc-4295-8c86-4bc0a882b653","eurRate":1,"usdRate":1.179586,"gbpRate":0.90325,"quoteCurrencyAmount":null,"walletAddressTag":null,"cryptoTransactionId":null,"failureReason":null,"redirectUrl":"https://api.moonpay.io/v3/device_authorization?transactionId=70590bd8-0e78-40e1-9086-137d57c2d048&sid=bcc5563c-47b9-4c69-834d-a5232c0a2d46","widgetRedirectUrl":null,"bankTransferReference":null,"cardId":"a9660b8c-97e6-49d9-b265-307b058e8ce2","bankAccountId":null,"bankDepositInformation":null,"externalTransactionId":null,"id":"70590bd8-0e78-40e1-9086-137d57c2d048","createdAt":"2020-08-24T18:59:27.862Z","updatedAt":"2020-08-24T18:59:27.862Z"}',
  'https://api.moonpay.io/v3/customers/email_login':
    '{"preAuthenticated":true,"showTermsOfUse":true}',
};

export function setFetchReturn(data: string, headers?: Map<string, string>) {
  fetchMock.mockImplementationOnce(
    jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(JSON.parse(data)),
      headers: {
        get: (k: string) => headers?.get(k),
      },
    })
  );
}

const singleFailUrls: string[] = [];

fetchMock.mockImplementation(
  jest.fn().mockImplementation((url: string) => {
    for (const [urlStart, response] of Object.entries(apiResponses)) {
      if (url.startsWith(urlStart)) {
        const indexFailure = singleFailUrls.findIndex((s) => url.startsWith(s));
        if (indexFailure !== -1) {
          singleFailUrls.splice(indexFailure, 1);
          throw new FetchError({});
        }
        return Promise.resolve({
          text: jest.fn().mockResolvedValue(response),
          json: jest.fn().mockImplementation(() => JSON.parse(response)),
        });
      }
    }
    throw new Error(`url ${url} not in the list of mocked API results`);
  })
);

export function simulateSingleFetchFailure(
  url: string | null = null,
  response?: string
) {
  if (url === null) {
    fetchMock.mockImplementationOnce(
      jest.fn().mockImplementation(()=>{
        throw new FetchError(JSON.parse(response ?? '{}'));
      })
    );
  } else {
    singleFailUrls.push(url);
  }
}

export default fetchMock;
