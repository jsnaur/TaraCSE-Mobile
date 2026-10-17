import { router } from 'expo-router';

import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function Welcome() {
  return (
    <PlaceholderScreen
      title="Welcome"
      note="Brand moment with KOT. Long-press the logo opens the dev menu (__DEV__ only)."
      back={false}
      links={[
        { label: 'Get started', href: '/register' },
        { label: 'I have an account', href: '/login' },
      ]}
      actions={__DEV__ ? [{ label: 'Dev menu', onPress: () => router.push('/dev-menu') }] : []}
    />
  );
}
