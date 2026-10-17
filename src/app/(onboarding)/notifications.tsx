import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function Notifications() {
  return (
    <PlaceholderScreen
      title="Reminders"
      note="Opt-in UI only: daily reminder time, streak alerts."
      links={[{ label: 'Continue', href: '/done' }]}
    />
  );
}
