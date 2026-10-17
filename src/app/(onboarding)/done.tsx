import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';
import { useSession } from '@/state/session';

export default function Done() {
  const { dispatch } = useSession();
  return (
    <PlaceholderScreen
      title="You're all set"
      note="KOT celebration, summary of choices, enter the app."
      actions={[
        {
          label: 'Start reviewing',
          onPress: () =>
            dispatch({
              type: 'completeOnboarding',
              patch: { examDate: '2027-03-08', dailyGoal: 30 },
            }),
        },
      ]}
    />
  );
}
