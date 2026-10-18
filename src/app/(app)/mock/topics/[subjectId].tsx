import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function MockTopics() {
  return (
    <PlaceholderScreen
      title="Choose topics"
      note="Topics for a focused mock, select all, length (15/30/45 min) and item count."
      links={[{ label: 'Start mock', href: '/mock/exam/demo' }]}
    />
  );
}
