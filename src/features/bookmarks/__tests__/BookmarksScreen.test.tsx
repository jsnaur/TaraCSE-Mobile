import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { UNDO_MS } from '@/components/ui/UndoBar';
import { BookmarksScreen } from '@/features/bookmarks/BookmarksScreen';
import { FAKE_LATENCY } from '@/hooks/useFakeRequest';
import { StudyProvider, initialStudy, type StudyState } from '@/state/study';
import { ThemeProvider } from '@/theme/ThemeProvider';

const metrics = {
  frame: { x: 0, y: 0, width: 360, height: 780 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

async function renderWith(initial: StudyState) {
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <ThemeProvider>
        <StudyProvider initial={initial}>
          <BookmarksScreen />
        </StudyProvider>
      </ThemeProvider>
    </SafeAreaProvider>,
  );
  expect(screen.getByLabelText('Loading your bookmarks')).toBeTruthy();
  await act(() => jest.advanceTimersByTime(FAKE_LATENCY));
}

const two: StudyState = { ...initialStudy, bookmarks: ['q-percent-1', 'q-grammar-2'] };

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('shows a skeleton, then the saved questions with subject chips', async () => {
  await renderWith(two);
  expect(screen.getByText(/A printer costs/)).toBeTruthy();
  expect(screen.getByText('Choose the correct sentence.')).toBeTruthy();
  expect(screen.getByRole('checkbox', { name: 'All 2' })).toBeTruthy();
});

test('removing a bookmark can be undone in place', async () => {
  await renderWith(two);
  const [first] = screen.getAllByRole('button', { name: 'Remove bookmark' });
  await fireEvent.press(first!);
  expect(screen.queryByText(/A printer costs/)).toBeNull();
  await fireEvent.press(screen.getByRole('button', { name: 'Undo' }));
  expect(screen.getByText(/A printer costs/)).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Undo' })).toBeNull();
});

test('the undo window closes on its own', async () => {
  await renderWith(two);
  const [first] = screen.getAllByRole('button', { name: 'Remove bookmark' });
  await fireEvent.press(first!);
  await act(() => jest.advanceTimersByTime(UNDO_MS));
  expect(screen.queryByRole('button', { name: 'Undo' })).toBeNull();
  expect(screen.queryByText(/A printer costs/)).toBeNull();
});

test('an empty list points back to practice', async () => {
  await renderWith(initialStudy);
  expect(screen.getByText('Nothing saved yet')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Go to Practice' })).toBeTruthy();
});
