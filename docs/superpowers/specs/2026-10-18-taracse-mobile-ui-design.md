# TaraCSE Mobile — UI Prototype Design

- **Date:** 2026-10-18
- **Status:** Approved in brainstorming; revised for Play Store compliance
- **Repo:** `C:\TaraCSE-mobile` (local only; remote added later)
- **Source product:** TaraCSE web app (`C:\TaraCSE`, Next.js 16) — read-only reference, never edited
- **Distribution target:** Google Play Store

## 1. Goal

Build a clickable Expo mobile app that covers every **student (CSE reviewee)** screen of
TaraCSE, from first launch through login, sign-up, onboarding and every in-app screen.
This phase is **UI and navigation only**: no backend, no real auth, no Supabase. Every
tap must lead somewhere real so the whole app can be walked end to end on a phone.

The visual bar is higher than the web app: keep TaraCSE's identity (name, KOT mascot,
navy + amber brand) but rebuild type, spacing, components and motion to iOS-grade
craft. Nothing may read as generic AI output.

Accounts are shared with the website: the same login works on web and mobile. **All
payments and subscription upgrades happen on the website only.** The mobile app shows
whatever plan the account already has and never sells, prices, or points to a way to
buy anything (see §5).

### Non-goals

- Admin screens (stay on the web).
- Any purchase, upgrade, pricing, promo-code or payment-proof UI.
- Real authentication, data fetching, persistence, push notifications.
- App store builds, EAS submit, OTA updates (later phase; §11 keeps the app ready).
- Sharing code with the web repo (no monorepo).

## 2. Decisions

| Topic            | Decision                                                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Scope            | Student/reviewee screens only                                                                                                     |
| Visual direction | Keep identity, redo craft                                                                                                         |
| Repo             | Standalone `C:\TaraCSE-mobile`, branches `main` + `develop`                                                                       |
| Payments         | None in app. Web-only purchases. No steering of any kind (§5)                                                                     |
| Framework        | **Expo SDK 58** (latest stable, released 2026-10-15; React Native 0.88). Exact versions pinned at scaffold via `npx expo install` |
| Scaffold command | `npx create-expo-app@latest --template default@sdk-58` (plain `create-expo-app` still defaults to SDK 57 at time of writing)      |
| Node             | Local v24.17.0 satisfies SDK 58's requirement (22.13+, 24.3+, or 26+)                                                             |
| Preview target   | Physical Android phone. See §2.1 for how, since Expo Go for SDK 58 is not yet in the Play Store                                   |
| Routing          | Expo Router, typed routes                                                                                                         |
| Styling          | `StyleSheet` + typed design tokens + `useTheme()` hook. No NativeWind, no Tamagui                                                 |
| Motion           | Reanimated, Gesture Handler, `expo-haptics`, `expo-blur` (versions per SDK 58)                                                    |
| Icons            | `lucide-react-native` (continuity with web) over `react-native-svg`                                                               |
| Fonts            | Space Grotesk (display, numbers) + Inter (body) via `@expo-google-fonts/*`                                                        |
| Fake state       | React context + `useReducer`, in memory only                                                                                      |
| Committer        | `jsnaur <jasnerr45@gmail.com>` (global git config, confirmed by owner)                                                            |

### 2.1 Previewing SDK 58 on a phone

Expo's SDK 58 announcement says the store builds of Expo Go for SDK 58 arrive "within a
few weeks" of 2026-10-15, and that store Expo Go then supports only SDK 58. Until then:

1. **Preferred:** connect the Android phone by USB with USB debugging on, run
   `npx expo start`, press `a`. Expo CLI installs the matching SDK 58 Expo Go on the
   device. Expo Go now requires signing in with an Expo account.
2. **Fallback:** a development build (`npx expo run:android` with Android Studio, or
   an EAS development build). This also becomes the long-term path once native modules
   are needed.

Stay within modules Expo Go supports so option 1 keeps working. Anything that needs a
dev build (Unistyles 3, MMKV, custom native code) is out for this phase.

### 2.2 Known SDK 58 change to verify first

SDK 58 reworked Expo Router's navigation core and deprecated `withLayoutContext` in
favor of `integrateWithRouter`. The custom tab bar (§6) depends on Expo Router's `Tabs`
accepting a custom bar component. Phase 0 must confirm the SDK 58 API for this (read
the SDK 58 Expo Router docs and the `expo-router` skill) before building the bar, and
record the chosen API in `docs/`.

## 3. Repository structure

