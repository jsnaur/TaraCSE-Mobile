import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function DuelMatch() {
  return (
    <PlaceholderScreen
      title="Duel"
      note="Live duel: both players' progress, 10 questions, timer per question. No tab bar."
      links={[{ label: 'See result', href: '/duel/result/demo' }]}
      back="close"
    />
  );
}
