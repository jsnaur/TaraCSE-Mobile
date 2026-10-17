import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function PracticeSession() {
  return (
    <PlaceholderScreen
      title="Practice"
      note="Question card, lettered choices, check, feedback, explanation sheet with report flow, bookmark, end confirm. No tab bar."
      links={[{ label: 'Finish and review', href: '/practice/review/demo' }]}
      back="close"
    />
  );
}
