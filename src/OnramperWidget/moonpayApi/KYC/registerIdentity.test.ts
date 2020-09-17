import registerIdentity, { generateDate } from './registerIdentity';
import { createAllMockTxs } from './mockTransactions';
import { simulateSingleFetchFailure } from '../utils/fetch';
jest.mock('../utils/fetch');

function call(country: string) {
  return registerIdentity(
    '123',
    '',
    '',
    { day: 1, month: 1, year: 1991 },
    '',
    '',
    '',
    '',
    country
  );
}

test('generateDate works fine', () => {
  expect(
    generateDate({
      year: 1980,
      month: 1,
      day: 1,
    })
  ).toBe(`1980-01-01T00:00:00.000Z`);
});

test('defined but empty state results in a request for state info', async () => {
  await createAllMockTxs();
  const nextStep = (await call('us')) as any;
  expect(nextStep.url).toContain('identityState');
});

test('moonpay errors are correctly propagated through the API', async () => {
  await createAllMockTxs();
  const doubleError = `{"errors":[{"target":{"firstName":"Juan","lastName":"Surt","dateOfBirth":null,"address":{"street":"Bueno 1","town":"Madrid","postCode":"3453453534","country":"ANI"}},"value":{"street":"Bueno 1","town":"Madrid","postCode":"3453453534","country":"ANI"},"property":"address","children":[{"target":{"street":"Bueno 1","town":"Madrid","postCode":"3453453534","country":"ANI"},"value":"ANI","property":"country","children":[],"constraints":{"isISO31661Alpha3":"country must be a valid ISO 3166-1 alpha-3 country code"}}]},{"target":{"firstName":"Juan","lastName":"Surt","dateOfBirth":null,"address":{"street":"Bueno 1","town":"Madrid","postCode":"3453453534","country":"ANI"}},"value":null,"property":"dateOfBirth","children":[],"constraints":{"maxDate":"maximal allowed date for dateOfBirth is Sat Aug 24 2002 21:11:46 GMT+0000 (Coordinated Universal Time)","minDate":"minimal allowed date for dateOfBirth is Tue Aug 24 1920 21:11:46 GMT+0000 (Coordinated Universal Time)","isDate":"dateOfBirth must be a Date instance"}}],"message":"Invalid body, check 'errors' property for more info.","type":"BadRequestError"}`;
  const countryError = `{"errors":[{"target":{"firstName":"Juan","lastName":"Surt","dateOfBirth":null,"address":{"street":"Bueno 1","town":"Madrid","postCode":"3453453534","country":"ANI"}},"value":{"street":"Bueno 1","town":"Madrid","postCode":"3453453534","country":"ANI"},"property":"address","children":[{"target":{"street":"Bueno 1","town":"Madrid","postCode":"3453453534","country":"ANI"},"value":"ANI","property":"country","children":[],"constraints":{"isISO31661Alpha3":"country must be a valid ISO 3166-1 alpha-3 country code"}}]}],"message":"Invalid body, check 'errors' property for more info.","type":"BadRequestError"}`;
  const dateError = `{"errors":[{"target":{"firstName":"Juan","lastName":"Surt","dateOfBirth":null,"address":{"street":"Bueno 1","town":"Madrid","postCode":"3453453534","country":"ANI"}},"value":null,"property":"dateOfBirth","children":[],"constraints":{"maxDate":"maximal allowed date for dateOfBirth is Sat Aug 24 2002 21:11:46 GMT+0000 (Coordinated Universal Time)","minDate":"minimal allowed date for dateOfBirth is Tue Aug 24 1920 21:11:46 GMT+0000 (Coordinated Universal Time)","isDate":"dateOfBirth must be a Date instance"}}],"message":"Invalid body, check 'errors' property for more info.","type":"BadRequestError"}`;
  simulateSingleFetchFailure(null, countryError);
  expect(call('es')).rejects.toMatchInlineSnapshot(
    `[StepError: country must be a valid ISO 3166-1 alpha-3 country code]`
  );
  simulateSingleFetchFailure(null, dateError);
  expect(call('es')).rejects.toMatchInlineSnapshot(
    `[StepError: maximal allowed date for dateOfBirth is Sat Aug 24 2002 21:11:46 GMT+0000 (Coordinated Universal Time), minimal allowed date for dateOfBirth is Tue Aug 24 1920 21:11:46 GMT+0000 (Coordinated Universal Time), dateOfBirth must be a Date instance]`
  );
  simulateSingleFetchFailure(null, doubleError);
  return expect(call('es')).rejects.toMatchInlineSnapshot(
    `[StepError: country must be a valid ISO 3166-1 alpha-3 country code]`
  );
});
