import { router } from 'expo-router';

import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';

export default function NotFound() {
  return (
    <Screen>
      <EmptyState
        mood="thinking"
        title="This page isn't here"
        message="The link may be old. Let's get you back on track."
        actionLabel="Go home"
        onAction={() => router.replace('/')}
      />
    </Screen>
  );
}
