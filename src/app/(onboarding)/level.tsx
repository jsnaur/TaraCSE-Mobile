import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function Level() {
  return (
    <PlaceholderScreen
      title="Your exam level"
      note="Professional or Sub-professional. Sets which subjects appear (Analytical vs Clerical)."
      back={false}
      links={[{ label: 'Continue', href: '/exam-date' }]}
    />
  );
}
