import verifyEmail from "./verifyEmail";
import { setFetchReturn } from "../utils/fetch";
import { getTxJwtToken } from "./dynamoTxs";
jest.mock("../utils/fetch");

test("verifyEmail stores the right token", async () => {
  setFetchReturn(
    '{"csrfToken":"PFIAFM5YLznimwLCHYhglcotrwcVlv","customer":{"id":"46a1579d-2875-463c-afa4-90e1eab88622","createdAt":"2020-08-06T06:27:02.272Z","updatedAt":"2020-08-06T07:13:52.348Z","firstName":null,"lastName":null,"email":"reegan.gracen@intrees.org","walletAddress":null,"phoneNumber":null,"isPhoneNumberVerified":false,"dateOfBirth":null,"liveMode":false,"defaultCurrencyId":"71435a8d-211c-4664-a59e-2a5361a6c5a7","address":{"street":null,"subStreet":null,"town":null,"postCode":null,"state":null,"country":null}}}',
    new Map([
      [
        "set-cookie",
        "__cfduid=da493e408baaaf5139cfe0f92bd7d63121596702807; expires=Sat, 05-Sep-20 08:33:27 GMT; path=/; domain=.moonpay.io; HttpOnly; SameSite=Lax; Secure, customerToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiIwYzFmODM2Yi0wMmU4LTQ3MDItYTczOS02OGQwOTMwNDk3MGIiLCJjc3JmVG9rZW4iOiJJUXJIdkRiOTAyVUhWZEJERTRZd1FMalVUMHdQRnFRIiwiY3VzdG9tZXJJZCI6IjFkYzA0MzM5LWExNjQtNGExYy1hY2U4LWQ2NGI3ZTAwYjlkNyIsInNlc3Npb25JZCI6IjIxMzJkOTc2LWYxNGEtNGM5Zi1iMjQwLTMxZDJmYzA1Y2JlZCIsImlhdCI6MTU5NjcwMjgwNywiZXhwIjoxNTk3MzA3NjA3fQ.8PkpQdeddAw24yWO5pVaLoWMeh4oAcwmTXhNf5WkaUw; Max-Age=604800; Path=/; Expires=Thu, 13 Aug 2020 08:33:27 GMT; HttpOnly; Secure; SameSite=None",
      ],
    ])
  );
  await verifyEmail("123", "a@b.c", "1234", "es");
  expect((await getTxJwtToken("123")).jwtToken).toMatchInlineSnapshot(
    `"not needed, this is done through cookies"`
  );
});
