import { replaceAll } from './encodeToken';

test('replaceAll replaces all ocurrences', () => {
  expect(replaceAll('aaaaaaa', 'a', 'b')).toBe('bbbbbbb');
});
