import type { PlayerReward } from "./schema";
import { v } from "./weapons";

export const PRESTIGE_MASTER = 11;
const SRC = ["gamerfuzion-prestige"];
const c = (note?: string) => v("community", SRC, note);

export const PRESTIGE_THEMES = [
  { prestige: 1, inspiredBy: "Call of Duty (2003)", regularName: "The Vet", classicName: "The Vet Prime" },
  { prestige: 2, inspiredBy: "Call of Duty 2 (2005)", regularName: "Calm Resolve", classicName: "Trench Fiend" },
  { prestige: 3, inspiredBy: "Call of Duty 4: Modern Warfare (2007)", regularName: "Watchtower", classicName: "Watchtower Prime" },
  { prestige: 4, inspiredBy: "Modern Warfare 2 (2009)", regularName: "Terminal", classicName: "Torn Up" },
  { prestige: 5, inspiredBy: "Modern Warfare 3 (2011)", regularName: "Razor One", classicName: "Razor One Prime" },
  { prestige: 6, inspiredBy: "Ghosts (2013)", regularName: "Ghosts Legend", classicName: "Ghosts Legend Prime" },
  { prestige: 7, inspiredBy: "Infinite Warfare (2016)", regularName: "Warfighter", classicName: "Warfighter Prime" },
  { prestige: 8, inspiredBy: "Modern Warfare (2019)", regularName: "141", classicName: "141 Prime" },
  { prestige: 9, inspiredBy: "Modern Warfare II (2022)", regularName: "Sable", classicName: "Sable Prime" },
  { prestige: 10, inspiredBy: "Modern Warfare 4", regularName: "Boksu", classicName: "Boksu Prime" },
];

const FINAL: [number, string, PlayerReward["kind"]][] = [
  [1, "Mosin-Nagant Marksman Rifle blueprint", "blueprint"],
  [2, "PPSh-41 SMG blueprint", "blueprint"],
  [3, "SAS Operator Skin", "operator"],
  [4, "FiNN LMG blueprint", "blueprint"],
  [5, "Army SF Airborne Operator Skin", "operator"],
  [6, "Axion Assault Rifle blueprint", "blueprint"],
  [7, "Army SF Airborne Operator Skin", "operator"],
  [8, "M4 Assault Rifle blueprint", "blueprint"],
  [9, "Reece Operator Skin", "operator"],
  [10, "SANG 9mm Pistol blueprint", "blueprint"],
];

export const PLAYER_REWARDS: PlayerReward[] = [
  // Prestige 1 full track
  { id: "pp:1:0", prestige: 1, level: 0, name: "Sandstorm Operator Skin (Army SF Airborne)", kind: "operator", path: "both", verification: c() },
  { id: "pp:1:10", prestige: 1, level: 10, name: "Call of Duty (2003) Loading Screen", kind: "loading-screen", path: "both", verification: c() },
  { id: "pp:1:20", prestige: 1, level: 20, name: "Prestige 1 Emblem", kind: "emblem", path: "both", verification: c() },
  { id: "pp:1:30", prestige: 1, level: 30, name: "Engage! Weapon Charm", kind: "charm", path: "both", verification: c() },
  { id: "pp:1:40", prestige: 1, level: 40, name: "Men of Service Large Decal", kind: "decal", path: "both", verification: c() },
  // Final rewards per prestige (intermediate rewards for P2–P10 not yet published)
  ...FINAL.flatMap(([p, name, kind]): PlayerReward[] => {
    const t = PRESTIGE_THEMES[p - 1];
    return [
      { id: `pp:${p}:50:bp`, prestige: p, level: 50, name, kind, path: "both", verification: c("Final reward of this Prestige.") },
      { id: `pp:${p}:50:r`, prestige: p, level: 50, name: `${t.regularName} (Regular path)`, kind: "title", path: "regular", verification: c() },
      { id: `pp:${p}:50:c`, prestige: p, level: 50, name: `${t.classicName} (Classic path)`, kind: "title", path: "classic", verification: c() },
    ];
  }),
  // Prestige Master
  { id: "pm:56", prestige: 11, level: 56, name: "Paragon Operator Skin (Park)", kind: "operator", path: "both", verification: c("Instant on entering Prestige Master.") },
  { id: "pm:56:color", prestige: 11, level: 56, name: "Orange Level Color", kind: "level-color", path: "both", verification: c() },
  { id: "pm:60", prestige: 11, level: 60, name: "Best of the Best Loading Screen", kind: "loading-screen", path: "both", verification: c() },
  { id: "pm:65", prestige: 11, level: 65, name: "Prestige Master 56 Emblem", kind: "emblem", path: "both", verification: c() },
  { id: "pm:70", prestige: 11, level: 70, name: "Pinnacle Weapon Charm", kind: "charm", path: "both", verification: c() },
  { id: "pm:80", prestige: 11, level: 80, name: "Containment Breach Weapon Sticker", kind: "sticker", path: "both", verification: c() },
  { id: "pm:90", prestige: 11, level: 90, name: "Master Renegade — Han 86 blueprint", kind: "blueprint", path: "both", verification: c() },
  { id: "pm:100", prestige: 11, level: 100, name: "Navy Level Color + first legacy Prestige icon set", kind: "icon", path: "both", verification: c("A new icon set unlocks every 100 levels after 100; a new Level Color every 25 levels.") },
  { id: "pm:1000", prestige: 11, level: 1000, name: "Prestige Legend (final rewards classified)", kind: "title", path: "both", verification: v("unconfirmed", SRC, "Final rewards listed as classified.") },
];

export const PLAYER_PRESTIGE = {
  maxLevel: 55,
  prestigeCount: 10,
  masterMaxLevel: 1000,
  verification: c("Level 55 = Commander. Prestige Master runs levels 56–1,000. After level 55 you choose Classic (resets level unlocks, +20% XP, 1 Permanent Unlock Token, “Prime” cosmetics) or Regular (keeps unlocks)."),
  prestigeThemes: PRESTIGE_THEMES,
  rewards: PLAYER_REWARDS,
};
