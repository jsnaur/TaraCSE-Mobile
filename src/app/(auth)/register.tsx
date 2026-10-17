import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';
import { useSession } from '@/state/session';

export default function Register() {
  const { dispatch } = useSession();
  return (
    <PlaceholderScreen
      title="Create account"
      note="Name, email, password with strength hint, terms and privacy acceptance. Ends in onboarding."
      links={[
        { label: 'Terms of use', href: '/welcome' },
        { label: 'I have an account', href: '/login' },
      ]}
      actions={[
        {
          label: 'Create account',
          onPress: () =>
            dispatch({ type: 'register', name: 'Andrea Santos', email: 'andrea@example.com' }),
        },
      ]}
    />
  );
}
