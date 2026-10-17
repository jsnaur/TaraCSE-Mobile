# Security practices

## Secrets

- No secrets in the repo. `.env` and `.env.*` are gitignored except `.env.example`.
- **Every `EXPO_PUBLIC_*` value is bundled into the app** and can be read by anyone who
  has the APK. The same is true of everything in `app.config.ts`, including `extra`.
  Only public values may go there (for example a Supabase anon key, later). Service-role
  keys, admin tokens and webhook secrets never belong in this repo.
- **gitleaks** scans staged changes on every commit (Husky pre-commit,
  `scripts/gitleaks-staged.sh`) and the full history in CI. Locally it needs the binary:
  `winget install Gitleaks.Gitleaks`. Without it the hook prints a warning and CI still
  scans. Add a fingerprint to `.gitleaksignore` only after confirming a false positive.

## Auth tokens (future)

When real auth lands, session and refresh tokens go in **`expo-secure-store`**. Never
AsyncStorage, never a file, never a constant. Not installed until it is needed.

## Dependencies

- Install with `npx expo install <pkg>` so versions match the Expo SDK.
- `package-lock.json` is committed; CI uses `npm ci`.
- Dependabot opens weekly PRs for npm and GitHub Actions. Expo and React Native majors
  are ignored there because they move together with an SDK upgrade
  (`npx expo install --fix`).
- `npm run audit` (`scripts/audit.mjs`) fails on any high or critical advisory that is
  not in its reviewed allowlist. CI runs it.

### Reviewed audit allowlist

Each entry has no patched release at the time of review and does not reach code that
ships in the app bundle.

| Advisory            | Package                     | Path                                                     | Why it is accepted                                                                                                  |
| ------------------- | --------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| GHSA-vfj7-8cjw-p6xm | `braces@3.0.3` (latest)     | `expo` → `@expo/metro` → `metro-file-map` → `micromatch` | Glob matching in the Metro dev server/bundler on the developer machine. Not in the app bundle. Reviewed 2026-10-18. |
| GHSA-86w9-cpqp-85rv | `node-forge@1.4.0` (latest) | `expo` → `@expo/cli` (code-signing certificates)         | Used by Expo CLI tooling for update signing. Not in the app bundle. Reviewed 2026-10-18.                            |

Remove an entry as soon as a patched version is available to Expo's dependency tree.

## Code rules

- No WebView, no `eval` / `new Function` (ESLint enforces), no dynamic `require` of
  remote code, no remote images from untrusted hosts.
- `__DEV__`-only code (dev menu, plan toggle, session toggle) is guarded so production
  bundles drop it, and dev-only routes redirect away when `__DEV__` is false.
- Route params are untrusted input. Validate ids against fixtures or data, never
  interpolate them into anything executable.
- No `console.log` of profile data, form input or tokens.
- TypeScript `strict` and `noUncheckedIndexedAccess` stay on.

## Android permissions

None are requested in this phase. `app.config.ts` lists `permissions: []` and blocks
common ones (`RECORD_AUDIO`, `CAMERA`, location, external storage,
`SYSTEM_ALERT_WINDOW`) so a dependency cannot add them silently. Any new permission
needs a Data safety update in `docs/PLAY_STORE.md`.
