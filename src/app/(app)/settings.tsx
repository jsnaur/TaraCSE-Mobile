import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function Settings() {
  return (
    <PlaceholderScreen
      title="Settings"
      note="Theme, exam level, exam date, daily goal, reminders, account."
      links={[{ label: 'Delete account', href: '/delete-account' }]}
    />
  );
}
