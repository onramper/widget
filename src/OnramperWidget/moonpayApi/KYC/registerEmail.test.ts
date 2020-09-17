import registerEmail from "./registerEmail";
import { simulateSingleFetchFailure } from "../utils/fetch";
import ddb from "../utils/dynamodb";
jest.mock("../utils/fetch");

function call(
  country: string = "es",
  address: string = "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2"
) {
  return registerEmail(
    "123",
    100,
    "EUR",
    "BTC",
    "creditCard",
    "wassup@sup.com",
    address,
    country
  );
}

beforeAll(() => {
  Date.now = jest.fn(() => new Date(Date.UTC(2020, 1, 1, 1)).valueOf());
});

test("snapshot db state", async () => {
  await call();
  expect(await ddb.scan()).toMatchInlineSnapshot(`
    Array [
      Object {
        "PK": "tx#123",
        "SK": "create",
        "Timestamp": 1580518800000,
        "country": "es",
        "cryptoCurrency": "BTC",
        "cryptocurrencyAddress": "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
        "fiatAmount": 100,
        "fiatCurrency": "EUR",
        "paymentMethod": "creditCard",
      },
    ]
  `);
});

test("error is thrown if crypto address is invalid", async () => {
  await expect(call("es", "xxx")).rejects.toThrowErrorMatchingInlineSnapshot(
    `"The provided cryptocurrency address is not valid."`
  );
});

test("moonpay errors are properly propagated", async () => {
  simulateSingleFetchFailure(
    null,
    `{"errors":[{"target":{"email":"a@b.c"},"value":"a@b.c","property":"email","children":[],"constraints":{"isEmail":"Email seems to be invalid, make sure it’s written correctly and try again"}}],"message":"Invalid body, check 'errors' property for more info.","type":"BadRequestError"}`
  );
  await expect(call()).rejects.toThrowErrorMatchingInlineSnapshot(
    `"The provided email has been rejected."`
  );
});

test("if user is in the US we also return the zerohash agreement", async () => {
  expect(((await call("us")) as any).data[1].terms).toContainEqual({
    url: "https://buy.moonpay.io/ZeroHashLLCServicesAgreement.pdf",
    humanName: "Zero Hash LLC Services Agreement",
  });
});

test("snapshot normal response", async () => {
  expect(await call()).toMatchInlineSnapshot(`
    Object {
      "data": Array [
        Object {
          "humanName": "Email verification code",
          "name": "verifyEmailCode",
          "type": "string",
        },
        Object {
          "name": "termsOfUse",
          "terms": Array [
            Object {
              "humanName": "Onramper's Terms Of Use",
              "url": "https://onramper.com/terms-of-use/",
            },
            Object {
              "humanName": "Onramper's Privacy Policy",
              "url": "https://onramper.com/privacy-policy/",
            },
            Object {
              "humanName": "Moonpay's Terms Of Use",
              "url": "https://moonpay.io/terms_of_use/",
            },
            Object {
              "humanName": "Moonpay's Privacy Policy",
              "url": "https://moonpay.io/privacy_policy/",
            },
          ],
          "type": "boolean",
        },
      ],
      "type": "form",
      "url": "https://api.onramper.com/transaction/Moonpay/verifyEmail/WyIxMjMiLCJ3YXNzdXBAc3VwLmNvbSJd",
    }
  `);
});
