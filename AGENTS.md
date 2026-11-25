# AGENTS.md — Cartoon Siege

Public repository of the browser game Cartoon Siege (https://cartoon-siege.onrender.com). Never add private information, and never mention other games in the site, docs or code.

- Source: `src/siege/` (the game: `cartoon/model.ts`, `view.ts`, `story.ts`, `credits.ts`, `index.ts`), `src/audio.ts`, `src/strings.ts` (EN/ES), `src/main.ts` + `src/landing.ts` (front page), `public/` (art at `/images/game/...`, icons, covers).
- Save keys are `cartoonSiege.*` and must never change.
- **The same Siege runs inside Bug Hunter** (https://github.com/alvrichh/MyPersonalWeb, `bug-hunter/src/siege/`, mirrored to https://github.com/alvrichh/bug-hunter). A gameplay change made here is made there too, and the other way round, unless the owner says it is for one game only.
- For game changes bump `src/version.ts`. Run `npm run typecheck` and `npm run build` before pushing.
- Commits: as the owner, no co-author lines. Push to `main`; Render deploys it (deploy hook).
