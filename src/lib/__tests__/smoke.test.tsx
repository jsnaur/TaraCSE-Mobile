import { render, screen } from '@testing-library/react-native';

import Index from '@/app/index';

test('root screen renders the app name', async () => {
  await render(<Index />);
  expect(screen.getByText('TaraCSE')).toBeTruthy();
});
