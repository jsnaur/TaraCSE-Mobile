# TaraCSE Mobile design direction and UI workflow

Read this whole file before any UI, UX, polish, motion, or "make it premium" task. It
applies to every agent (Claude Code, Codex, anything else). If a request touches how a
screen looks or moves, this file governs. It sits at the top of the precedence order:
this file → Play Store rules (`docs/PLAY_STORE.md`) → antislop → Expo official skills →
other skills.

## Who we design for

A Filipino CSE (Civil Service Exam) reviewee, Professional or Sub-professional level,
usually studying on a mid-range Android phone in short sessions: a commute, a lunch
break, the hour before sleep. They want to know how close they are to passing and what
to study next. Respect their time and their data plan.

## Identity (keep)

- Name **TaraCSE**, mascot **KOT** (moods: `hello`, `cheer`, `encourage`, `guide`,
  `thinking`). Real KOT art only, from `assets/images/kot/`. Never redraw KOT.
- Brand: navy + amber.
  - `primary`: navy `#1B3577` (light), `#4A7BC8` (dark)
  - `accent`: amber `#F5A800` (light), `#FFB300` (dark)
  - `onAccent`: `#0F1D3E`
- These values live only in `src/theme/tokens.ts`. Components never use raw hex values.

## Owner's taste (non-negotiable)

- The owner **hates output that looks like AI slop**: generic card grids, cross-hue
  gradients, sparkle icons, fake stats, emoji bullets, a glyph repeated per row, a
  floating white card on a plain gradient, identical card stacks, "hero + 3 features".
- The owner **loves motion and small details**: transitions between states, springs,
  staggered reveals, press feedback with tactile scale, number tickers, drawn-in rings,
  skeletons that resolve into content, micro-interactions that reward an action. A
  static screen is an unfinished screen.
- **iPhone-grade feel on Android.** Interactions feel like a well-made iOS app:
  springs, momentum, interruptible transitions, sheets that drag, haptics that confirm.
  Read `.claude/skills/apple-design/SKILL.md` for any gesture, sheet, spring or
  translucent-surface work, alongside `emil-design-eng`.
- Premium means specific and crafted: one considered signature detail per screen, real
  hierarchy, tabular figures, tight spacing rhythm, motion with a purpose.
- Never answer "make it premium" by regenerating a screen from scratch. Find what is
  generic in the current one and fix that.
- **Human labels, not system labels.** "Your rank this week", not "Leaderboard
  position". "Something went wrong. Try again.", not "Error 500". "Start practice", not
  "Initiate session". No enum names, codes or jargon in the UI.
- **Buttons are only as wide as they need to be**, except a sticky bottom primary
  action on a phone, which may span the width.

Dial (antislop R-37): `ENERGY 2 / RHYTHM 3 / MOTION 3`. Motion is a headline feature.

## Native rules

- Touch targets at least **48dp** (Android); 44pt minimum on iOS.
- Every screen designed at **360dp wide** and on a large phone, in **light and dark**,
  at the **largest system font scale**, and with **reduce motion** on.
- Safe areas and Android edge-to-edge respected: nothing under the status bar or the
  gesture/navigation bar unless it is intentional background.
- Typography: Space Grotesk for display and every number (tabular figures for scores,
  timers, counts); Inter for body. Use the six `AppText` variants only.
- Motion: Reanimated on the UI thread, Gesture Handler for gestures, `expo-haptics` for
  feedback, `expo-blur` for translucent surfaces. Named springs from tokens (`snappy`,
  `gentle`, `bouncy`). Every animation has a reduce-motion path. Animate transform and
  opacity first. No simultaneous fade + float + scale + bounce.
- Glass (blur) is allowed where it earns its place (tab bar, sheets, overlays). Keep
  contrast readable over the blur and one recipe per surface type.
- Lists use `FlatList`, never `ScrollView` + `map`, once they can grow.

