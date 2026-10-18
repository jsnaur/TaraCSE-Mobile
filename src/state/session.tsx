import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';

import { blankProfile, sampleProfile } from '@/mocks/user';
import type { Plan, Profile } from '@/types/user';

/**
 * Fake, in-memory session. A reload always starts signed out. Credentials typed into
 * the auth screens are ignored; actions only move this state machine.
 */
export type SessionStatus = 'signedOut' | 'onboarding' | 'signedIn';

export interface SessionState {
  status: SessionStatus;
  plan: Plan;
  profile: Profile | null;
  /** Address the last password-reset link went to, shown on the check-email screen. */
  resetEmail: string | null;
}

export type SessionAction =
  | { type: 'signIn' }
  | { type: 'register'; name: string; email: string }
  | { type: 'requestReset'; email: string }
  | { type: 'completeOnboarding'; patch: Partial<Profile> }
  | { type: 'updateProfile'; patch: Partial<Profile> }
  | { type: 'signOut' }
  | { type: 'deleteAccount' }
  | { type: 'setPlan'; plan: Plan }
  | { type: 'setStatus'; status: SessionStatus };

export const initialSession: SessionState = {
  status: 'signedOut',
  plan: 'free',
  profile: null,
  resetEmail: null,
};

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'signIn':
      return {
        ...state,
        status: 'signedIn',
        profile: state.profile ?? sampleProfile,
        resetEmail: null,
      };
    case 'register':
      return {
        ...state,
        status: 'onboarding',
        profile: blankProfile(action.name, action.email),
        resetEmail: null,
      };
    case 'requestReset':
      return { ...state, resetEmail: action.email };
    case 'completeOnboarding':
      return {
        ...state,
        status: 'signedIn',
        profile: { ...(state.profile ?? sampleProfile), ...action.patch },
      };
    case 'updateProfile':
      return state.profile ? { ...state, profile: { ...state.profile, ...action.patch } } : state;
    case 'signOut':
    case 'deleteAccount':
      return initialSession;
    case 'setPlan':
      return {
        ...state,
        plan: action.plan,
        profile: state.profile
          ? {
              ...state.profile,
              planRenewsOn: action.plan === 'premium' ? '2027-04-18' : undefined,
            }
          : state.profile,
      };
    case 'setStatus':
      if (action.status === 'signedOut') return initialSession;
      return { ...state, status: action.status, profile: state.profile ?? sampleProfile };
  }
}

interface SessionValue extends SessionState {
  dispatch: (action: SessionAction) => void;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({
  children,
  initial = initialSession,
}: {
  children: ReactNode;
  initial?: SessionState;
}) {
  const [state, dispatch] = useReducer(sessionReducer, initial);
  const value = useMemo(() => ({ ...state, dispatch }), [state]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used inside SessionProvider');
  return value;
}

/** Profile for screens behind the signed-in guard, where it always exists. */
export function useProfile(): Profile {
  const { profile } = useSession();
  return profile ?? sampleProfile;
}
