# TaraCSE Mobile UI Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clickable Expo SDK 58 Android-first app covering every TaraCSE student screen, UI and navigation only, with fake in-memory state.

**Architecture:** Standalone repo `C:\TaraCSE-mobile`. Expo Router (typed routes) under `src/app/` with thin route files that compose feature components from `src/features/`. Design system in `src/theme/` + `src/components/ui/`. Fake session in a React context + `useReducer`. Floating pill tab bar ported from Getsmo onto Reanimated.

**Tech Stack:** Expo SDK 58 (RN 0.88), Expo Router, TypeScript strict, Reanimated, Gesture Handler, expo-haptics, expo-blur, lucide-react-native + react-native-svg, @expo-google-fonts (Space Grotesk, Inter), Jest + jest-expo + React Native Testing Library, ESLint (eslint-config-expo flat) + Prettier, Husky + lint-staged + gitleaks, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-10-18-taracse-mobile-ui-design.md` (approved). Section refs below (§n) point there.

## How this plan is structured

Phase 0 (Foundation) is written in full below. Phases 1 to 6 are listed as task
outlines with files and interfaces. Each later phase gets its own detailed plan file
(`docs/superpowers/plans/2026-10-18-taracse-mobile-phase-N.md`) written at the start of
that phase, because Phase 0 confirms the SDK 58 APIs (Tabs custom bar, Reanimated,
template layout) that the detailed code depends on. Writing that code now against
unverified APIs would produce a plan that is wrong in the details.

## Global Constraints

- Expo SDK 58 exactly; all Expo-managed deps installed with `npx expo install` so versions match the SDK.
- Scaffold: `npx create-expo-app@latest --template default@sdk-58`.
- Node v24.17.0 (local). npm lockfile committed; CI uses `npm ci`.
- Must run in Expo Go for SDK 58: no Unistyles 3, no MMKV, no custom native code.
- Styling: `StyleSheet` + typed tokens + `useTheme()`. No NativeWind, no Tamagui. Components never use raw hex values.
- Icons: `lucide-react-native` only.
- Fonts: Space Grotesk (display, all numbers, tabular figures) + Inter (body).
- Path alias `@/*` → `src/*`. TypeScript `strict: true`, `noUncheckedIndexedAccess: true`.
- Route files in `src/app/` only compose feature components. One component per file; split files past ~200 lines.
- No purchase, upgrade, pricing, promo, payment-proof or QR UI. No copy mentioning buying, upgrading, prices, `₱`, or "go to the website" (§5.1).
- Locked premium items: lock icon + exactly "Not included in your current plan." + sheet with the same line and a "Got it" button. No call to action.
- No secrets in repo. `.env*` ignored except `.env.example`. Only `EXPO_PUBLIC_*` vars, and those are public.
- No WebView, no `eval`, no remote code, no untrusted remote images.
- `__DEV__`-only code (dev menu, plan toggle) guarded so it strips from production.
- Android: no permissions requested this phase; unused ones blocked in `app.config.ts`.
- 48dp minimum touch targets. Every screen works at 360dp wide, large phone, light + dark, large font scale, reduce motion.
- Commits on `develop`, author `jsnaur <jasnerr45@gmail.com>` (global config). Conventional Commits.
- Payment QR images from the web repo are never copied. Question content is written fresh.
- Skill precedence: `docs/DESIGN.md` → §5 Play rules → antislop → Expo official skills → others.

---

## Phase 0: Foundation

End state: SDK 58 app scaffolded in `C:\TaraCSE-mobile` on `develop`, strict TS, alias,
lint/format/test/typecheck scripts green, Husky pre-commit with lint-staged + gitleaks,
CI workflow + Dependabot, skills and agents installed, project docs written, Tabs
custom-bar API confirmed and recorded, phone preview path confirmed.

### Task 0.1: Scaffold Expo SDK 58 app

**Files:**
- Create: everything the `default@sdk-58` template produces, moved into repo root
- Modify: `.gitignore` (append env + screenshot rules)

**Interfaces:**
- Produces: `package.json` with `expo@~58`, `expo-router`, `src/app/` route root, `npm start`.

The repo already has `docs/`, so scaffold into a temp folder and move it in.

- [ ] **Step 1: Scaffold into scratch**

```bash
cd /c/TaraCSE-mobile/..
npx create-expo-app@latest taracse-mobile-scaffold --template default@sdk-58 --no-install
```

Expected: folder `taracse-mobile-scaffold` with `package.json`, `app.json`, `src/app/`.

- [ ] **Step 2: Move files into the repo (keep our docs and .git)**

```bash
cd /c/taracse-mobile-scaffold
rm -rf .git
cp -rn . /c/TaraCSE-mobile/
cd /c && rm -rf /c/taracse-mobile-scaffold
```

- [ ] **Step 3: Install and check SDK version**

```bash
cd /c/TaraCSE-mobile && npm install && npx expo --version && node -e "console.log(require('./package.json').dependencies.expo)"
```

Expected: expo dependency `~58.0.x`.

- [ ] **Step 4: Strip template example content**

Run the template's reset script if present (`npm run reset-project`), choosing to delete
examples. Then delete any leftover example components, hooks, constants and images not
used by `src/app/`. Remove the `reset-project` script and `scripts/reset-project.js`.
Leave a minimal `src/app/_layout.tsx` (Stack) and `src/app/index.tsx`:

```tsx
// src/app/index.tsx
import { Text, View } from 'react-native';

export default function Index() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>TaraCSE</Text>
    </View>
  );
}
```

- [ ] **Step 5: Append ignore rules**

Append to `.gitignore`:

```
# env (only .env.example is committed)
.env
.env.*
!.env.example

# screenshots and local scratch
.screenshots/
scratch/
```

- [ ] **Step 6: Verify it bundles and doctor passes**

```bash
npx expo-doctor
npx expo export --platform android --output-dir /tmp/taracse-export-check
```

Expected: doctor reports no failed checks; export finishes without errors. Delete the export dir.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Expo SDK 58 app"
```

### Task 0.2: TypeScript strict, alias, dynamic config, env

**Files:**
- Modify: `tsconfig.json`
- Create: `app.config.ts`, `.env.example`
- Delete: `app.json` (contents move into `app.config.ts`)

**Interfaces:**
- Produces: `@/*` alias; `npm run typecheck`; config reading only `EXPO_PUBLIC_*`.

- [ ] **Step 1: tsconfig**

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

Keep any extra keys the template added (e.g. existing `include` entries).

- [ ] **Step 2: app.config.ts** — port every field from `app.json`, then set:

```ts
import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'TaraCSE',
  slug: 'taracse-mobile',
  scheme: 'taracse',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  // ...icon, splash, ios, web, plugins, experiments from template app.json
  android: {
    package: 'com.taracse.app',
    edgeToEdgeEnabled: true,
    // No permissions requested in this phase. Keep Data safety minimal.
    permissions: [],
    blockedPermissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.CAMERA',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.SYSTEM_ALERT_WINDOW',
    ],
  },
  experiments: { typedRoutes: true },
  extra: {
    // Anything here ships inside the app bundle. Public values only.
    privacyPolicyUrl: process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ?? '',
  },
};

export default config;
```

If SDK 58 moved `edgeToEdgeEnabled` (edge-to-edge is default on new Android), drop it per
`expo-doctor` output.

- [ ] **Step 3: .env.example**

```
# Every EXPO_PUBLIC_* value is bundled into the app and readable by anyone with the APK.
# Only put public values here (e.g. a Supabase anon key later). Never service keys.
EXPO_PUBLIC_PRIVACY_POLICY_URL=
```

- [ ] **Step 4: Add typecheck script and run it**

`package.json` scripts: `"typecheck": "tsc --noEmit"`.

```bash
npx expo customize tsconfig.json 2>/dev/null; npm run typecheck
```

Expected: exit 0.

- [ ] **Step 5: Prove the alias resolves**

Temporarily import `@/app/index` in a scratch file, run typecheck, delete it. Expected: no "Cannot find module".

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: strict TypeScript, path alias, dynamic config"
```

### Task 0.3: Lint and format

**Files:**
- Create/Modify: `eslint.config.js`, `.prettierrc`, `.prettierignore`, `.editorconfig`, `.gitattributes`

**Interfaces:**
- Produces: `npm run lint`, `npm run format`.

- [ ] **Step 1: Install**

```bash
npx expo lint   # creates eslint.config.js with eslint-config-expo if missing
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

- [ ] **Step 2: eslint.config.js**

```js
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  prettierRecommended,
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*', '.claude/*'],
  },
  {
    rules: {
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
    },
  },
]);
```

- [ ] **Step 3: Prettier + editor files**

`.prettierrc`:

```json
{ "singleQuote": true, "trailingComma": "all", "printWidth": 100, "semi": true }
```

`.prettierignore`: `node_modules`, `.expo`, `dist`, `package-lock.json`, `.claude`.

`.editorconfig`:

```
root = true
[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true
```

`.gitattributes`:

```
* text=auto eol=lf
*.png binary
*.jpg binary
*.ttf binary
```

- [ ] **Step 4: Scripts and run**

`"lint": "expo lint"`, `"format": "prettier --write ."`, `"format:check": "prettier --check ."`.

```bash
npm run format && npm run lint
```

Expected: lint exit 0.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: ESLint flat config and Prettier"
```

### Task 0.4: Jest with jest-expo and RNTL

**Files:**
- Create: `jest.config.js`, `src/lib/__tests__/smoke.test.tsx`

**Interfaces:**
- Produces: `npm test` (`jest`), RNTL `render`/`screen` available.

- [ ] **Step 1: Install**

```bash
npx expo install jest-expo jest @types/jest -- -D
npm install -D @testing-library/react-native
```

- [ ] **Step 2: jest.config.js**

```js
module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  testPathIgnorePatterns: ['/node_modules/', '/.claude/'],
};
```

- [ ] **Step 3: Write the smoke test (fails until config is right)**

```tsx
// src/lib/__tests__/smoke.test.tsx
import { render, screen } from '@testing-library/react-native';
import Index from '@/app/index';

test('root screen renders the app name', () => {
  render(<Index />);
  expect(screen.getByText('TaraCSE')).toBeTruthy();
});
```

- [ ] **Step 4: Run**

`"test": "jest"`, `"test:ci": "jest --ci"`.

```bash
npm test
```

Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "test: Jest with jest-expo and Testing Library"
```

### Task 0.5: Husky, lint-staged, gitleaks

**Files:**
- Create: `.husky/pre-commit`, `.gitleaksignore`, `scripts/gitleaks-staged.sh`
- Modify: `package.json` (`prepare`, `lint-staged`)

**Interfaces:**
- Produces: pre-commit runs eslint --fix + prettier on staged files, then gitleaks on staged changes.

gitleaks is a Go binary, not an npm package. The hook runs it when installed and prints
an install hint when not (`winget install Gitleaks.Gitleaks`). CI always runs it.

- [ ] **Step 1: Install**

```bash
npm install -D husky lint-staged && npx husky init
```

- [ ] **Step 2: package.json**

```json
"lint-staged": {
  "*.{ts,tsx,js}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

- [ ] **Step 3: scripts/gitleaks-staged.sh**

```sh
#!/bin/sh
# Scan staged changes for secrets. CI runs the full scan regardless.
if command -v gitleaks >/dev/null 2>&1; then
  gitleaks git --staged --redact --no-banner || exit 1
else
  echo "gitleaks not installed; skipping local secret scan (CI still scans)."
  echo "Install: winget install Gitleaks.Gitleaks"
fi
```

Use `gitleaks protect --staged` if the installed version predates the `git` subcommand.

- [ ] **Step 4: .husky/pre-commit**

```sh
npx lint-staged
sh scripts/gitleaks-staged.sh
```

`.gitleaksignore`: empty file with a header comment explaining fingerprints go here only after review.

- [ ] **Step 5: Verify hook fires**

Stage a file with a fake AWS key `AKIAIOSFODNN7EXAMPLE` pattern (if gitleaks installed) and confirm commit is blocked; unstage it. Without gitleaks, confirm the skip message prints and lint-staged ran.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: Husky pre-commit with lint-staged and gitleaks"
```

### Task 0.6: CI and Dependabot

**Files:**
- Create: `.github/workflows/ci.yml`, `.github/dependabot.yml`

- [ ] **Step 1: ci.yml**

```yaml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
permissions:
  contents: read
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:ci
      - run: npm audit --audit-level=high
      - run: npx expo-doctor
  secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- [ ] **Step 2: dependabot.yml**

```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule: { interval: weekly }
    open-pull-requests-limit: 5
    # Expo SDK packages move together via `npx expo install --fix`; ignore majors here.
    ignore:
      - dependency-name: 'expo*'
        update-types: ['version-update:semver-major']
      - dependency-name: 'react-native*'
        update-types: ['version-update:semver-major']
  - package-ecosystem: github-actions
    directory: /
    schedule: { interval: weekly }
```

- [ ] **Step 3: Run the CI commands locally**

```bash
npm run lint && npm run typecheck && npm run test:ci && npm audit --audit-level=high && npx expo-doctor
```

Expected: all exit 0. If `npm audit` flags a high issue in a transitive Expo dep with no fix, record it in `docs/SECURITY_NOTES.md` and do not force-upgrade.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "ci: lint, typecheck, test, audit, doctor, gitleaks"
```

### Task 0.7: Claude skills and agents

**Files:**
- Create: `.claude/skills/<14 copied skills>/`, `.claude/skills/<9 public skills>/`, `.claude/agents/code-quality-reviewer.md`, `.claude/agents/security-reviewer.md`, `skills-lock.json`

**Interfaces:**
- Produces: skills listed in §10.1 available to Claude Code in this repo.

- [ ] **Step 1: Copy local skills**

```bash
for s in antislop antislop-ui antislop-layoutmobile antislop-copywriting antislop-code antislop-human \
  apple-design emil-design-eng animate animation-vocabulary improve-animations review-animations \
  pick-ui-library prototype; do
  cp -r "/c/getsmo-portal/.claude/skills/$s" /c/TaraCSE-mobile/.claude/skills/
done
```

- [ ] **Step 2: Fetch public skills into scratch, read, pin**

Clone each source shallowly into the session scratchpad (not the repo), record `git rev-parse HEAD`, read each target `SKILL.md` (and any scripts it ships) for anything that runs network calls or code on load; only then copy the skill folder.

| Repo | Skills |
|---|---|
| `expo/skills` | `expo-design-system`, `expo-native-ui`, `expo-ui`, `expo-animation`, `expo-router`, `expo-project-structure`, `eas-app-stores` |
| `vercel-labs/agent-skills` | `react-native-skills` |
| `callstackincubator/agent-skills` | `react-native-best-practices` |
| `nextlevelbuilder/ui-ux-pro-max-skill` | `ui-ux-pro-max` |
| `anthropics/skills` | `frontend-design` |

Skill folder names in the source repos may differ from the names above; locate by `name:` in SKILL.md frontmatter.

- [ ] **Step 3: skills-lock.json**

Start from getsmo-portal's lock entries for the 8 emilkowalski skills (copy verbatim). Add one entry per public skill:

```json
"expo-router": {
  "source": "expo/skills",
  "sourceType": "github",
  "commit": "<sha from step 2>",
  "skillPath": "<path>/SKILL.md",
  "computedHash": "<sha256 of SKILL.md>"
}
```

Compute hash with `sha256sum <file>`. antislop-* skills: `"source": "local (getsmo-portal, antislop VERSION 3.2.15)"`.

- [ ] **Step 4: Agents**

Copy `code-quality-reviewer.md` and `security-reviewer.md`, then rewrite their scope for this repo: Expo/React Native mobile app, no Supabase yet, no payments, review against `docs/DESIGN.md`, §5 Play rules (copy steering), `EXPO_PUBLIC_*` exposure, `__DEV__` guards, SecureStore-for-tokens rule. Remove all Getsmo / Next.js / PayMongo / RLS references.

- [ ] **Step 5: Verify**

```bash
ls .claude/skills | wc -l   # 23
node -e "JSON.parse(require('fs').readFileSync('skills-lock.json','utf8'))"
grep -ril "getsmo\|paymongo\|next.js" .claude/agents || echo clean
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: add Claude skills and review agents"
```

### Task 0.8: Confirm SDK 58 Tabs custom-bar API (§2.2)

**Files:**
- Create: `docs/ROUTER_TABS.md`
- Create (temporary spike, deleted after): `src/app/(spike)/_layout.tsx`, two child screens

**Interfaces:**
- Produces: the exact import + prop used to render a custom tab bar under SDK 58, consumed by Phase 1's FloatingTabBar task.

- [ ] **Step 1: Read sources**

Read `.claude/skills/expo-router/SKILL.md`, `node_modules/expo-router/build/layouts/Tabs.d.ts` (or wherever `Tabs` is exported), and the SDK 58 changelog/docs for `integrateWithRouter` / `withLayoutContext` and `tabBar` prop.

- [ ] **Step 2: Spike**

Build a two-tab layout with a custom `tabBar` render prop (or the SDK 58 equivalent) that renders a plain row of `Pressable`s calling `navigation.navigate`. Run `npm run typecheck` and `npx expo export --platform android`.

Expected: typecheck passes, bundle builds.

- [ ] **Step 3: Record**

`docs/ROUTER_TABS.md`: import path, prop name, the props object shape passed to the bar (`state`, `descriptors`, `navigation`, `insets` or new names), how to hide the bar on a route, and whether `withLayoutContext` is needed (it should not be).

- [ ] **Step 4: Remove spike, commit doc**

```bash
rm -rf "src/app/(spike)"
git add -A && git commit -m "docs: record SDK 58 Tabs custom-bar API"
```

### Task 0.9: Project docs

**Files:**
- Create: `README.md`, `CLAUDE.md`, `AGENTS.md`, `docs/DESIGN.md`, `docs/PLAY_STORE.md`, `docs/SECURITY.md`

- [ ] **Step 1: docs/DESIGN.md**

Adapt getsmo-portal `DESIGN.md` to native: owner's taste (keep), iPhone-grade feel, 360dp / large phone / font scale / both themes instead of web breakpoints, 48dp targets, Reanimated + Gesture Handler + expo-haptics (not `motion`), Mobbin pull before each screen, the loop (screenshot via Expo on device or Android emulator; `adb exec-out screencap -p`), the bar, anti-slop rules from §7.4, TaraCSE tokens (navy `#1B3577`/`#4A7BC8`, amber `#F5A800`/`#FFB300`, `onAccent #0F1D3E`), KOT moods, dial `ENERGY 2 / RHYTHM 3 / MOTION 3`, antislop mode pre-answered DURING. Remove shadcn/web-only content.

- [ ] **Step 2: docs/PLAY_STORE.md**

All of §5: payments/anti-steering rules 1–6 verbatim, account deletion (in-app flow + web URL as a later web-repo task), AI content report flow, listing prerequisites list (§5.4), the copy-search term list, source links, "re-read live policies before submission".

- [ ] **Step 3: docs/SECURITY.md**

§9: no secrets, `EXPO_PUBLIC_*` is public, gitleaks, lockfile + `npx expo install`, Dependabot, audit, future tokens in `expo-secure-store` never AsyncStorage, no WebView/eval/remote code, `__DEV__` guards, blocked permissions.

- [ ] **Step 4: CLAUDE.md + AGENTS.md**

Same core content (AGENTS.md for non-Claude agents): what the app is, commands (`npm start`, `lint`, `typecheck`, `test`), folder rules (§3), global constraints above, skill precedence order, antislop pointer block (as in getsmo-portal CLAUDE.md), UI workflow pointer to `docs/DESIGN.md`, Play rules pointer, "web repo `C:\TaraCSE` is read-only reference", reviewers to run (`code-quality-reviewer`, `security-reviewer`).

- [ ] **Step 5: README.md**

Purpose, requirements (Node 24, Android phone), setup (`npm ci`, `cp .env.example .env`), preview (§2.1 USB path + dev-build fallback), scripts, folder map, links to docs.

- [ ] **Step 6: Commit**

```bash
npm run format && git add -A && git commit -m "docs: README, agent guides, design, Play Store and security notes"
```

### Task 0.10: Confirm phone preview (§2.1)

- [ ] **Step 1:** `adb devices` lists the owner's phone (needs USB debugging on; owner action).
- [ ] **Step 2:** `npx expo start`, press `a`; Expo CLI installs SDK 58 Expo Go; app shows "TaraCSE".
- [ ] **Step 3:** Record result (device model, Android version, path used) in `README.md` preview section. Commit `docs: record phone preview result`.

If no phone is attached, verify with the local Android emulator instead and mark the phone check as pending for the owner.

---

## Phase 1: Design system + route skeleton (outline)

Detailed plan: `2026-10-18-taracse-mobile-phase-1.md`, written at phase start.

- **1.1 Tokens** — `src/theme/tokens.ts` (colors light/dark per §7.1 incl. `navBar`, `onNavBarMuted`, `navBarPill`, `onNavBarPill`; `spacing` xs..3xl on 4pt; `radius` sm/md/lg/pill; `typography` six variants; `elevation` 3 levels; `motion` springs snappy/gentle/bouncy + durations). Test: every light key exists in dark.
- **1.2 ThemeProvider + useTheme** — `src/theme/ThemeProvider.tsx`, `src/theme/useTheme.ts`; mode system/light/dark; returns `{ theme, mode, setMode, elevation, isDark }`.
- **1.3 Fonts + root layout** — `src/app/_layout.tsx`: load Space Grotesk + Inter, keep splash until loaded, `GestureHandlerRootView`, `SafeAreaProvider`, ThemeProvider, SessionProvider.
- **1.4 useReducedMotion** — `src/hooks/useReducedMotion.ts` (Reanimated's or AccessibilityInfo).
- **1.5 Primitives** — `src/components/ui/`: AppText, Button, IconButton, Card, ListRow, TextField, SegmentedControl, Chip, SwitchRow, ProgressRing, ProgressBar, BottomSheet, Dialog, Skeleton, EmptyState, Toast, Avatar, Badge, LockedItem, Screen. Tests: Button press + disabled, LockedItem exact copy + sheet "Got it", TextField error.
- **1.6 KOT** — `src/components/kot/Kot.tsx` with `mood: 'hello' | 'cheer' | 'encourage' | 'guide' | 'thinking'`; assets copied from `C:\TaraCSE\public\images\kot` (not the two QR jpgs) and logo images.
- **1.7 FloatingTabBar** — `src/navigation/FloatingTabBar.tsx` per §6 on Reanimated, wired via API from `docs/ROUTER_TABS.md`. Tests: renders 5 tabs, `tablist`/`tab` roles, active `selected`, press calls navigate.
- **1.8 Fake session** — `src/state/session.tsx`: `SessionState { status: 'signedOut'|'onboarding'|'signedIn'; plan: 'free'|'premium'; profile: Profile | null }`, actions `signIn, register, completeOnboarding, signOut, deleteAccount, setPlan`. Reducer unit tests.
- **1.9 Types + mocks skeleton** — `src/types/*.ts`, `src/mocks/user.ts`.
- **1.10 Route skeleton** — every route in §3 with a placeholder screen + group redirects; `index.tsx` redirects by status.
- **1.11 Dev menu** — `src/app/dev-menu.tsx`, `__DEV__` only, long-press logo entry; list of routes, plan/theme/status toggles.

## Phase 2: Auth + onboarding (outline)

Splash hand-off, Welcome, Login, Register (strength hint, terms + privacy acceptance), Forgot, Check email, Reset, 5 onboarding steps writing exam level/date/goal into session profile. Features in `src/features/auth/`, `src/features/onboarding/`.

## Phase 3: Home + Practice (outline)

`src/mocks/questions.ts` (~30 original questions), `topics.ts`, `bookmarks.ts`. Home tab (countdown ticker, goal ring draw-in, continue, weak-topic nudge), Practice tab, setup, session (choices, feedback, shake, haptics), explanation BottomSheet with Report flow (§5.3), review, bookmarks.

## Phase 4: Mock exam (outline)

`mockAttempts.ts`. Mock tab (readiness, past attempts), setup, exam (timer amber/red, navigator sheet, flag, submit + leave confirms), results (staged reveal + KOT mood), review, LockedItem states for free plan.

## Phase 5: Progress, Profile, rest (outline)

`analytics.ts`, `achievements.ts`, `leaderboard.ts`, `duels.ts`. Progress analytics, achievements, leaderboard (weekly/all-time), profile, settings, plan (read-only), delete account (typed confirmation → scheduled state → sign out), suggestions, terms, privacy (mobile text, no pricing), duel lobby/matching/live/result, maintenance, not found, empty/loading/error states on every list.

## Phase 6: Polish + compliance (outline)

`review-animations` + antislop Delivery Gate per screen; dark mode, large font scale, 360dp, reduce motion, accessibility labels; §5.1 rule 5 copy search:

```bash
grep -rniE "upgrade|buy|subscribe|price|₱|\bpay|website|taracse\.com|promo|premium" src/ --include=*.tsx --include=*.ts
```

Every hit reviewed; `premium` allowed only as a plan name stated as fact. Final: lint, typecheck, test, expo-doctor, gitleaks all pass; §12 done criteria checked one by one.
