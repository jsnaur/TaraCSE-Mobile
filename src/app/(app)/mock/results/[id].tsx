import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function MockResults() {
  return (
    <PlaceholderScreen
      title="Results"
      note="Staged score reveal, pass/fail at 80%, per-subject breakdown, KOT reaction."
      links={[
        { label: 'Review answers', href: '/mock/review/demo' },
        { label: 'Back to Mock', href: '/mock' },
      ]}
      back="close"
    />
  );
}
