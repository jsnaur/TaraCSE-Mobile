import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function DuelResult() {
  return (
    <PlaceholderScreen
      title="Duel result"
      note="Win/lose, score comparison, XP earned, rematch."
      links={[{ label: 'Back to Home', href: '/home' }]}
      back="close"
    />
  );
}
