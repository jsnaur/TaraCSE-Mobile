import { Redirect } from 'expo-router';

import { DevMenuScreen } from '@/features/dev/DevMenuScreen';

export default function DevMenu() {
  // Belt and braces: the root stack already hides this route outside __DEV__.
  if (!__DEV__) return <Redirect href="/" />;
  return <DevMenuScreen />;
}
