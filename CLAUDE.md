@AGENTS.md

# Claude Code notes

## Skills (`.claude/skills/`)

Pinned versions are recorded in `skills-lock.json`.

- antislop: `antislop` (core), `antislop-ui`, `antislop-layoutmobile`,
  `antislop-copywriting`, `antislop-code`, `antislop-human`
- Expo (official): `expo-design-system`, `expo-native-ui`, `expo-ui`, `expo-animation`,
  `expo-router`, `expo-project-structure`, `eas-app-stores`
- Motion and polish: `emil-design-eng`, `apple-design`, `animate`,
  `animation-vocabulary`, `improve-animations`, `review-animations`, `prototype`,
  `pick-ui-library`
- React Native: `react-native-skills`, `react-native-best-practices`
- Reference only: `ui-ux-pro-max`, `frontend-design`

## Review agents (`.claude/agents/`)

Run when a change is otherwise complete:

- `code-quality-reviewer`: reuse, thin routes, tokens, types, states, Play copy rules.
- `security-reviewer`: secrets, `EXPO_PUBLIC_*` exposure, `__DEV__` guards, deep links,
  permissions, dependencies.

## Design references

The Mobbin MCP server (`search_screens`, `search_flows`, `search_sections`) is the
reference source for screen patterns. See `docs/DESIGN.md` for how to use it.

<!-- antislop:start -->

## antislop

For UI, copy, people, mobile layout, or code comments work, read `.claude/skills/antislop/SKILL.md` (core) and then the skill for the task:

- UI / visual: `.claude/skills/antislop-ui/SKILL.md`
- Copy & text: `.claude/skills/antislop-copywriting/SKILL.md`
- People: `.claude/skills/antislop-human/SKILL.md`
- Mobile / responsive: `.claude/skills/antislop-layoutmobile/SKILL.md`
- Code comments: `.claude/skills/antislop-code/SKILL.md`

Usage mode is pre-answered in `docs/DESIGN.md`: DURING. Do not ask.

<!-- antislop:end -->
