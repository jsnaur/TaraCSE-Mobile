import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function Mock() {
  return (
    <PlaceholderScreen
      tabRoot
      title="Mock"
      note="Readiness against the 80% passing mark, past attempts, new mock."
      links={[{ label: 'New mock exam', href: '/mock/setup' }]}
    />
  );
}
