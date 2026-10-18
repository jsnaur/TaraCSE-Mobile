import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function MockSetup() {
  return (
    <PlaceholderScreen
      title="New mock exam"
      note="Choose: full CSE simulation (half or full length) or a focused mock on one subject."
      links={[
        { label: 'Full simulation', href: '/mock/exam/demo' },
        { label: 'Focused: Verbal Ability', href: '/mock/topics/verbal' },
        { label: 'Focused: Numerical Ability', href: '/mock/topics/numerical' },
      ]}
    />
  );
}
