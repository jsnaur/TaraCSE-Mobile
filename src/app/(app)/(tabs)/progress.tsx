import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function Progress() {
  return (
    <PlaceholderScreen
      tabRoot
      title="Progress"
      note="Accuracy trend, subject and topic mastery, weak spots, streak."
      links={[
        { label: 'Achievements', href: '/achievements' },
        { label: 'Leaderboard', href: '/leaderboard' },
      ]}
    />
  );
}