```
TaraCSE-mobile/
├─ src/
│  ├─ app/                    # Expo Router routes only; screens stay thin
│  │  ├─ _layout.tsx          # fonts, theme, gesture root, splash, providers
│  │  ├─ index.tsx            # redirect by fake session state
│  │  ├─ +not-found.tsx
│  │  ├─ maintenance.tsx
│  │  ├─ dev-menu.tsx         # hidden screen jumper (__DEV__ only)
│  │  ├─ (auth)/              # welcome, login, register, forgot, check-email, reset
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
│  │     ├─ plan.tsx          # read-only plan status (no purchase path)
│  │     ├─ delete-account.tsx
│  │     ├─ suggestions.tsx
│  │     ├─ terms.tsx
│  │     └─ privacy.tsx
│  ├─ features/               # feature UI: auth/, onboarding/, home/, practice/,
│  │                          #   mock/, duel/, progress/, profile/
│  ├─ components/ui/          # design-system primitives
│  ├─ components/kot/         # KOT mascot + moods
│  ├─ navigation/             # FloatingTabBar
│  ├─ theme/                  # tokens, ThemeProvider, useTheme
│  ├─ state/                  # fake session context (auth, onboarding, plan)
│  ├─ mocks/                  # typed fixtures
│  ├─ hooks/  lib/  types/
├─ assets/                    # images/kot, images/logo, splash, icon, adaptive icon
├─ .claude/                   # skills + agents (see §10)
├─ .github/                   # CI workflow, dependabot.yml
├─ docs/                      # DESIGN.md, PLAY_STORE.md, superpowers/specs, superpowers/plans
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
4. **Register** — name, email, password with strength hint, terms + privacy acceptance.
   Sign-up ends in onboarding, never in a plan or pricing screen.
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

| Tab      | Root screen                                                              | Pushes to                                                             |
| -------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Home     | Exam countdown, daily goal ring, continue last session, weak-topic nudge | Duel, Bookmarks                                                       |
| Practice | Topic list with mastery per topic                                        | Practice setup → Session → Review                                     |
| Mock     | Readiness score, past attempts                                           | Mock setup → Exam → Results → Review answers                          |
| Progress | Analytics: trend chart, subject breakdown, weak spots                    | Achievements, Leaderboard                                             |
| Profile  | Account summary, plan badge                                              | Settings, Plan, Suggestions, Terms, Privacy, Delete account, Sign out |

### 4.3 Stacked screens

- **Practice session:** question card, choices, submit, correct/wrong feedback, AI
  explanation in a bottom sheet with a **"Report this explanation"** action (§5.3),
  bookmark toggle, progress bar, end-session confirm.
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
- **Plan:** read-only. Shows current plan name ("Free" or "Premium"), what it includes,
  and for premium the renewal/expiry date. No buttons, links, prices or instructions
  about obtaining another plan (§5).
- **Delete account:** explains what is deleted, requires typing a confirmation word,
  final destructive confirm, then a "Your account is scheduled for deletion" state and
  sign-out (§5.2).
- **Suggestions / feedback** form with sent state.
- **Terms**, **Privacy** — mobile-specific text with all pricing, payment and
  upgrade content removed. Privacy also links to the public privacy-policy URL
  (placeholder constant for now).
- **Maintenance**, **Not found**, plus empty, loading (skeleton) and error states for
  every list screen.

### 4.4 Fake session state

`src/state/session.tsx` exposes `{ status: 'signedOut' | 'onboarding' | 'signedIn',
plan: 'free' | 'premium', profile }` and actions `signIn`, `register`,
`completeOnboarding`, `signOut`, `deleteAccount`, `setPlan` (dev menu only).
In-memory only; app reload resets to signed out. `src/app/index.tsx` and group
`_layout.tsx` files redirect on `status`.

### 4.5 Dev menu

Long-press the logo on Welcome (only when `__DEV__`) opens `dev-menu`: a list of every
route, plus toggles for plan (free / premium), theme (light / dark), and session status.
It is the fastest way to review both plan states. Guarded by `__DEV__` so it is stripped
from production bundles.

## 5. Google Play compliance (UI rules)

This section binds every screen. Sources are listed at the end of the section.

### 5.1 Payments and anti-steering

Google Play's Payments policy says apps "may not lead users to a payment method other
than Google Play's billing system", and lists in-app buttons, links, messaging,
promotions, webviews and account flows as covered. Region programs that permit
linking out (e.g. the US external content links program) require enrollment and do not
cover the Philippine audience by default, so this app uses none of them.

Rules for the app:

1. **No purchase surface.** No upgrade, pricing, checkout, promo-code, payment-proof,
   or QR screens. The web app's `/dashboard/upgrade` and `/pricing` have no mobile
   counterpart.
2. **No steering.** No text, button, link, banner, toast, push copy or email-style
   prompt that mentions buying, upgrading, prices, or "go to the website" in any form.
   This includes Home nudges, empty states, locked-feature states, KOT messages and
   Terms/Privacy text.
3. **Plan is shown, not sold.** The profile badge and Plan screen state the current
   plan as a fact.
4. **Premium-only features for free accounts:** show the item with a lock icon and the
   neutral line "Not included in your current plan." Tapping it opens a small sheet
   with the same line and a "Got it" button. No call to action. Mock exams beyond the
   free allowance, advanced analytics and full question bank follow this pattern.
5. **Copy review gate.** Phase 6 includes a search of all user-facing strings for
   `upgrade`, `premium` used as a verb/CTA, `buy`, `subscribe`, `price`, `₱`, `pay`,
   `website`, `taracse.com`, `promo` to catch violations.
6. **Store listing** (later) must not mention web purchase either. Recorded in
   `docs/PLAY_STORE.md`.

### 5.2 Account deletion

Play requires apps that let users create accounts to let them request deletion inside
the app and through a web link declared in the Data safety form. The app gets the
Delete account flow (§4.3). The web deletion URL is a later web-repo task, noted in
`docs/PLAY_STORE.md`.

### 5.3 AI-generated content

AI explanations are generative content. Play's AI-generated content policy expects a
way for users to report or flag offensive output without leaving the app. The
explanation sheet gets "Report this explanation" → reason chips (incorrect, offensive,
confusing, other) + optional note → sent state.

### 5.4 Other listing prerequisites (documentation only this phase)

`docs/PLAY_STORE.md` lists what the store submission later needs: privacy-policy URL,
Data safety answers, content rating questionnaire, target audience (adults; not
designed for children), target API level per current Play requirement, adaptive icon
and feature graphic, and the steering rules above. The app's UI is built so none of
these require redesign later.

Sources:

- Google Play Payments policy — https://support.google.com/googleplay/android-developer/answer/9858738
- External content links program (US) — https://support.google.com/googleplay/android-developer/answer/16470497
- RevenueCat, app-to-web purchase guidelines — https://www.revenuecat.com/blog/engineering/app-to-web-purchase-guidelines

Policies change; re-read the live Payments, Account deletion and AI-generated content
policies before submission.

## 6. Floating tab bar

Ported from Getsmo (`C:\Getsmo\src\navigation\FloatingTabBar.tsx`) and adapted:

- Floating pill-shaped bar, inset from screen edges, above the gesture/nav bar.
- Inactive tabs are icon-only at a fixed 56pt width; the active tab grows to fit its
  label. A tinted pill springs between tabs, sized from measured `onLayout` values so
  long labels and large font scales never overflow.
- Spring: damping 18, stiffness 180, mass 0.7 (Getsmo values). Instant move under
  reduce-motion.
- Colors only from the `navBar`, `onNavBarMuted`, `navBarPill`, `onNavBarPill` tokens.
  Navy bar, amber pill, navy label on the pill.
- Changes from Getsmo: animated with **Reanimated** on the UI thread instead of
  `Animated` on the JS driver; light `expo-haptics` selection tick on tab change;
  plugged into Expo Router's SDK 58 `Tabs` custom-bar API (§2.2).
- Accessibility: `tablist` / `tab` roles, `selected` state, label on every tab.
- Must fit 5 tabs at 360dp wide (common small Android width), including at the largest
  system font scale (verify with "Progress" and "Practice" active).
- Hidden on stacked screens that need full focus (session, mock exam, duel).
- Android: respects edge-to-edge and the system navigation bar inset.

## 7. Design system

### 7.1 Tokens (`src/theme/`)

- **Color roles**, light and dark: `background`, `surface`, `surfaceRaised`,
  `onSurface`, `onSurfaceMuted`, `border`, `primary` (navy `#1B3577` light,
  `#4A7BC8` dark), `onPrimary`, `accent` (amber `#F5A800` light, `#FFB300` dark),
  `onAccent` (`#0F1D3E`), `success`, `danger`, `warning`, plus the `navBar*` family.
  Components never use raw hex values.
