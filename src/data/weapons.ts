import type { Verification, Weapon, WeaponCategory, WeaponCategoryId } from "./schema";

export const VERIFIED_ON = "2026-11-05";

export function v(status: Verification["status"], sourceIds: string[], note?: string): Verification {
  return { status, sourceIds, lastVerified: status === "unconfirmed" ? null : VERIFIED_ON, ...(note ? { note } : {}) };
}

export const CATEGORIES: WeaponCategory[] = [
  { id: "assault-rifle", name: "Assault Rifles", short: "AR", slot: "primary" },
  { id: "smg", name: "Submachine Guns", short: "SMG", slot: "primary" },
  { id: "shotgun", name: "Shotguns", short: "SG", slot: "primary" },
  { id: "lmg", name: "Light Machine Guns", short: "LMG", slot: "primary" },
  { id: "marksman-rifle", name: "Marksman Rifles", short: "MR", slot: "primary" },
  { id: "sniper-rifle", name: "Sniper Rifles", short: "SR", slot: "primary" },
  { id: "pistol", name: "Pistols", short: "PST", slot: "secondary" },
  { id: "launcher", name: "Launchers", short: "LCH", slot: "secondary" },
  { id: "melee", name: "Melee", short: "MEL", slot: "melee" },
];

const LAUNCH_SRC = ["gfinity-weapons", "dexerto-weapons", "wzl-weapons", "codmunity-tracker"];

type Row = {
  name: string;
  slug: string;
  cat: WeaponCategoryId;
  lvl: number; // player-level unlock (official progression table)
  max: number; // official "levels to max"
  apex: string | null; // official Apex attachment (unlocked at max level)
  /** Activision's weapon card disagrees with its own progression table. */
  cardLvl?: number;
  obs?: string[];
  nameInGame?: boolean;
};

/**
 * Launch roster: 33 weapons (24 primary, 8 secondary, 1 melee), names, classes,
 * unlock levels, max levels and Apex attachments from Activision's launch post.
 * HAN 86, WZ.55 Striga, Krait P68 and FSS Carbon Edge 1095 also appear in the
 * player's screenshots (the in-game UI shows names in capitals).
 */
const LAUNCH: Row[] = [
  { name: "Han 86", slug: "han-86", cat: "assault-rifle", lvl: 4, max: 72, apex: "Han X20 Skybreaker", nameInGame: true,
    obs: ["Create a Class shows: “Assault Rifle - Han”, “HAN 86 [2]”, “PRESTIGE 2 / 71”"] },
  { name: "M4", slug: "m4", cat: "assault-rifle", lvl: 14, max: 72, apex: "M4 Hurricane" },
  { name: "Hyeon Burst", slug: "hyeon-burst", cat: "assault-rifle", lvl: 21, max: 68, apex: "Hyeon Hyperburst" },
  { name: "Patriot XMR", slug: "patriot-xmr", cat: "assault-rifle", lvl: 27, max: 72, apex: "Patriot XMR Volt" },
  { name: "Kastov 762", slug: "kastov-762", cat: "assault-rifle", lvl: 34, max: 68, apex: "Kastov ARC" },
  { name: "Oden", slug: "oden", cat: "assault-rifle", lvl: 39, max: 65, apex: "Oden Sentinel" },
  { name: "Axion", slug: "axion", cat: "assault-rifle", lvl: 52, max: 69, apex: "Axion Clearcut" },
  { name: "Cronen Squall", slug: "cronen-squall", cat: "assault-rifle", lvl: 55, max: 67, apex: "Cronen Maelstrom" },
  { name: "ISO Nightshade", slug: "iso-nightshade", cat: "smg", lvl: 4, max: 64, apex: "ISO Trace" },
  { name: "VEL 46", slug: "vel-46", cat: "smg", lvl: 5, cardLvl: 13, max: 60, apex: "VEL 46 Snap" },
  { name: "Wz.55 Striga", slug: "wz55-striga", cat: "smg", lvl: 18, cardLvl: 21, max: 60, apex: "WZ.55 Striga Rampage", nameInGame: true,
    obs: ["Camo Select shows tabs: “WZ.55 STRIGA PROGRESSION”, “MODE MASTERY”, “SHARED”, “CATEGORIES”", "Groups: MILITARY [1/8], SPECIAL [0/3], COMPLETIONIST [0/4], PRESTIGE [0/4]", "Military Camo 1 requirement text: “Earn 11 more weapon unlocks” (shown completed)"] },
  { name: "PPSh-41", slug: "ppsh-41", cat: "smg", lvl: 30, cardLvl: 27, max: 62, apex: "PPSh-41 Ember" },
  { name: "X-58 Nyx", slug: "x-58-nyx", cat: "smg", lvl: 46, cardLvl: 34, max: 53, apex: "X-58 Void" },
  { name: "Rezi 12", slug: "rezi-12", cat: "shotgun", lvl: 4, max: 60, apex: "Rezi 12 Enforcer" },
  { name: "Warlord", slug: "warlord", cat: "shotgun", lvl: 32, max: 60, apex: "Warlord Lumen" },
  { name: "FiNN LMG", slug: "finn-lmg", cat: "lmg", lvl: 4, max: 59, apex: "FiNN Adverse" },
  { name: "Type 73", slug: "type-73", cat: "lmg", lvl: 9, max: 65, apex: "Type 73 Assault" },
  { name: "APOC-338", slug: "apoc-338", cat: "lmg", lvl: 44, max: 56, apex: "APOC-338 Praetor" },
  { name: "MAR-9", slug: "mar-9", cat: "marksman-rifle", lvl: 4, max: 73, apex: "MAR-9 Auto" },
  { name: "Oris 8.6", slug: "oris-86", cat: "marksman-rifle", lvl: 11, max: 70, apex: "Oris 8.6 Razor" },
  { name: "Mosin-Nagant", slug: "mosin-nagant", cat: "marksman-rifle", lvl: 36, max: 69, apex: "Mosin Harpoon" },
  { name: "KG-7 Vulcan", slug: "kg-7-vulcan", cat: "sniper-rifle", lvl: 4, max: 75, apex: "KG-7 Drillcharge" },
  { name: "Astaroth .57", slug: "astaroth-57", cat: "sniper-rifle", lvl: 25, cardLvl: 10, max: 54, apex: "Astaroth .57 Infiltrator" },
  { name: "Signal 50", slug: "signal-50", cat: "sniper-rifle", lvl: 50, cardLvl: 35, max: 74, apex: "Signal Inferno" },
  { name: "SANG 9mm", slug: "sang-9mm", cat: "pistol", lvl: 4, max: 38, apex: "SANG Breach" },
  { name: "Krait P68", slug: "krait-p68", cat: "pistol", lvl: 7, max: 38, apex: "Krait P68 Commando", nameInGame: true, obs: ["Create a Class shows: “Pistol”, “KRAIT P68”, “3 / 37”"] },
  { name: ".50 GS", slug: "50-gs", cat: "pistol", lvl: 41, max: 37, apex: "GS Magna" },
  { name: "Mojave .357", slug: "mojave-357", cat: "pistol", lvl: 48, max: 44, apex: "Mojave Lawless" },
  { name: "PILA", slug: "pila", cat: "launcher", lvl: 4, max: 46, apex: null },
  { name: "RPG-8", slug: "rpg-8", cat: "launcher", lvl: 23, max: 46, apex: null },
  { name: "JOKR", slug: "jokr", cat: "launcher", lvl: 43, max: 46, apex: null },
  { name: "PM-40 Anvil", slug: "pm-40-anvil", cat: "launcher", lvl: 54, max: 46, apex: null },
  { name: "FSS Carbon Edge 1095", slug: "fss-carbon-edge-1095", cat: "melee", lvl: 4, max: 46, apex: null, nameInGame: true, obs: ["Create a Class shows: “Knife”, “FSS CARBON EDGE 1095”, “1 / 46”"] },
];

