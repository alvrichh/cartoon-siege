# Cartoon Siege

A free side-scrolling siege game for the browser. Send troops, fire the crossbow, call down powers and storm the enemy fortress across six worlds. It also has a villain campaign and live duels with a friend.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173  (add ?play to open the game at once)
npm run build      # production build into dist/
npm run preview    # serve dist/
npm run typecheck
```

Node 20 or newer.

## Layout

- `index.html`, `privacy.html`: the landing page and privacy page. Their texts are in `src/landing.ts` (EN/ES).
- `src/main.ts`: wires the landing page to the game (audio, settings, language).
- `src/siege/`: the game. `cartoon/model.ts` holds the rules and units, `cartoon/view.ts` the drawing, `cartoon/story.ts` the story scenes, `index.ts` the screens and HUD, and `duel.ts` online duels.
- `src/audio.ts`: synthesised music and sound effects (Web Audio).
- `src/net.ts`: peer-to-peer connection for duels (PeerJS / WebRTC).
- `src/strings.ts`: in-game texts, English and Spanish.
- `public/images/game/`: art.

Saves live in the browser's local storage under `cartoonSiege.*` keys.

## Deploy

`render.yaml` describes a Render static site: it builds with `npm ci && npm run build` and publishes `dist/`.

© 2026 Álvaro Rodríguez Molina. All rights reserved.
