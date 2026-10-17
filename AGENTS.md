# TaraCSE Mobile: agent guide

TaraCSE Mobile is the Android-first Expo app for **TaraCSE**, a reviewer for the
Philippine Civil Service Exam. This phase is a **UI and navigation prototype**: every
student screen, clickable end to end, with fake in-memory state. No backend, no real
auth, no Supabase yet.

- Approved spec: `docs/superpowers/specs/2026-10-18-taracse-mobile-ui-design.md`
- Plan: `docs/superpowers/plans/2026-10-18-taracse-mobile-ui.md` (+ per-phase plans)
- The web app at `C:\TaraCSE` is a **read-only reference**. Never edit it from here.

## Expo has changed: do not trust your training data

This project is on **Expo SDK 58** (React Native 0.88, React 19.3, Expo Router 58,
Reanimated 4). Before writing code that touches an Expo, EAS or React Native API:

1. Check the `expo` version in `package.json`.
2. Read the matching versioned docs: `https://docs.expo.dev/versions/v58.0.0/`, or the
   index with LLM corrections at `https://docs.expo.dev/llms.txt`.
3. Check the local skills in `.claude/skills/expo-*` and the types in `node_modules`.

Already confirmed for SDK 58 (see `docs/ROUTER_TABS.md`): custom tab bar via
`Tabs` from `expo-router/js-tabs` with the `tabBar` prop; the bar gets
`{ state, descriptors, emitter, navigateToTab, insets }` and no `navigation` prop.

## Commands

```bash
npm start                  # expo start (press a for Android)
npm run lint               # expo lint (ESLint flat config + Prettier)
npm run typecheck          # tsc --noEmit
npm test                   # jest (jest-expo + Testing Library)
npm run audit              # npm audit with the reviewed allowlist
npx expo-doctor            # dependency and config health
npx expo install <pkg>     # ALWAYS use this to add packages (SDK-aligned versions)
npx expo install --fix     # fix version drift
```

Run lint, typecheck and tests before declaring a task done.

## Hard rules

- **Google Play rules first** (`docs/PLAY_STORE.md`): no purchase, pricing, upgrade,
  promo, payment-proof or QR UI, and no copy that mentions buying, upgrading, prices,
  `₱`, or the website. Locked premium items use `LockedItem` with exactly
  "Not included in your current plan." and a "Got it" sheet.
- **Stay Expo Go compatible.** No libraries that need a development build in this phase
  (no Unistyles 3, no MMKV, no custom native code).
- **Styling:** `StyleSheet` + tokens from `src/theme` via `useTheme()`. No NativeWind, no
  Tamagui, no raw hex values in components.
- **Icons:** `lucide-react-native` only. **Fonts:** Space Grotesk (display, numbers) +
  Inter (body).
- **Routes are thin.** Files in `src/app/` only compose components from `src/features/`.
  No styling or fixtures in route files.
- **One component per file.** Split files that grow past about 200 lines.
- Path alias `@/*` → `src/*`. TypeScript `strict` + `noUncheckedIndexedAccess`.
- Secrets: none in the repo. `EXPO_PUBLIC_*` values are public. See `docs/SECURITY.md`.
- `__DEV__`-only code (dev menu, plan toggle) stays behind `__DEV__`.
- Question content in `src/mocks` is written fresh. Never copy the web question bank.
- Native folders (`android/`, `ios/`) are generated. Never create or edit them; configure
  through `app.config.ts` and config plugins.

## Layout

```
src/app/            Expo Router routes only
src/features/       Feature UI (auth, onboarding, home, practice, mock, duel, progress, profile)
src/components/ui/  Design-system primitives
src/components/kot/ KOT mascot
src/navigation/     FloatingTabBar
src/theme/          Tokens, ThemeProvider, useTheme
src/state/          Fake session (auth, onboarding, plan)
src/mocks/          Typed fixtures
src/types/          Shared interfaces for fixtures and the future data layer
src/hooks/ src/lib/ Hooks and helpers
docs/               DESIGN.md, PLAY_STORE.md, SECURITY.md, ROUTER_TABS.md, superpowers/
```

## UI work

Before any UI, UX, polish or motion task, read `docs/DESIGN.md` and follow its loop:
look at the current screen, pull Mobbin references, build, look again, critique, max 3
rounds, finish with the antislop Delivery Gate report. Never edit UI blind.

## Skill precedence

When guidance conflicts: `docs/DESIGN.md` → `docs/PLAY_STORE.md` → antislop → Expo
official skills (`expo-*`, `eas-app-stores`) → everything else (`react-native-*`,
`ui-ux-pro-max`, `frontend-design`, Emil Kowalski skills).

## Git

- Work on `develop`; `main` gets merges. Conventional Commits (`feat:`, `fix:`, `chore:`,
  `docs:`, `test:`, `ci:`).
- Pre-commit runs lint-staged (ESLint + Prettier) and a gitleaks scan.
