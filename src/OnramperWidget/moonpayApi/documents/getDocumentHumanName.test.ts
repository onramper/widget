import getDocumentHumanName from './getDocumentHumanName';

test('getDocumentHumanName', () => {
  expect(getDocumentHumanName('driving_licence')).toBe("Driver's License");
});
