import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function MockExam() {
  return (
    <PlaceholderScreen
      title="Mock exam"
      note="Timer (amber then red), question navigator sheet, flag, submit confirm, leave warning. No tab bar."
      links={[{ label: 'Submit exam', href: '/mock/results/demo' }]}
      back="close"
    />
  );
}