- **Typography:** Space Grotesk for display and all numbers (tabular figures for
  scores, timers, counts); Inter for body. Six named variants, each with fixed size,
  line-height and letter-spacing. Respect system font scaling with a sensible max.
- **Spacing:** 4pt scale (`xs`…`3xl`). **Radii:** `sm`, `md`, `lg`, `pill`.
  **Elevation:** three levels, platform-appropriate.
- **Motion:** named springs `snappy`, `gentle`, `bouncy`; named durations; every
  animation has a reduce-motion path.

### 7.2 Primitives (`src/components/ui/`)

AppText, Button (variants: primary, secondary, ghost, danger; pressed scale +
haptic), IconButton, Card, ListRow, TextField (label, hint, error), SegmentedControl,
Chip, Switch row, ProgressRing, ProgressBar, BottomSheet (drag to dismiss), Dialog,
Skeleton, EmptyState, Toast, Avatar, Badge, LockedItem (§5.1 rule 4), Screen (safe
area + optional scroll + header).

### 7.3 Signature details

- Number tickers on scores, streaks and the exam countdown.
- Daily goal ring draws in on Home mount.
- Answer choices: tactile press, correct/wrong color transition, gentle shake on wrong,
  success/error haptic.
- Mock results: staged score reveal with KOT mood (`cheer`, `encourage`, `thinking`).
- Topic card → practice session transition keeps spatial continuity.
- Mock exam timer shifts to amber, then red, in the final minutes.
- Skeletons resolve into content rather than popping.

