# TaraCSE Mobile

Android-first Expo app for TaraCSE, a reviewer for the Philippine Civil Service Exam.
This phase is a clickable UI prototype of every student screen with fake in-memory
state. Accounts will be shared with the TaraCSE website later; payments stay on the
website only (see `docs/PLAY_STORE.md`).

## Requirements

- Node 24 (tested on v24.17.0) and npm 11
- An Android phone with USB debugging on, or the Android emulator
- Android platform tools (`adb`) on `PATH`
- Optional: [gitleaks](https://github.com/gitleaks/gitleaks) for the local pre-commit
  secret scan (`winget install Gitleaks.Gitleaks`)

## Setup

```bash
npm ci
cp .env.example .env
```

## Run on a phone (Expo SDK 58)

Store builds of Expo Go for SDK 58 were not yet out when this project started
(2026-10-18), so install Expo Go through the CLI:

1. Connect the phone by USB with USB debugging on. Check it shows up: `adb devices`.
2. `npm start`, then press `a`. Expo CLI installs the matching SDK 58 Expo Go on the
   device and opens the app. Expo Go asks you to sign in with an Expo account.

Fallback: a development build with `npx expo run:android` (needs Android Studio), or an
EAS development build.

Preview status: pending a check on the owner's phone.

## Scripts

| Script              | What it does                                                  |
| ------------------- | ------------------------------------------------------------- |
| `npm start`         | Start the Expo dev server                                     |
| `npm run lint`      | ESLint (flat config) with Prettier                            |
| `npm run typecheck` | `tsc --noEmit`                                                |
| `npm test`          | Jest with jest-expo and Testing Library                       |
| `npm run audit`     | `npm audit` that fails on unreviewed high/critical advisories |
| `npm run format`    | Prettier write                                                |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests, audit, `expo-doctor` and
gitleaks on every push to `main`/`develop` and on pull requests.

## Docs

- `docs/DESIGN.md`: design direction and the UI workflow
- `docs/PLAY_STORE.md`: Google Play rules every screen follows
- `docs/SECURITY.md`: secrets, dependencies, permissions
- `docs/ROUTER_TABS.md`: the SDK 58 custom tab bar API
- `docs/superpowers/`: spec and implementation plans
- `AGENTS.md` / `CLAUDE.md`: guide for coding agents
