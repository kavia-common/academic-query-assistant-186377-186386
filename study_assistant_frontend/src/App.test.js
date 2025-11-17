import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app header, chat input and send button', () => {
  render(<App />);
  // Header brand
  expect(screen.getByText('Academic Query Assistant')).toBeInTheDocument();
  // Chat textarea and send button
  expect(screen.getByLabelText('Your question')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
});
