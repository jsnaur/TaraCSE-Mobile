import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen';
import { useSession } from '@/state/session';

export default function DeleteAccount() {
  const { dispatch } = useSession();
  return (
    <PlaceholderScreen
      title="Delete account"
      note="What gets deleted, type DELETE to confirm, final destructive confirm, scheduled state, sign out."
      actions={[{ label: 'Delete my account', onPress: () => dispatch({ type: 'deleteAccount' }) }]}
    />
  );
}
