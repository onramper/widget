import normalizeDocuments from './normalizeDocuments';

test('normalizeDocuments', () => {
  expect(
    normalizeDocuments([
      'passport',
      'driving_licence',
      'national_identity_card',
    ])
  ).toEqual(['passport', 'driverLicense', 'nationalIdentityCard']);
});
