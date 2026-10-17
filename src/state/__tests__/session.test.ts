import { initialSession, sessionReducer } from '@/state/session';

describe('sessionReducer', () => {
  it('signs in with the sample profile', () => {
    const next = sessionReducer(initialSession, { type: 'signIn' });
    expect(next.status).toBe('signedIn');
    expect(next.profile?.name).toBeTruthy();
  });

  it('sends a new registration to onboarding with a blank profile', () => {
    const next = sessionReducer(initialSession, {
      type: 'register',
      name: 'Juan Dela Cruz',
      email: 'juan@example.com',
    });
    expect(next.status).toBe('onboarding');
    expect(next.profile).toMatchObject({ name: 'Juan Dela Cruz', examDate: null });
  });

  it('applies onboarding answers and signs in', () => {
    const registered = sessionReducer(initialSession, {
      type: 'register',
      name: 'Juan',
      email: 'juan@example.com',
    });
    const done = sessionReducer(registered, {
      type: 'completeOnboarding',
      patch: { level: 'subprofessional', examDate: '2027-03-08', dailyGoal: 50 },
    });
    expect(done.status).toBe('signedIn');
    expect(done.profile).toMatchObject({ level: 'subprofessional', dailyGoal: 50 });
  });

  it('resets everything on sign out and on account deletion', () => {
    const signedIn = sessionReducer(initialSession, { type: 'signIn' });
    const premium = sessionReducer(signedIn, { type: 'setPlan', plan: 'premium' });
    expect(sessionReducer(premium, { type: 'signOut' })).toEqual(initialSession);
    expect(sessionReducer(premium, { type: 'deleteAccount' })).toEqual(initialSession);
  });

  it('records a renewal date only for premium', () => {
    const signedIn = sessionReducer(initialSession, { type: 'signIn' });
    const premium = sessionReducer(signedIn, { type: 'setPlan', plan: 'premium' });
    expect(premium.profile?.planRenewsOn).toBeTruthy();
    const free = sessionReducer(premium, { type: 'setPlan', plan: 'free' });
    expect(free.profile?.planRenewsOn).toBeUndefined();
  });
});
