import { Redirect } from 'expo-router';

import { useSession } from '@/state/session';

export default function Index() {
  const { status } = useSession();
  if (status === 'signedIn') return <Redirect href="/home" />;
  if (status === 'onboarding') return <Redirect href="/level" />;
  return <Redirect href="/welcome" />;
}
