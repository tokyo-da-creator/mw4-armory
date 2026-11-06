import type { Attachment, AttachmentType } from "./schema";
import { APEX, v } from "./weapons";

/**
 * Attachment totals by type as listed by warzoneloadout.games (687 total).
 * Only the rows below have been extracted with names + unlock weapon/level so far;
 * the remainder is tracked as "awaiting verified records" in the UI.
 */
export const ATTACHMENT_TYPE_TOTALS: Record<AttachmentType, number> = {
  ammunition: 100,
  apex: 34,
  barrel: 122,
  bolt: 14,
  comb: 11,
  cylinder: 2,
  guard: 3,
  laser: 26,
  magazine: 27,
  muzzle: 110,
  optic: 51,
  "rear-grip": 75,
  stock: 78,
  "trigger-action": 13,
  underbarrel: 21,
};

export const ATTACHMENT_TYPE_LABEL: Record<AttachmentType, string> = {
  ammunition: "Ammunition",
  apex: "Apex",
  barrel: "Barrel",
  bolt: "Bolt",
  comb: "Comb",
  cylinder: "Cylinder",
  guard: "Guard",
  laser: "Laser",
  magazine: "Magazine",
  muzzle: "Muzzle",
  optic: "Optic",
  "rear-grip": "Rear Grip",
  stock: "Stock",
  "trigger-action": "Trigger Action",
  underbarrel: "Underbarrel",
};

// [name, type, unlock weapon id, unlock level, note?]
type Row = [string, AttachmentType, string, number, string?];
const ROWS: Row[] = [
  // Bolt
  ["Heavy Bolt", "bolt", "warlord", 4],
  ["KT76 Light Bolt", "bolt", "kg-7-vulcan", 63],
  ["L-Strike Bolt", "bolt", "warlord", 31],
  ["Light Bolt", "bolt", "warlord", 52],
  ["Lightfire-5 Quick Bolt", "bolt", "oris-86", 45, "Source also lists a near-identical “Lightfir-5 Quick Bolt” at level 42 — likely a duplicate/typo; confirm in-game."],
  ["MN-BCH3 Heavy Bolt", "bolt", "mosin-nagant", 8],
  ["NK HEV-3 Bolt", "bolt", "warlord", 55],
  ["TV-Light 7-Bolt", "bolt", "mosin-nagant", 57],
  ["Twist76 Heavy Bolt", "bolt", "kg-7-vulcan", 10],
  ["U12G Match 9", "bolt", "rezi-12", 8],
  ["VX86 Heavy Bolt", "bolt", "oris-86", 10],
  ["XRK Quad-80", "bolt", "rezi-12", 49],
  ["ZLR Competition-B6", "bolt", "rezi-12", 47],
  // Comb
  ["Bryson N40 Comb", "comb", "cronen-squall", 7],
  ["Bryson Sidewinder", "comb", "rezi-12", 54],
  ["EXP FCO-44", "comb", "cronen-squall", 30],
  ["FJX C-Band", "comb", "cronen-squall", 65],
  ["Haebang YNC-45", "comb", "kg-7-vulcan", 34],
  ["Hanbit CHK-1", "comb", "kg-7-vulcan", 51],
  ["KV-R98 Comb", "comb", "oden", 24],
  ["LM Stock Sleeve", "comb", "rezi-12", 30],
  ["NXK-9F Comb", "comb", "oden", 2],
  ["Sakin V14 Tactical", "comb", "rezi-12", 9],
  ["TT Type 40 Comb", "comb", "kg-7-vulcan", 6],
  // Cylinder
  ["Mojave Speed Cylinder", "cylinder", "mojave-357", 9],
  ["XRK H-CYL 6", "cylinder", "mojave-357", 39],
  // Guard
  ["Demo Service-12G", "guard", "rezi-12", 60],
  ["Rushline L-WATT20", "guard", "rezi-12", 63],
  ["XRK Warlord 700", "guard", "rezi-12", 63],
  // Laser
  ["Bruen 22-LPW", "laser", "m4", 49],
  ["Bruen 22-LW", "laser", "finn-lmg", 25],
  ["Corio 4DV-3", "laser", "m4", 12],
  ["Corio ODSPR+", "laser", "m4", 60],
  ["Corvus Aves-3", "laser", "krait-p68", 22],
  ["DCR-78 Laser", "laser", "sang-9mm", 4],
  ["DCR-80 Laser", "laser", "sang-9mm", 13],
  ["Expedite 21 CFR", "laser", "han-86", 29],
  ["Expedite Intra-5b", "laser", "m4", 42],
  ["Expedite Squad-304", "laser", "han-86", 58],
  ["FJX EVR7", "laser", "han-86", 11],
  ["FSS Phosphor 40", "laser", "krait-p68", 31],
  ["GW 700-V", "laser", "krait-p68", 20],
  ["GW MDL-2", "laser", "krait-p68", 3],
  ["Hanbit 2BA-00", "laser", "sang-9mm", 17],
  ["Pulse-MW Laser", "laser", "han-86", 37],
  ["QFL-S4.5", "laser", "han-86", 15],
  ["SA Laz-500", "laser", "m4", 24],
  ["Schlager Visiv-5", "laser", "han-86", 46],
  ["STOVL IRX-6", "laser", "m4", 16],
  ["STOVL TRX-6", "laser", "finn-lmg", 21],
  ["SZ DP1 Laser", "laser", "sang-9mm", 29],
  ["SZ DP5 Laser", "laser", "sang-9mm", 35],
  ["SZ Gen.6 PEQ", "laser", "m4", 2],
  ["XRK Clutch-LS", "laser", "han-86", 3],
  ["XT-100", "laser", "krait-p68", 25],
];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const APEX_ROWS: Attachment[] = APEX.map((a) => ({
  id: `att:${slugify(a.name)}`,
  name: a.name,
  type: "apex",
  unlockWeaponId: a.weaponId,
  unlockLevel: a.level,
  compatibleWeaponIds: [a.weaponId],
  description: "Apex attachment — unlocked by reaching this weapon's max level. Kept through Weapon Prestige.",
  verification: v("official", ["cod-launch-blog"]),
}));

export const ATTACHMENTS: Attachment[] = [...APEX_ROWS, ...ROWS.map(([name, type, weapon, level, note]) => ({
  id: `att:${slugify(name)}`,
  name,
  type,
  unlockWeaponId: weapon,
  unlockLevel: level,
  compatibleWeaponIds: null,
  description: null,
  verification: v("community", ["wzl-attachments"], note ?? "Single source. Compatible weapons not yet published — the attachment is unlocked once and shared, not counted per weapon."),
}))];
