import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function DuelMatching() {
  return (
    <PlaceholderScreen
      title="Finding a match"
      note="Matchmaking animation, cancel."
      links={[{ label: 'Match found', href: '/duel/match/demo' }]}
      back="close"
    />
  );
}
