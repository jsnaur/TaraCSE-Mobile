import { router } from 'expo-router';
import { useState } from 'react';

import { TextField } from '@/components/ui/TextField';
import { useFakeRequest } from '@/hooks/useFakeRequest';
import { emailError } from '@/lib/credentials';
import { useSession } from '@/state/session';

import { AuthScaffold } from './AuthScaffold';

export function ForgotPasswordScreen() {
  const { dispatch } = useSession();
  const { loading, run } = useFakeRequest();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    setSubmitted(true);
    if (emailError(email)) return;
    run(() => {
      dispatch({ type: 'requestReset', email: email.trim() });
      router.push('/check-email');
    });
  };

  return (
    <AuthScaffold
      title="Forgot your password?"
      subtitle="Enter the email you signed up with. We'll send a link to set a new one."
      action={{ label: 'Send reset link', loading, onPress: submit }}
    >
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={submitted ? emailError(email) : undefined}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="send"
        onSubmitEditing={submit}
      />
    </AuthScaffold>
  );
}
