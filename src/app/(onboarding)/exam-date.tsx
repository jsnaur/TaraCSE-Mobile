import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function ExamDate() {
  return (
    <PlaceholderScreen
      title="Exam date"
      note="Target exam date picker. Feeds the Home countdown."
      links={[{ label: 'Continue', href: '/daily-goal' }]}
    />
  );
}