### 7.4 Anti-slop rules (`docs/DESIGN.md`)

Adapted from Getsmo's `DESIGN.md` for native: no cross-hue gradients, no sparkle
icons, no emoji bullets, no fake stat walls, no identical card grids, no repeated
glyph per row. Copy speaks plainly to a CSE reviewee. 48dp minimum touch targets on
Android (44pt iOS). Every screen checked at 360dp and a large phone, light and dark,
and at large font scale.

### 7.5 Design references

- **Mobbin** (MCP server already connected in Claude Code: `search_screens`,
  `search_flows`) for real-app reference screens: onboarding, quiz/exam, progress,
  leaderboard, settings, account deletion. Use for pattern study, never to copy a
  specific app's visuals.
- Material 3 (Android) and Apple HIG guidance via the `expo-native-ui` skill.

## 8. Mock data

`src/mocks/` holds typed fixtures that mirror the web app's shapes closely enough to be
swapped for real queries later:

- `user.ts` — free and premium sample profiles.
- `questions.ts` — ~30 original sample questions across Verbal, Numerical, Analytical
  and General Information (Philippine Constitution, RA 6713, etc.), each with choices,
  answer, explanation. Written fresh, not copied from the web database.
- `topics.ts`, `mockAttempts.ts`, `analytics.ts`, `achievements.ts`,
  `leaderboard.ts`, `duels.ts`, `bookmarks.ts`.

Types live in `src/types/` so a later data layer can implement the same interfaces.
Real KOT and logo images are copied from `C:\TaraCSE\public\images\kot` and
`public\images\logo`. Payment QR images there are **not** copied.

## 9. Security and code practices

- **No secrets in the repo.** `.env*` gitignored except `.env.example`. Docs state
  plainly that any `EXPO_PUBLIC_*` value is bundled into the app and visible to users,
  so only public keys (e.g. a Supabase anon key, later) may use it.
- **gitleaks** scan on pre-commit (Husky + lint-staged) and in CI.
- **Dependencies:** lockfile committed; installs via `npx expo install` to stay
  SDK-aligned; `npm ci` in CI; Dependabot for npm and GitHub Actions; `npm audit
--audit-level=high` in CI. Third-party skills are pinned by commit hash in
  `skills-lock.json`.
- **Future auth tokens** go in `expo-secure-store`, never AsyncStorage. Documented in
  `docs/` now; not installed until needed.
- No WebView, no `eval`, no dynamic `require` of remote code, no remote images from
  untrusted sources.
- `__DEV__`-only code (dev menu, plan toggle) is guarded so it is stripped from
  production bundles.
- TypeScript `strict: true`, `noUncheckedIndexedAccess: true`.
- Android permissions: none requested in this phase. `app.config.ts` explicitly blocks
  unused permissions so Data safety stays minimal.

## 10. Tooling, skills and quality gates

- ESLint (`eslint-config-expo`, flat config) + Prettier.
- `tsc --noEmit` typecheck script.
- Jest with `jest-expo` + React Native Testing Library, used for primitives, the tab
  bar (renders, active state, accessibility roles) and `LockedItem` copy. No snapshot
  sprawl.