## Anti-slop rules (native)

- No cross-hue gradients. A single-hue tonal shift is fine.
- No sparkle icons, no emoji bullets, no repeated glyph per row.
- No fake stat walls ("10,000+ students"), no invented testimonials.
- No identical card grids; vary rhythm and weight by importance.
- No default system blue, no unstyled Material components.
- Copy speaks plainly to a CSE reviewee, in short sentences. No em dashes in UI copy, no
  filler taglines.
- Every list screen has designed **empty, loading (skeleton) and error** states.

## Tools you must use (in this order)

1. **Mobbin MCP** (`search_screens`, `search_flows`, `search_sections`). Before
   designing a screen, pull 3 to 5 real references for that screen type (onboarding,
   quiz/exam, results, progress, leaderboard, settings, account deletion). Write a short
   borrowing note: which pattern from which reference, and what we deliberately do
   differently. Never copy a specific app's visuals. Never reference paywall or pricing
   screens for this app (see `docs/PLAY_STORE.md`).
2. **Skills** in `.claude/skills/` (read the SKILL.md of each that applies):
   - `antislop` (core filter, always) plus `antislop-ui`, `antislop-layoutmobile`,
     `antislop-human`, `antislop-copywriting`, `antislop-code` when the task touches them.
   - `expo-design-system` (native-slop tells), `expo-native-ui`, `expo-animation`,
     `expo-router` for SDK-current APIs.
   - `emil-design-eng`, `animate`, `apple-design`, `review-animations`,
     `animation-vocabulary`, `improve-animations`.
   - `react-native-skills`, `react-native-best-practices` for performance and lists.
   - `prototype` when direction is unclear: 2 to 3 variants, then pick.
   - `ui-ux-pro-max` and `frontend-design` as reference only, subordinate to this file.

antislop usage mode is pre-answered: **DURING** (mode 1). Do not ask. Direction is this
file. Still run the Delivery Gate and output its PASS/FAIL report.

## The loop (never edit UI blind)

1. **Look at the current state.** Run the app on the phone or the Android emulator
   (`npx expo start`, press `a`) and capture it:
   `adb exec-out screencap -p > .screenshots/<screen>-<theme>.png`. Read the image.
   State plainly what is generic, weak or broken.
2. **Reference.** Mobbin pull plus borrowing note.
3. **Plan the change** in a few lines: hierarchy, the one signature detail, the motion
   plan (what moves, why, which spring or duration), which primitives.
4. **Build.**
5. **Look again** at 360dp and a large phone, light and dark, large font scale. Trigger
   the motion: press, open, close, success, error.
6. **Critique against the bar** below. List concrete failures.
7. **Fix and re-look.** Up to **3 rounds**. Stop early when every item passes. If round 3
   still fails, stop and report exactly which items fail and why.
8. **Deliver** with the antislop Delivery Gate PASS/FAIL report, the screenshots looked
   at, and the borrowed references.

## The bar (all must pass before "done")

- [ ] Tokens only: no raw hex, no literal font sizes, no ad-hoc springs.
- [ ] Passes the antislop Delivery Gate with evidence for every PASS.
- [ ] At least one signature detail a generic tool would not produce.
- [ ] Motion present and purposeful: entrance, state change and interaction feedback are
      animated, interruptible where the user can interrupt, with a reduce-motion path.
- [ ] Loading, empty, error and success states each designed.
- [ ] Right at 360dp and on a large phone, light and dark, large font scale.
- [ ] 48dp targets, labels and roles on every pressable.
- [ ] Copy is plain and friendly, no em dashes, no fake metrics, no enum names.
- [ ] No purchase, price or steering copy (`docs/PLAY_STORE.md`).
- [ ] Screenshots stay out of git (`.screenshots/` is ignored).

## Reporting

Say what you looked at, what you changed, and what still fails. Never claim a screen
"looks premium" without having viewed a screenshot of its final state.
