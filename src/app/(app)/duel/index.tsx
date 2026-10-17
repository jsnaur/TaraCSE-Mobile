import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function DuelLobby() {
  return (
    <PlaceholderScreen
      title="Quiz Duel"
      note="Pick coverage (one subject or Mixed). No topics. Find a match or challenge a friend with a code."
      links={[{ label: 'Find a match', href: '/duel/matching' }]}
    />
  );
}
