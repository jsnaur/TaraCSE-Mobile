import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';

export default function Maintenance() {
  return (
    <PlaceholderScreen
      title="We'll be right back"
      note="KOT, short message, retry."
      links={[{ label: 'Try again', href: '/' }]}
    />
  );
}
