import StepError from './StepError';

test('Message provided is not modified', () => {
  expect(new StepError('sumthing', null).message).toBe('sumthing');
});
