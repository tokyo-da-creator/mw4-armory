# MW4 Armory

**Every unlock in Modern Warfare 4, and how to get it.**

A free, unofficial reference guide to Call of Duty: Modern Warfare 4: weapons, camos, attachments, equipment, perks, killstreaks, operators, prestige and mastery, each with its exact requirement and a source badge. It's a static site with no accounts, no tracking and nothing stored.

> Unofficial fan project. Not affiliated with or endorsed by Activision. No game artwork is bundled. The 3D models are original schematics; every weapon and camo has a "See it in game" link (YouTube search) and weapons link to Activision's official post.

## What's in this package

| Folder | What it is |
|---|---|
| `site-build/` | The finished website. Upload this folder to any static host (Netlify Drop, Vercel, Cloudflare Pages, GitHub Pages) and it works as-is. |
| `src/` | Source code (Next.js + TypeScript + Tailwind + three.js + motion) |
| `src/data/` | The game database — every record has its source and a verification status |
| `tests/` | 25 unit tests + 9 real-browser checks |
| `docs/activision-permission-email.md` | Email asking Activision for permission to use official weapon and camo art |

## Live sites

- Test: https://mw4-armory-test.netlify.app (latest guide version)
- Main: https://mw4-armory.netlify.app (older tracker version until you approve the push)

## Run locally

```bash
npm install
npm run dev            # http://localhost:3000
```

## Build

```bash
npm run build          # static site in out/
npx serve out
```

## Tests

```bash
npm test               # unit tests: data integrity, official data checks, how-to-unlock text, level path, search, video links
npm run build && python3 -m http.server 4173 -d out &
python3 tests/e2e.py   # browser checks incl. phone width (needs Chrome + pip install playwright)
```

## Deploy

- **Netlify:** `netlify.toml` is included (build `npm run build`, publish `out`, redirects for old tracker URLs). Or drag `site-build/` onto https://app.netlify.com/drop.
- **Vercel:** import the repo at vercel.com/new, framework Next.js, no env vars. Vercel adds no badge.

## Architecture

```
src/data/        Static game database — versioned, Zod-validated at import (bad data fails the build)
  schema.ts        Types + verification model (official / in-game / community / unconfirmed / retired)
  sources.ts       Every source, with URL and access date
  weapons.ts       37 weapons (33 launch + 4 Season 1), official unlock/max levels + Apex
  loadout.ts       Tacticals, lethals, field upgrades, perks, killstreaks, operators
  camos.ts         676 camo slots generated per weapon + account-wide Divergence and Mastery
  attachments.ts   Verified attachment rows + per-type totals
  playerPrestige.ts
src/lib/
  howto.ts         Turns prerequisites into plain "how to unlock" steps
  unlocks.ts       Player level 1–55 unlock path
  watch.ts         "See it in game" YouTube search links
  search.ts        Global search index
src/views/       Page UIs (client)   src/app/   Routes   src/components/   Shared UI
tests/           Vitest unit tests + Playwright e2e
```


### Adding new season content

1. Add the weapon to `SEASON1`-style list in `src/data/weapons.ts` (or a new `SEASON2` list).
2. Add verified special camo names/requirements to `SPECIALS` in `src/data/camos.ts`; military levels to `MILITARY_LEVELS`.
3. Add any new source to `sources.ts`, bump `DATA_VERSION` in `src/data/index.ts`.
4. `npm test` — integrity tests catch broken references, duplicate IDs and uncited records.

## Data policy

- Nothing is invented. Unknown camo names show as "Special 2 (name unverified)" with an *Unconfirmed* badge.
- Every record carries a verification badge — tap it to see sources and conflicts.
- Multiplayer and DMZ requirements are always separate.
- Source conflicts are surfaced, not hidden (e.g. Pyroclast Scatter at level 150 vs 160; SANG 9mm max level 35 vs 38).
- Weapon art is an original labelled schematic. Players can add their own screenshot per weapon (stored locally).

## Still awaiting verified data

- Special camo names/challenges for 29 of 37 weapons (in-game: Create a Class › Camo Select)
- Military camo unlock levels for every weapon except Han 86
- Six weapon unlock levels Activision lists two ways (VEL 46, Wz.55 Striga, PPSh-41, X-58 Nyx, Astaroth .57, Signal 50) — both shown
- Weapon stats and descriptions; perk and killstreak descriptions
- Most attachments beyond Apex, bolts, combs, cylinders, guards and lasers
- Calling card, career and reticle challenges
- Player Prestige 2–10 rewards at levels 10–40; Warzone mastery requirements
- Season 1 weapons' max levels and camo details
