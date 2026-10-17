import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function DailyGoal() {
  return (
    <PlaceholderScreen
      title="Daily goal"
      note="Questions per day: 10 / 20 / 30 / 50."
      links={[{ label: 'Continue', href: '/notifications' }]}
    />
  );
}
