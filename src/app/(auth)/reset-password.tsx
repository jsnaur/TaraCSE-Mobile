import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function ResetPassword() {
  return (
    <PlaceholderScreen
      title="New password"
      note="New password + confirm, strength hint."
      links={[{ label: 'Save password', href: '/login' }]}
    />
  );
}
