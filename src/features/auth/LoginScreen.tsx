import { router } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Kot } from '@/components/kot/Kot';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useFakeRequest } from '@/hooks/useFakeRequest';
import { emailError } from '@/lib/credentials';
import { useSession } from '@/state/session';
import { spacing } from '@/theme/tokens';

import { AuthScaffold } from './AuthScaffold';
import { FormNotice } from './FormNotice';

export function LoginScreen() {
  const { dispatch } = useSession();
  const { loading, run } = useFakeRequest();
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [failures, setFailures] = useState(0);

  const check = {
    email: emailError(email),
    password: password ? undefined : 'Enter your password.',
  };
  const errors: Partial<typeof check> = submitted ? check : {};

  const submit = () => {
    setSubmitted(true);
    if (check.email || check.password) return;
    run(() => {
      // Dev builds only: an address starting with "wrong" shows the mismatch state.
      if (__DEV__ && email.trim().toLowerCase().startsWith('wrong')) setFailures((n) => n + 1);
      else dispatch({ type: 'signIn' });
    });
  };

  return (
    <AuthScaffold
      title="Log in"
      subtitle="Good to see you again."
      aside={<Kot mood="hello" size={88} decorative />}
      action={{ label: 'Log in', loading, onPress: submit }}
      link={{ label: 'New here? Create an account', onPress: () => router.replace('/register') }}
    >
      {failures > 0 ? (
        <FormNotice
          attempt={failures}
          message="That email and password don't match."
          action={{ label: 'Reset your password', onPress: () => router.push('/forgot-password') }}
        />
      ) : null}
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <View>
        <TextField
          ref={passwordRef}
          label="Password"
          password
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
        <Button
          label="Forgot password?"
          variant="ghost"
          style={styles.forgot}
          onPress={() => router.push('/forgot-password')}
        />
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  forgot: { alignSelf: 'flex-end', marginRight: -spacing.lg },
});
