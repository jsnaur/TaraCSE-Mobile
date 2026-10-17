import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function CheckEmail() {
  return (
    <PlaceholderScreen
      title="Check your email"
      note="Sent state with KOT, open mail hint, resend timer."
      links={[
        { label: 'I have a reset code', href: '/reset-password' },
        { label: 'Back to log in', href: '/login' },
      ]}
    />
  );
}
