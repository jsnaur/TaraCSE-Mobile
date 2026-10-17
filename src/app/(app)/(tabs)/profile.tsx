import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';
import { useSession } from '@/state/session';

export default function Profile() {
  const { dispatch } = useSession();
  return (
    <PlaceholderScreen
      tabRoot
      title="Profile"
      note="Account summary and plan badge (stated, never sold)."
      links={[
        { label: 'Settings', href: '/settings' },
        { label: 'Your plan', href: '/plan' },
        { label: 'Send feedback', href: '/suggestions' },
        { label: 'Terms of use', href: '/terms' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Delete account', href: '/delete-account' },
      ]}
      actions={[{ label: 'Sign out', onPress: () => dispatch({ type: 'signOut' }) }]}
    />
  );
}
