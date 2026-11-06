import type { Source } from "./schema";

const ACCESSED = "2026-11-05";

/** Every claim in the game database points back to one of these. */
export const SOURCES: Source[] = [
  {
    id: "cod-s1-blog",
    name: "Call of Duty Blog — MW4 & Warzone Season 1 announcement",
    url: "https://www.callofduty.com/tw/zh/blog/2026/10/call-of-duty-modern-warfare-4-warzone-season-1-announcement",
    kind: "official",
    accessed: ACCESSED,
  },
  {
    id: "cod-launch-blog",
    name: "Call of Duty Blog — MW4 launch: Multiplayer operators, weapons, equipment & Create-a-Class",
    url: "https://www.callofduty.com/blog/2026/10/call-of-duty-modern-warfare-4-launch-multiplayer-operators-weapons-equipment-create-a-class",
    kind: "official",
    accessed: ACCESSED,
  },
  {
    id: "critical-hits-weapons",
    name: "Critical Hits — MW4 all 33 weapons and unlock levels",
    url: "https://criticalhits.com.br/dicas/modern-warfare-4-todas-as-33-armas-e-niveis-de-desbloqueio/",
    kind: "community",
    accessed: ACCESSED,
  },
  {
    id: "timesaver-unlocks",
    name: "TimeSaver — MW4 unlock levels for every weapon",
    url: "https://timesaver.gg/blog/modern-warfare-4-unlock-levels-every-weapon-perk-killstreak",
    kind: "community",
    accessed: ACCESSED,
  },
  {
    id: "user-screens",
    name: "Player's own in-game screenshots (Camo Select: WZ.55 Striga; Create a Class: HAN 86 loadout)",
    url: null,
    kind: "in-game",
    accessed: ACCESSED,
  },
  {
    id: "gfinity-weapons",
    name: "Gfinity Esports — MW4 all weapons available at launch",
    url: "https://www.gfinityesports.com/article/call-of-duty-mw4-weapons",
    kind: "community",
    accessed: ACCESSED,
  },
  {
    id: "dexerto-weapons",
    name: "Dexerto — Modern Warfare 4 all weapons",
    url: "https://www.dexerto.com/wikis/modern-warfare-4/all-weapons/",
    kind: "community",
    accessed: ACCESSED,
  },
  {
    id: "wzl-weapons",
    name: "warzoneloadout.games — MW4 weapons database",
    url: "https://warzoneloadout.games/mw4/weapons",
    kind: "community",
    accessed: ACCESSED,
  },
  {
    id: "wzl-attachments",
    name: "warzoneloadout.games — MW4 attachments database",
    url: "https://warzoneloadout.games/mw4/attachments",
    kind: "community",
    accessed: ACCESSED,
  },
  {
    id: "wzl-camos",
    name: "warzoneloadout.games — MW4 camos",
    url: "https://warzoneloadout.games/mw4/camos/mw4",
    kind: "community",
    accessed: ACCESSED,
  },
  {
    id: "codmunity-guide",
    name: "CODMunity — MW4 camo tracker guide",
    url: "https://codmunity.gg/camo-tracker/guide/mw4",
    kind: "community",
    accessed: ACCESSED,
  },
  {
    id: "codmunity-tracker",
    name: "CODMunity — MW4 camo tracker",
    url: "https://codmunity.gg/camo-tracker/mw4",
    kind: "community",
    accessed: ACCESSED,
  },
  {
    id: "gamerfuzion-camos",
    name: "GamerFuzion — MW4 camo grind (Military, Special, Completionist, Mastery, Pyroclast)",
    url: "https://www.gamerfuzion.com/modern-warfare-4-camo-grind-military-special-completionist-mastery-pyroclast-camos/",
    kind: "community",
    accessed: ACCESSED,
  },
  {
    id: "gamerfuzion-prestige",
    name: "GamerFuzion — MW4 Prestige explained (Classic vs Regular, rewards, Prestige Master)",
    url: "https://www.gamerfuzion.com/modern-warfare-4-prestige-explained-classic-vs-regular-all-10-prestige-rewards-prestige-master/",
    kind: "community",
    accessed: ACCESSED,
  },
  {
    id: "timesaver-s1",
    name: "TimeSaver — MW4 Season 1 weapons",
    url: "https://timesaver.gg/blog/mw4-season-1-weapons-cronen-osprey-csg-35-jak-12-how-to-unlock",
    kind: "community",
    accessed: ACCESSED,
  },
];
