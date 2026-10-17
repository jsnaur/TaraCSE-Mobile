import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function ForgotPassword() {
  return (
    <PlaceholderScreen
      title="Forgot password"
      note="Email field, send link."
      links={[{ label: 'Send reset link', href: '/check-email' }]}
    />
  );
}
