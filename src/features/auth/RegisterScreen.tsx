import { router } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { TextField } from '@/components/ui/TextField';
import { useFakeRequest } from '@/hooks/useFakeRequest';
import { emailError, passwordError } from '@/lib/credentials';
import { useSession } from '@/state/session';
import { spacing } from '@/theme/tokens';

import { AuthScaffold } from './AuthScaffold';
import { ConsentRow } from './ConsentRow';
import { PasswordStrength } from './PasswordStrength';

export function RegisterScreen() {
  const { dispatch } = useSession();
  const { loading, run } = useFakeRequest();
  const emailRef = useRef<ComponentRef<typeof TextInput>>(null);
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const check = {
    name: name.trim() ? undefined : 'Enter your name.',
    email: emailError(email),
    password: passwordError(password),
    agreed: agreed ? undefined : 'Agree to the terms to create your account.',
  };
  const errors: Partial<typeof check> = submitted ? check : {};

  const submit = () => {
    setSubmitted(true);
    if (Object.values(check).some(Boolean)) return;
    run(() => dispatch({ type: 'register', name: name.trim(), email: email.trim() }));
  };

  return (
    <AuthScaffold
      title="Create your account"
      subtitle="It takes a minute. Then we'll set up your study plan."
      action={{ label: 'Create account', loading, onPress: submit }}
      link={{ label: 'I have an account', onPress: () => router.replace('/login') }}
    >
      <TextField
        label="Your name"
        value={name}
        onChangeText={setName}
        error={errors.name}
        placeholder="Juan Dela Cruz"
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => emailRef.current?.focus()}
      />
      <TextField
        ref={emailRef}
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
      <TextField
        ref={passwordRef}
        label="Password"
        password
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
      />
      <PasswordStrength value={password} />
      <View style={styles.consent}>
        <ConsentRow checked={agreed} onToggle={() => setAgreed((v) => !v)} error={errors.agreed} />
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  consent: { marginTop: spacing.xs },
});
