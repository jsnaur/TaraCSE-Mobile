import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function PracticeReview() {
  return (
    <PlaceholderScreen
      title="Review"
      note="Answered list, filter correct/wrong, expand for explanation."
      links={[{ label: 'Back to Practice', href: '/practice' }]}
    />
  );
}
