/**
 * Form checks for the auth screens. Pure functions so the rules stay identical across
 * register and reset, and so they can be tested without rendering.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function emailError(value: string): string | undefined {
  const email = value.trim();
  if (!email) return 'Enter your email.';
  if (!EMAIL.test(email)) return 'That email looks incomplete. Check it and try again.';
  return undefined;
}

export interface PasswordRule {
  id: 'length' | 'number' | 'case';
  label: string;
  /** Required rules gate the submit button; the rest only raise the strength. */
  required: boolean;
  met: boolean;
}

export const MIN_PASSWORD = 8;

export function passwordRules(value: string): PasswordRule[] {
  return [
    {
      id: 'length',
      label: `${MIN_PASSWORD} or more characters`,
      required: true,
      met: value.length >= MIN_PASSWORD,
    },
    { id: 'number', label: 'At least one number', required: true, met: /\d/.test(value) },
    {
      id: 'case',
      label: 'Upper and lower case letters',
      required: false,
      met: /[a-z]/.test(value) && /[A-Z]/.test(value),
    },
  ];
}

export type Strength = 0 | 1 | 2 | 3;

/** 0 is empty; 1 to 3 is the number of rules met, with 1 capped while too short. */
export function passwordStrength(value: string): Strength {
  if (!value) return 0;
  const rules = passwordRules(value);
  if (!rules.find((r) => r.id === 'length')?.met) return 1;
  const met = rules.filter((r) => r.met).length;
  return met >= 3 ? 3 : met === 2 ? 2 : 1;
}

const LABELS: Record<Strength, string> = { 0: '', 1: 'Weak', 2: 'Okay', 3: 'Strong' };

export function strengthLabel(strength: Strength): string {
  return LABELS[strength];
}

export function passwordError(value: string): string | undefined {
  if (!value) return 'Enter a password.';
  const missing = passwordRules(value).find((r) => r.required && !r.met);
  if (missing?.id === 'length') return `Use at least ${MIN_PASSWORD} characters.`;
  if (missing?.id === 'number') return 'Add at least one number.';
  return undefined;
}
