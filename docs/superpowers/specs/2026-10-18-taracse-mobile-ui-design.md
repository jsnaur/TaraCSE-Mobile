# TaraCSE Mobile — UI Prototype Design

- **Date:** 2026-10-18
- **Status:** Approved in brainstorming, pending written-spec review
- **Repo:** `C:\TaraCSE-mobile` (local only; remote added later)
- **Source product:** TaraCSE web app (`C:\TaraCSE`, Next.js 16) — read-only reference, never edited

## 1. Goal

Build a clickable Expo mobile app that covers every **student (CSE reviewee)** screen of
TaraCSE, from first launch through login, sign-up, onboarding and every in-app screen.
This phase is **UI and navigation only**: no backend, no real auth, no Supabase, no
payments. Every tap must lead somewhere real so the whole app can be walked end to end
on a phone through Expo Go.

The visual bar is higher than the web app: keep TaraCSE's identity (name, KOT mascot,
navy + amber brand) but rebuild type, spacing, components and motion to iOS-grade
craft. Nothing may read as generic AI output.

### Non-goals

- Admin screens (stay on the web).
- Real authentication, data fetching, persistence, payments, push notifications.
- App store builds, EAS submit, OTA updates.
- Sharing code with the web repo (no monorepo).

## 2. Decisions

| Topic | Decision |
|---|---|
| Scope | Student/reviewee screens only |
| Visual direction | Keep identity, redo craft |
| Repo | Standalone `C:\TaraCSE-mobile`, branches `main` + `develop` |
| Preview target | Expo Go on a physical phone (no custom native modules) |
| Framework | Expo SDK 57 line (match Getsmo: RN 0.86, Reanimated 4), exact versions pinned at scaffold via `npx expo install` |
| Routing | Expo Router, typed routes |
| Styling | `StyleSheet` + typed design tokens + `useTheme()` hook. No NativeWind, no Tamagui |
| Motion | Reanimated 4, Gesture Handler, `expo-haptics`, `expo-blur` |
| Icons | `lucide-react-native` (continuity with web) over `react-native-svg` |
| Fonts | Space Grotesk (display, numbers) + Inter (body) via `@expo-google-fonts/*` |
| Fake state | React context + `useReducer`, in memory only |

All dependencies must run inside Expo Go. Anything needing a dev build (Unistyles 3,
MMKV, custom native code) is out for this phase.

## 3. Repository structure

```
TaraCSE-mobile/
├─ src/
│  ├─ app/                    # Expo Router routes only; screens stay thin
│  │  ├─ _layout.tsx          # fonts, theme, gesture root, splash, providers
│  │  ├─ index.tsx            # redirect by fake session state
│  │  ├─ +not-found.tsx
│  │  ├─ maintenance.tsx
│  │  ├─ dev-menu.tsx         # hidden screen jumper (dev builds only)
│  │  ├─ (auth)/              # welcome, login, register, forgot, reset, check-email
│  │  ├─ (onboarding)/        # level, exam-date, daily-goal, notifications, done
│  │  └─ (app)/
│  │     ├─ (tabs)/           # home, practice, mock, progress, profile
│  │     ├─ practice/         # setup, session/[id], review/[id]
│  │     ├─ mock/             # setup, [id], [id]/results, [id]/review
│  │     ├─ duel/             # index, matching, [id], [id]/result
│  │     ├─ bookmarks.tsx
│  │     ├─ achievements.tsx
│  │     ├─ leaderboard.tsx
│  │     ├─ settings.tsx
│  │     ├─ upgrade.tsx
│  │     ├─ suggestions.tsx
│  │     ├─ terms.tsx
│  │     └─ privacy.tsx
│  ├─ features/               # feature UI: auth/, onboarding/, home/, practice/,
│  │                          #   mock/, duel/, progress/, profile/, upgrade/
│  ├─ components/ui/          # design-system primitives
│  ├─ components/kot/         # KOT mascot + moods
│  ├─ navigation/             # FloatingTabBar
│  ├─ theme/                  # tokens, ThemeProvider, useTheme
│  ├─ state/                  # fake session context (auth, onboarding, plan)
│  ├─ mocks/                  # typed fixtures
│  ├─ hooks/  lib/  types/
├─ assets/                    # fonts (if not from npm), images/kot, images/logo, splash, icon
├─ .claude/                   # skills + agents (see §9)
├─ .github/                   # CI workflow, dependabot.yml
├─ docs/                      # DESIGN.md, superpowers/specs, superpowers/plans
├─ app.config.ts              # dynamic config; reads only EXPO_PUBLIC_* vars
├─ .env.example
├─ eslint.config.js  .prettierrc  tsconfig.json  .editorconfig  .gitattributes
├─ .gitignore  .gitleaksignore
└─ README.md  CLAUDE.md  AGENTS.md
```