/** Official Apex attachments: each unlocks when its weapon reaches max level. */
export const APEX = LAUNCH.filter((r) => r.apex).map((r) => ({ name: r.apex as string, weaponId: r.slug, level: r.max }));

const SEASON1: { name: string; slug: string; cat: WeaponCategoryId; unlock: string }[] = [
  { name: "Cronen Osprey", slug: "cronen-osprey", cat: "assault-rifle", unlock: "Season 1 Battle Pass — Tier 16 (blueprint at Tier 87)" },
  { name: "CSG-35", slug: "csg-35", cat: "smg", unlock: "Season 1 Battle Pass — Tier 36 (blueprint at Tier 73)" },
  { name: "JAK 12", slug: "jak-12", cat: "shotgun", unlock: "Season 1 in-season event reward (event details classified at announcement)" },
  { name: "ZLR Talonhawk", slug: "zlr-talonhawk", cat: "melee", unlock: "Season 1 in-season event reward (event Level 10)" },
];

export const WEAPONS: Weapon[] = [
  ...LAUNCH.map((r): Weapon => ({
    id: r.slug,
    slug: r.slug,
    name: r.name,
    category: r.cat,
    season: 0,
    unlock: {
      text: `Player Level ${r.lvl}`,
      playerLevel: r.lvl,
      verification: r.cardLvl
        ? v("unconfirmed", ["cod-launch-blog", "timesaver-unlocks", "critical-hits-weapons"],
            `Activision's launch post contradicts itself: its progression table says level ${r.lvl}, its weapon card says level ${r.cardLvl}. Showing ${r.lvl} (the progression table, which guides report matches the in-game unlock menu). Check Career › Progression in-game.`)
        : v("official", ["cod-launch-blog", "gfinity-weapons", "critical-hits-weapons"], "Classic Prestige resets level unlocks."),
    },
    maxLevel: { value: r.max, verification: v("official", ["cod-launch-blog"]) },
    description: null,
    inGameObservations: r.obs ?? [],
    verification: v(r.nameInGame ? "in-game" : "official", r.nameInGame ? ["user-screens", "cod-launch-blog", ...LAUNCH_SRC] : ["cod-launch-blog", ...LAUNCH_SRC]),
  })),
  ...SEASON1.map((r): Weapon => ({
    id: r.slug,
    slug: r.slug,
    name: r.name,
    category: r.cat,
    season: 1,
    unlock: { text: r.unlock, playerLevel: null, verification: v("official", ["cod-s1-blog"]) },
    maxLevel: { value: null, verification: v("unconfirmed", [], "Season 1 weapon — max level not yet published.") },
    description: null,
    inGameObservations: [],
    verification: v("official", ["cod-s1-blog", "timesaver-s1"], "Season 1 launches Nov 6, 2026 (00:00 ET)."),
  })),
];

export const LAUNCH_WEAPON_COUNT = LAUNCH.length;