- `npx expo-doctor` passes.
- Husky pre-commit runs lint-staged (eslint --fix, prettier) and gitleaks.
- GitHub Actions workflow (`ci.yml`): install, lint, typecheck, test, audit,
  gitleaks. Ready for when the remote exists.

### 10.1 Claude Code skills and agents

**Copied from `C:\getsmo-portal\.claude`:**

- Skills: `antislop`, `antislop-ui`, `antislop-layoutmobile`, `antislop-copywriting`,
  `antislop-code`, `antislop-human`, `apple-design`, `emil-design-eng`, `animate`,
  `animation-vocabulary`, `improve-animations`, `review-animations`,
  `pick-ui-library`, `prototype`, with matching `skills-lock.json` entries.
- Agents: `code-quality-reviewer`, `security-reviewer`.
- Not copied: gitnexus skills, `handoff`, `migration-reviewer`, Getsmo-specific
  settings.

**Installed from public sources** (checked 2026-10-18; read each SKILL.md before
installing, pin by commit):

| Source                                                                                                   | Skills to install                                                                                                              | Why                                                                                                                                      |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [expo/skills](https://github.com/expo/skills) (official Expo, ~2.9k★, MIT)                               | `expo-design-system`, `expo-native-ui`, `expo-ui`, `expo-animation`, `expo-router`, `expo-project-structure`, `eas-app-stores` | Official SDK-current guidance; `expo-design-system` explicitly targets "native-slop" tells; `eas-app-stores` for later Play submission   |
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (~32.5k★)                        | `react-native-skills`                                                                                                          | RN/Expo performance, lists, animation practices                                                                                          |
| [callstackincubator/agent-skills](https://github.com/callstackincubator/agent-skills) (~1.7k★)           | `react-native-best-practices`                                                                                                  | Performance and animation correctness from a core RN contributor team                                                                    |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (~137k★) | `ui-ux-pro-max` only                                                                                                           | Searchable palettes, type pairings, UX rules; has a `react-native` stack file. Use as reference, subordinate to `DESIGN.md` and antislop |
| [anthropics/skills](https://github.com/anthropics/skills) (~182k★)                                       | `frontend-design`                                                                                                              | Taste and anti-generic direction; web-oriented, so apply principles only                                                                 |

Skipped: `devanshudesai/agent-skills` (Liquid Glass is iOS-specific; app ships to Play
first), `maxgorriaran/react-native-expo-agent-skills` (no adoption signal).

Precedence when skills disagree: `docs/DESIGN.md` → §5 Play rules → antislop →
Expo official skills → others. `CLAUDE.md` / `AGENTS.md` state this order.

## 11. Build phases

Each phase ends with the app running on the phone and every new screen reachable.

0. **Foundation** — scaffold SDK 58, strict TS, alias, lint/format/test, Husky,
   gitleaks, CI, skills and agents (§10.1), README/CLAUDE/AGENTS, `DESIGN.md`,
   `PLAY_STORE.md`, confirm Tabs custom-bar API (§2.2), confirm phone preview (§2.1).
   Commit on `develop`.
1. **Design system** — tokens, ThemeProvider, fonts, primitives, KOT component,
   FloatingTabBar, fake session state, route skeleton for every screen (placeholder
   content), dev menu. Whole app is clickable end to end at this point.
2. **Auth + onboarding** — splash, welcome, login, register, forgot, check email,
   reset, 5 onboarding steps.
3. **Home + Practice** — Home tab, Practice tab, setup, session, explanation sheet with
   report flow, review, bookmarks.
4. **Mock exam** — Mock tab, setup, exam, navigator, submit, results, review, locked
   states for free plan.
5. **Progress, Profile and the rest** — analytics, achievements, leaderboard, profile,
   settings, plan, delete account, suggestions, terms, privacy, duel flow,
   maintenance, not found.
6. **Polish + compliance pass** — `review-animations` + antislop review on every
   screen, dark mode, large font scale, 360dp check, reduce-motion check,
   accessibility labels, §5.1 rule 5 copy search.

## 12. Done criteria

- Every screen in §4 exists, is designed (no placeholders), and is reachable by taps
  from a cold launch without the dev menu.
- Light and dark mode both designed.
- No purchase, pricing or steering UI or copy anywhere (§5.1 copy search is clean).
- Delete-account and report-AI-content flows exist.
- Lint, typecheck, tests, `expo-doctor` and gitleaks all pass.
- No secrets, no payment QR codes, no copied question bank content in the repo.
- Runs on the owner's Android phone.