Rules:
- Route files in `src/app/` only compose feature components. No styling logic or
  fixtures live there.
- One component per file; files that grow past ~200 lines get split.
- Path alias `@/*` → `src/*`.

## 4. Navigation and screens

### 4.1 Entry flow (no tab bar)

1. **Splash** — native splash, then animated KOT hand-off; routes by fake session.
2. **Welcome** — brand moment, "Get started" and "I have an account".
3. **Login** — email + password fields, show/hide password, "Forgot password?".
4. **Register** — name, email, password with strength hint, terms acceptance.
5. **Forgot password** → **Check your email** state.
6. **Reset password** — new password + confirm.
7. **Onboarding** (once per fake account):
   1. Exam level — Professional / Sub-professional
   2. Target exam date — date picker, feeds Home countdown
   3. Daily goal — questions per day
   4. Notifications — opt-in UI only
   5. Done — KOT celebration, enter app

Any credentials typed are ignored. "Log in" and "Create account" just set fake state.

### 4.2 Tabs (signed in)

| Tab | Root screen | Pushes to |
|---|---|---|
| Home | Exam countdown, daily goal ring, continue last session, weak-topic nudge, upgrade nudge (free plan) | Duel, Bookmarks |
| Practice | Topic list with mastery per topic | Practice setup → Session → Review |
| Mock | Readiness score, past attempts | Mock setup → Exam → Results → Review answers |
| Progress | Analytics: trend chart, subject breakdown, weak spots | Achievements, Leaderboard |
| Profile | Account summary, plan badge | Settings, Upgrade, Suggestions, Terms, Privacy, Sign out |

### 4.3 Stacked screens

- **Practice session:** question card, choices, submit, correct/wrong feedback, AI
  explanation in a bottom sheet, bookmark toggle, progress bar, end-session confirm.
- **Practice review:** answered list, filter correct/wrong, tap to expand.
- **Mock setup:** level, length, rules summary, start confirm.
- **Mock exam:** timer (amber then red near the end), question navigator bottom sheet,
  flag question, submit confirm, leave-exam warning.
- **Mock results:** score reveal with ticker, pass/fail framing, per-subject breakdown,
  KOT reaction, "Review answers".
