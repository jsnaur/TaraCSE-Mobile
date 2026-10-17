import { emailError, passwordError, passwordStrength, strengthLabel } from '@/lib/credentials';

describe('emailError', () => {
  it('asks for an email when empty', () => {
    expect(emailError('  ')).toBe('Enter your email.');
  });

  it('rejects an incomplete address', () => {
    expect(emailError('juan@gmail')).toMatch(/incomplete/);
    expect(emailError('juan.gmail.com')).toMatch(/incomplete/);
  });

  it('accepts a normal address with surrounding spaces', () => {
    expect(emailError(' juan.delacruz@gmail.com ')).toBeUndefined();
  });
});

describe('password checks', () => {
  it('rates strength by rules met, capped while too short', () => {
    expect(passwordStrength('')).toBe(0);
    expect(passwordStrength('Ab1')).toBe(1);
    expect(passwordStrength('abcdefgh')).toBe(1);
    expect(passwordStrength('abcdefg1')).toBe(2);
    expect(passwordStrength('Abcdefg1')).toBe(3);
    expect(strengthLabel(3)).toBe('Strong');
  });

  it('requires length and a number, not mixed case', () => {
    expect(passwordError('')).toBe('Enter a password.');
    expect(passwordError('abc1')).toBe('Use at least 8 characters.');
    expect(passwordError('abcdefgh')).toBe('Add at least one number.');
    expect(passwordError('abcdefg1')).toBeUndefined();
  });
});
