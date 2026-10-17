import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LOCKED_COPY, LockedItem } from '@/components/ui/LockedItem';
import { ThemeProvider } from '@/theme/ThemeProvider';

const metrics = {
  frame: { x: 0, y: 0, width: 360, height: 780 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

test('locked copy is the exact Play-safe sentence', () => {
  expect(LOCKED_COPY).toBe('Not included in your current plan.');
});

test('a locked item states the plan and offers only "Got it"', async () => {
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <ThemeProvider>
        <LockedItem title="Full-length simulation" />
      </ThemeProvider>
    </SafeAreaProvider>,
  );
  await fireEvent.press(screen.getByRole('button', { name: /Full-length simulation/ }));
  expect(screen.getAllByText(LOCKED_COPY).length).toBeGreaterThan(0);
  expect(screen.getByRole('button', { name: 'Got it' })).toBeTruthy();
  expect(screen.queryByText(/upgrade|buy|subscribe|price|₱|website/i)).toBeNull();
});
