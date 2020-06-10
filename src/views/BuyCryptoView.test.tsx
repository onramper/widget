import React from 'react';
import { render } from '@testing-library/react';
import BuyCryptoView from './BuyCryptoView';

test('renders header', () => {
  const { getByText } = render(<BuyCryptoView />);
  const linkElement = getByText(/Buy crypto/);
  expect(linkElement).toBeInTheDocument();
});
