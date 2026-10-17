import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';
import { useSession } from '@/state/session';

export default function Login() {
  const { dispatch } = useSession();
  return (
    <PlaceholderScreen
      title="Log in"
      note="Email, password with show/hide, Forgot password. Credentials are ignored."
      links={[{ label: 'Forgot password?', href: '/forgot-password' }]}
      actions={[{ label: 'Log in', onPress: () => dispatch({ type: 'signIn' }) }]}
    />
  );
}
