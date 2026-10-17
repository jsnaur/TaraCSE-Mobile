import { router } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import { TextInput } from 'react-native';

import { TextField } from '@/components/ui/TextField';
import { useToast } from '@/components/ui/Toast';
import { useFakeRequest } from '@/hooks/useFakeRequest';
import { passwordError } from '@/lib/credentials';
import { haptics } from '@/lib/haptics';

import { AuthScaffold } from './AuthScaffold';
import { PasswordStrength } from './PasswordStrength';

/**
 * Reached from the link in the reset email. Prototype: no token is read. Once real auth
 * lands this screen must verify the recovery token first (see docs/SECURITY.md).
 */
export function ResetPasswordScreen() {
  const toast = useToast();
  const { loading, run } = useFakeRequest();
  const confirmRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const check = {
    password: passwordError(password),
    confirm: !confirm
      ? 'Type the password again.'
      : confirm !== password
        ? "The passwords don't match."
        : undefined,
  };
  const errors: Partial<typeof check> = submitted ? check : {};

  const submit = () => {
    setSubmitted(true);
    if (check.password || check.confirm) return;
    run(() => {
      haptics.success();
      toast('Password saved. Log in with it now.', 'success');
      router.dismissTo('/login');
    });
  };

  return (
    <AuthScaffold
      title="Set a new password"
      subtitle="Use one you haven't used for this account before."
      action={{ label: 'Save password', loading, onPress: submit }}
    >
      <TextField
        label="New password"
        password
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => confirmRef.current?.focus()}
      />
      <PasswordStrength value={password} />
      <TextField
        ref={confirmRef}
        label="Type it again"
        password
        value={confirm}
        onChangeText={setConfirm}
        error={errors.confirm}
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={submit}
      />
    </AuthScaffold>
  );
}
