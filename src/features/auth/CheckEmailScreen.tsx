import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { Kot } from '@/components/kot/Kot';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { useSession } from '@/state/session';

import { AuthScaffold } from './AuthScaffold';

const RESEND_AFTER = 30;

function clock(seconds: number): string {
  return `0:${String(seconds).padStart(2, '0')}`;
}

export function CheckEmailScreen() {
  const { resetEmail } = useSession();
  const toast = useToast();
  const [wait, setWait] = useState(RESEND_AFTER);

  useEffect(() => {
    if (wait === 0) return;
    const id = setTimeout(() => setWait((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [wait]);

  const subtitle = (
    <AppText variant="body" tone="muted">
      We sent a link to{' '}
      {resetEmail ? (
        <AppText variant="body" weight="semibold">
          {resetEmail}
        </AppText>
      ) : (
        'your email'
      )}
      . Open it on this phone to set a new password.
    </AppText>
  );

  return (
    <AuthScaffold
      title="Check your email"
      subtitle={subtitle}
      aside={<Kot mood="guide" size={104} decorative />}
      action={{
        label: wait > 0 ? `Send again in ${clock(wait)}` : 'Send the link again',
        variant: 'secondary',
        disabled: wait > 0,
        onPress: () => {
          toast('Sent. Give it a minute to arrive.', 'success');
          setWait(RESEND_AFTER);
        },
      }}
      link={{ label: 'Back to log in', onPress: () => router.dismissTo('/login') }}
    >
      <Card tone="sunken">
        <AppText variant="label" tone="muted">
          Nothing yet? Check your spam folder.
        </AppText>
      </Card>
      {__DEV__ ? (
        <Button
          label="Dev: open the reset link"
          variant="ghost"
          onPress={() => router.push('/reset-password')}
        />
      ) : null}
    </AuthScaffold>
  );
}