- **Duel:** lobby, matchmaking, live duel (both players' progress), result.
- **Bookmarks:** saved questions list, remove, open in review mode.
- **Achievements**, **Leaderboard** (weekly / all-time segmented control).
- **Settings:** theme (system / light / dark), exam level, exam date, daily goal,
  notification toggles, account section.
- **Upgrade:** plan comparison, price, promo code input with valid/invalid UI states,
  payment-proof upload UI (image picker optional, placeholder acceptable), pending
  verification state. Uses a **placeholder QR image**; real payment QR codes from the
  web repo are not copied.
- **Suggestions / feedback** form with sent state.
- **Terms**, **Privacy** (static text).
- **Maintenance**, **Not found**, plus empty, loading (skeleton) and error states for
  every list screen.

### 4.4 Fake session state

`src/state/session.tsx` exposes `{ status: 'signedOut' | 'onboarding' | 'signedIn',
plan: 'free' | 'premium', profile }` and actions `signIn`, `register`,
`completeOnboarding`, `signOut`, `setPlan`. In-memory only; app reload resets to
signed out. `src/app/index.tsx` and group `_layout.tsx` files redirect on `status`.

### 4.5 Dev menu

Long-press the logo on Welcome (only when `__DEV__`) opens `dev-menu`: a list of every
route, plus toggles for plan (free / premium), theme (light / dark), and session status.
This is the fastest way to review every state. It is excluded from production builds by
the `__DEV__` guard.

## 5. Floating tab bar

Ported from Getsmo (`C:\Getsmo\src\navigation\FloatingTabBar.tsx`) and adapted:

- Floating pill-shaped bar, inset from screen edges, above the home indicator.
- Inactive tabs are icon-only at a fixed 56pt width; the active tab grows to fit its
  label. A tinted pill springs between tabs, sized from measured `onLayout` values so
  long labels and large font scales never overflow.
- Spring: damping 18, stiffness 180, mass 0.7 (Getsmo values). Instant move under
  reduce-motion.
- Colors only from the `navBar`, `onNavBarMuted`, `navBarPill`, `onNavBarPill` tokens.
  Navy bar, amber pill, navy label on the pill.
- Changes from Getsmo: animated with **Reanimated** on the UI thread instead of
  `Animated` on the JS driver; light `expo-haptics` selection tick on tab change; plugged
  into Expo Router via `<Tabs tabBar={(props) => <FloatingTabBar ... />}>`.
- Accessibility: `tablist` / `tab` roles, `selected` state, label on every tab.
- Must fit 5 tabs at 375pt wide, including at the largest system font scale (verify
  with "Progress" and "Practice" active).
- Hidden on stacked screens that need full focus (session, mock exam, duel).

## 6. Design system

### 6.1 Tokens (`src/theme/`)

- **Color roles**, light and dark: `background`, `surface`, `surfaceRaised`,
  `onSurface`, `onSurfaceMuted`, `border`, `primary` (navy `#1B3577` light,
  `#4A7BC8` dark), `onPrimary`, `accent` (amber `#F5A800` light, `#FFB300` dark),
  `onAccent` (`#0F1D3E`), `success`, `danger`, `warning`, plus the `navBar*` family.
  Components never use raw hex values.
- **Typography:** Space Grotesk for display and all numbers (tabular figures for
  scores, timers, counts); Inter for body. Six named variants, each with fixed size,
  line-height and letter-spacing. Respect system font scaling with a sensible max.
- **Spacing:** 4pt scale (`xs`…`3xl`). **Radii:** `sm`, `md`, `lg`, `pill`.
  **Elevation:** three levels, platform-appropriate (shadow on iOS, elevation on
  Android).
- **Motion:** named springs `snappy`, `gentle`, `bouncy`; named durations; every
  animation has a reduce-motion path.

### 6.2 Primitives (`src/components/ui/`)

AppText, Button (variants: primary, secondary, ghost, danger; pressed scale +
haptic), IconButton, Card, ListRow, TextField (label, hint, error), SegmentedControl,
Chip, Switch row, ProgressRing, ProgressBar, BottomSheet (drag to dismiss), Dialog,
Skeleton, EmptyState, Toast, Avatar, Badge, Screen (safe area + optional scroll +
header).

### 6.3 Signature details

- Number tickers on scores, streaks and the exam countdown.
- Daily goal ring draws in on Home mount.
- Answer choices: tactile press, correct/wrong color transition, gentle shake on wrong,
  success/error haptic.
- Mock results: staged score reveal with KOT mood (`cheer`, `encourage`, `thinking`).
- Topic card → practice session transition keeps spatial continuity.
- Mock exam timer shifts to amber, then red, in the final minutes.
- Skeletons resolve into content rather than popping.

### 6.4 Anti-slop rules (`docs/DESIGN.md`)

Adapted from Getsmo's `DESIGN.md` for native: no cross-hue gradients, no sparkle
icons, no emoji bullets, no fake stat walls, no identical card grids, no repeated
glyph per row. Copy speaks plainly to a CSE reviewee. 44pt minimum tap targets.
Every screen checked at 375pt and a large phone, in light and dark, and at large font
scale.

## 7. Mock data

`src/mocks/` holds typed fixtures that mirror the web app's shapes closely enough to be
swapped for real queries later:

- `user.ts` — free and premium sample profiles.
- `questions.ts` — ~30 original sample questions across Verbal, Numerical, Analytical
  and General Information (Philippine Constitution, RA 6713, etc.), each with choices,
  answer, explanation. Written fresh, not copied from the web database.
- `topics.ts`, `mockAttempts.ts`, `analytics.ts`, `achievements.ts`,
  `leaderboard.ts`, `duels.ts`, `bookmarks.ts`.

Types live in `src/types/` so a later data layer can implement the same interfaces.

## 8. Security and code practices

- **No secrets in the repo.** `.env*` gitignored except `.env.example`. Docs state
  plainly that any `EXPO_PUBLIC_*` value is bundled into the app and visible to users,
  so only public keys (e.g. a Supabase anon key, later) may use it.
- **gitleaks** scan on pre-commit (Husky + lint-staged) and in CI.
- **Dependencies:** lockfile committed; installs via `npx expo install` to stay
  SDK-aligned; `npm ci` in CI; Dependabot for npm and GitHub Actions; `npm audit
  --audit-level=high` in CI.
- **Future auth tokens** go in `expo-secure-store`, never AsyncStorage. Documented in
  `docs/` now; not installed until needed.
- No WebView, no `eval`, no dynamic `require` of remote code, no remote image URLs from
  untrusted sources.
- `__DEV__`-only code (dev menu) is guarded so it is stripped from production bundles.
- TypeScript `strict: true`, `noUncheckedIndexedAccess: true`.

## 9. Tooling and quality gates

- ESLint (`eslint-config-expo`, flat config) + Prettier.
- `tsc --noEmit` typecheck script.
- Jest with `jest-expo` + React Native Testing Library, used for primitives and the
  tab bar (renders, active state, accessibility roles). No snapshot sprawl.
- `npx expo-doctor` passes.
- Husky pre-commit runs lint-staged (eslint --fix, prettier) and gitleaks.
- GitHub Actions workflow (`ci.yml`): install, lint, typecheck, test, audit,
  gitleaks. Ready for when the remote exists.

**Claude Code setup copied from `C:\getsmo-portal\.claude`:**
- Skills: `antislop`, `antislop-ui`, `antislop-layoutmobile`, `antislop-copywriting`,
  `antislop-code`, `antislop-human`, `apple-design`, `emil-design-eng`, `animate`,
  `animation-vocabulary`, `improve-animations`, `review-animations`,
  `pick-ui-library`, `prototype`, with matching `skills-lock.json` entries.
- Agents: `code-quality-reviewer`, `security-reviewer`.
- Not copied: gitnexus skills, `handoff`, `migration-reviewer`, Getsmo-specific
  settings.
- `CLAUDE.md` / `AGENTS.md` point agents at `docs/DESIGN.md` and the skills above.

## 10. Build phases

Each phase ends with the app running in Expo Go and every new screen reachable.

0. **Foundation** — scaffold, strict TS, alias, lint/format/test, Husky, gitleaks, CI,
   `.claude` skills and agents, README/CLAUDE/AGENTS, DESIGN.md. Commit on `develop`.
1. **Design system** — tokens, ThemeProvider, fonts, primitives, KOT component,
   FloatingTabBar, fake session state, route skeleton for every screen (placeholder
   content), dev menu. Whole app is clickable end to end at this point.
2. **Auth + onboarding** — real designs for splash, welcome, login, register, forgot,
   check email, reset, 5 onboarding steps.
3. **Home + Practice** — Home tab, Practice tab, setup, session, explanation sheet,
   review, bookmarks.
4. **Mock exam** — Mock tab, setup, exam, navigator, submit, results, review.
5. **Progress, Profile and the rest** — analytics, achievements, leaderboard, profile,
   settings, upgrade, suggestions, terms, privacy, duel flow, maintenance, not found.
6. **Polish pass** — `review-animations` + antislop review on every screen, dark mode,
   large font scale, 375pt check, reduce-motion check, accessibility labels.

## 11. Done criteria

- Every screen in §4 exists, is designed (no placeholders), and is reachable by taps
  from a cold launch without the dev menu.
- Light and dark mode both designed.
- Lint, typecheck, tests, `expo-doctor` and gitleaks all pass.
- No secrets, no real payment QR codes, no copied question bank content in the repo.
- Runs in Expo Go on the user's phone.
