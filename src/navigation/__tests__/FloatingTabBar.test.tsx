import { fireEvent, renderRouter, screen } from 'expo-router/testing-library';
import { Text } from 'react-native';

import TabsLayout from '@/app/(app)/(tabs)/_layout';
import { ThemeProvider } from '@/theme/ThemeProvider';

const stub = (label: string) =>
  function Stub() {
    return <Text>{label}</Text>;
  };

const metrics = {
  frame: { x: 0, y: 0, width: 360, height: 780 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

async function renderTabs() {
  return renderRouter(
    {
      '(tabs)/_layout': TabsLayout,
      '(tabs)/home': stub('Home screen'),
      '(tabs)/practice': stub('Practice screen'),
      '(tabs)/mock': stub('Mock screen'),
      '(tabs)/progress': stub('Progress screen'),
      '(tabs)/profile': stub('Profile screen'),
    },
    {
      initialUrl: '/home',
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      // Safe-area metrics so the bar can read insets in the test renderer.
      ...({ initialMetrics: metrics } as object),
    },
  );
}

test('renders five labelled tabs', async () => {
  await renderTabs();
  const tabs = screen.getAllByRole('tab');
  expect(tabs).toHaveLength(5);
  for (const name of ['Home', 'Practice', 'Mock', 'Progress', 'Profile']) {
    expect(screen.getByRole('tab', { name })).toBeTruthy();
  }
});

test('marks the active tab selected and switches on press', async () => {
  const result = await renderTabs();
  expect(screen.getByRole('tab', { name: 'Home' }).props.accessibilityState).toMatchObject({
    selected: true,
  });
  await fireEvent.press(screen.getByRole('tab', { name: 'Progress' }));
  expect(result.getPathname()).toBe('/progress');
  expect(screen.getByRole('tab', { name: 'Progress' }).props.accessibilityState).toMatchObject({
    selected: true,
  });
});
