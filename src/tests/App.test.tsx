import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

test('renders header', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Buy crypto/);
  expect(linkElement).toBeInTheDocument();
});
