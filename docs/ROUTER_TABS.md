# Expo Router tabs with a custom bar (SDK 58)

Confirmed on 2026-10-18 against `expo-router@58.0.23` (Expo SDK 58.0.14) with a
throwaway spike: a two-tab layout with a custom bar passed `npm run typecheck`, an
`expo-router/testing-library` test that pressed a tab and asserted the pathname, and
`npx expo export --platform android`. The spike was then deleted.

## What to use

```tsx
import { Tabs, type BottomTabBarProps } from 'expo-router/js-tabs';

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      {/* ... */}
    </Tabs>
  );
}
```

- Import `Tabs` from **`expo-router/js-tabs`**. `import { Tabs } from 'expo-router'` still
  works in SDK 58 but is marked `@deprecated` in favor of `expo-router/js-tabs`.
- Do **not** use `NativeTabs` (`expo-router/native-tabs`): it renders the platform tab bar
  (Material 3 on Android) and cannot host our floating pill.
- `withLayoutContext` is not needed. SDK 58's `integrateWithRouter` is only for wrapping a
  third-party navigator; the built-in JS `Tabs` already accepts `tabBar`.
- React Navigation's bottom-tabs code is vendored inside `expo-router`
  (`expo-router/build/react-navigation/bottom-tabs`). There is no separate
  `@react-navigation/bottom-tabs` dependency, so never install one.

## Props the bar receives (`BottomTabBarProps`)

The shape changed from React Navigation 7. There is **no `navigation` prop**.

| Prop            | Type                                                  | Use                                                                                                                                             |
| --------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `state`         | `{ index: number; routes: { key; name; params? }[] }` | Active index and route list                                                                                                                     |
| `descriptors`   | `Record<routeKey, { options, ... }>`                  | Per-tab `options` (`title`, `tabBarStyle`, `tabBarAccessibilityLabel`, ...). Indexing returns `T \| undefined` under `noUncheckedIndexedAccess` |
| `emitter`       | event emitter                                         | Emit `tabPress` / `tabLongPress`                                                                                                                |
| `navigateToTab` | `(routeKey: string) => void`                          | Switch tab                                                                                                                                      |
| `insets`        | `EdgeInsets`                                          | Safe-area insets, use `insets.bottom` to sit above the Android nav bar                                                                          |

Press handling, matching the built-in bar:

```tsx
const onPress = () => {
  const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
  if (!focused && !event.defaultPrevented) navigateToTab(route.key);
};
const onLongPress = () => emitter.emit({ type: 'tabLongPress', target: route.key });
```

## Hiding the bar

The tab view reads `descriptors[activeRoute.key].options.tabBarStyle` for its wrapper.
Full-focus screens (practice session, mock exam, duel) are **stacked outside `(tabs)`**
in `src/app/(app)/`, so the bar is not on screen there at all. For a tab root that must
hide the bar, set `options={{ tabBarStyle: { display: 'none' } }}` and have
`FloatingTabBar` return `null` when the active descriptor's `tabBarStyle` has
`display: 'none'`, because a custom bar is responsible for its own rendering.

## Testing

```tsx
import { fireEvent, renderRouter, screen } from 'expo-router/testing-library';

const result = await renderRouter(
  { '(tabs)/_layout': TabsLayout, '(tabs)/home': Home, '(tabs)/practice': Practice },
  { initialUrl: '/home' },
);
await fireEvent.press(screen.getAllByRole('tab')[1]!);
expect(result.getPathname()).toBe('/practice');
```

- Import `screen` / `fireEvent` from `expo-router/testing-library`, not directly from
  `@testing-library/react-native`, when testing routes.
- `@testing-library/react-native@14` is async: `await render(...)` and
  `await fireEvent.press(...)`. Without `await` the navigation state has not updated
  when the assertion runs.
