import { z } from "zod";
import { Verification } from "./schema";
import { v } from "./weapons";

/**
 * Non-weapon unlocks from Activision's launch post, cross-checked against
 * TimeSaver's unlock table (all 67 levels agree). Descriptions are short
 * paraphrases of the launch post; items it doesn't describe have none.
 */
export const LoadoutItem = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.enum(["tactical", "lethal", "field-upgrade", "perk", "killstreak"]),
  level: z.number().int().min(1).max(55),
  /** Perk slot (1–3), killstreak kill cost, or field-upgrade recharge speed */
  slot: z.string().nullable(),
  summary: z.string().nullable(), // null = no verified description
  verification: Verification,
});
export type LoadoutItem = z.infer<typeof LoadoutItem>;

export const Operator = z.object({
  id: z.string(),
  name: z.string(),
  source: z.enum(["base", "pre-order", "vault", "campaign", "dmz", "multiplayer", "bundle", "classified"]),
  how: z.string(),
  verification: Verification,
});
export type Operator = z.infer<typeof Operator>;

const SRC = ["cod-launch-blog", "timesaver-unlocks"];
const ok = () => v("official", SRC);
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type R = [string, number, string | null, string | null];
const make = (kind: LoadoutItem["kind"], rows: R[]): LoadoutItem[] =>
  rows.map(([name, level, slot, summary]) => ({ id: `${kind}:${slug(name)}`, name, kind, level, slot, summary, verification: ok() }));

export const TACTICALS = make("tactical", [
  ["Flash Grenade", 4, null, "Blinds and deafens anyone caught in it."],
  ["Smoke Grenade", 4, null, "Smoke screen that blocks sight and automated targeting."],
  ["Snapshot Grenade", 10, null, "Briefly reveals nearby enemies to your team."],
  ["Concussion Grenade", 15, null, "Disorients enemies in the blast."],
  ["Heartbeat Sensor", 23, null, "Shows the location of nearby enemies."],
  ["Shock Stick", 29, null, "Sticks to surfaces; disables equipment and vehicles."],
  ["Decoy Grenade", 42, null, "Fakes gunfire, movement and radar pings."],
  ["Stim", 47, null, "Restores health and sprint; reduces flash and stun."],
  ["Screamer Mine", 53, null, "Proximity mine that suppresses and marks enemies."],
]);

export const LETHALS = make("lethal", [
  ["Frag Grenade", 4, null, "Fragmentation grenade you can cook."],
  ["Sticky Grenade", 4, null, "Timed grenade that sticks where it lands."],
  ["Drill Charge", 7, null, "Drills through a surface, then explodes."],
  ["Proximity Mine", 13, null, "Pops up and detonates in the air when triggered."],
  ["Zip Gun", 17, null, "Single-use 3D-printed pistol."],
  ["Trip Wire", 22, null, "Explosive trap that can be chained to others."],
  ["Thermite", 26, null, "Sticky incendiary; strong against vehicles and armor."],
  ["Molotov Cocktail", 28, null, "Leaves a pool of fire where it lands."],
  ["Claymore", 37, null, "Directional mine triggered by proximity."],
  ["C4", 43, null, "Sticks to surfaces; detonate remotely."],
  ["Throwing Knife", 49, null, "Retrievable; kills on impact."],
]);

export const FIELD_UPGRADES = make("field-upgrade", [
  ["Portable Radar", 4, "Medium recharge", "Pings nearby enemies at intervals."],
  ["DDOS", 4, "Fast recharge", "Jams nearby enemy electronics."],
  ["Munitions Box", 6, "Medium recharge", "Resupplies ammo and equipment for your team."],
  ["SAM Airburst Turret", 8, "Slow recharge", "Shoots down aerial threats."],
  ["Riot Shield", 11, "Medium recharge", "Deployable cover that can be destroyed."],
  ["Trophy System", 14, "Fast recharge", "Destroys up to three incoming projectiles."],
  ["Seeker Drone", 19, "Slow recharge", "Hunts enemies and snapshots them."],
  ["Inflatable Decoy", 25, "Medium recharge", "Pops up a decoy to distract enemies."],
  ["Smoke Wall", 29, "Medium recharge", "Deploys a dense wall of smoke."],
  ["Recon Drone", 33, "Slow recharge", "Remote-piloted drone that marks targets."],
  ["Razor Wire Trap", 41, "Medium recharge", "Proximity trap that snares enemies."],
  ["Tactical Insertion", 45, "Medium recharge", "Sets your next spawn point."],
]);

export const PERKS = make("perk", [
  ["Quick Fix", 4, "Perk 1", null],
  ["Overkill", 4, "Perk 1", null],
  ["High Alert", 8, "Perk 1", null],
  ["Ghost", 24, "Perk 1", null],
  ["Resupply", 31, "Perk 1", null],
  ["Kill Chain", 48, "Perk 1", null],
  ["Hardline", 4, "Perk 2", null],
  ["Blood Rush", 4, "Perk 2", null],
  ["Bomb Squad", 16, "Perk 2", null],
  ["Fast Hands", 20, "Perk 2", null],
  ["Ninja", 30, "Perk 2", null],
  ["Birdseye", 40, "Perk 2", null],
  ["Lethal Reach", 4, "Perk 3", null],
  ["Combat Grid", 4, "Perk 3", null],
  ["Battle Hardened", 12, "Perk 3", null],
  ["Scavenger", 28, "Perk 3", null],
  ["Tracker", 32, "Perk 3", null],
  ["Cold-Blooded", 36, "Perk 3", null],
]).map((p) => (p.name === "Tracker" ? { ...p, verification: v("official", SRC, "One guide's appendix lists level 31; the launch post and its main table say 32.") } : p));

export const KILLSTREAKS = make("killstreak", [
  ["UAV", 4, "4 kills", null],
  ["Bomb Glider", 6, "4 kills", null],
  ["Care Package", 9, "4 kills", null],
  ["Impact Warhead", 12, "4 kills", null],
  ["Artillery Beacon", 4, "6 kills", null],
  ["Crossfire", 20, "6 kills", null],
  ["Combat Drone", 26, "6 kills", null],
  ["Counter UAV", 31, "6 kills", null],
  ["Wheelson", 16, "8 kills", null],
  ["Missile Salvo", 24, "8 kills", null],
  ["Railgun Sentry", 38, "8 kills", null],
  ["Attack Helicopter", 4, "10 kills", null],
  ["Deathstalker", 35, "10 kills", null],
  ["Advanced UAV", 40, "10 kills", null],
  ["Argonaut", 45, "10 kills", null],
  ["Gunship", 51, "12 kills", null],
  ["Air Lockdown", 55, "12 kills", null],
]);

export const LOADOUT: LoadoutItem[] = [...TACTICALS, ...LETHALS, ...FIELD_UPGRADES, ...PERKS, ...KILLSTREAKS];

export const KIND_LABEL: Record<LoadoutItem["kind"], string> = {
  tactical: "Tactical",
  lethal: "Lethal",
  "field-upgrade": "Field Upgrade",
  perk: "Perk",
  killstreak: "Killstreak",
};

const op = (name: string, source: Operator["source"], how: string, status: Verification["status"] = "official"): Operator => ({
  id: `op:${slug(name)}`,
  name,
  source,
  how,
  verification: v(status, ["cod-launch-blog"], status === "unconfirmed" ? "Listed as classified in the launch post." : undefined),
});

export const OPERATORS: Operator[] = [
  ...["Min-Hee", "CTSFO", "Mil-Sim KSK Arctic", "UCTF", "Army SF Airborne"].map((n) => op(n, "base", "Available from the start")),
  op("Hunter Killer", "pre-order", "Pre-order Modern Warfare 4 (Digital Standard or Vault Edition)"),
  ...["Ghost", "Blix", "Valeria", "Price", "SAS", "South Korean SF", "COM FST", "KSK Amphibious"].map((n) => op(n, "vault", "Included with the Vault Edition")),
  op("Cho", "campaign", "Complete the campaign mission “Mayhem”"),
  op("Dallas", "campaign", "Complete the campaign mission “Hired Gun”"),
  op("Luca", "campaign", "Complete the campaign mission “Traffic”"),
  op("Oh-Ji", "campaign", "Complete the campaign mission “Assassins”"),
  op("Kal", "campaign", "Complete the campaign mission “Defection”"),
  op("Dunn", "campaign", "Complete the campaign mission “Counter Attack”"),
  op("West", "campaign", "Complete the campaign mission “Losing Ground”"),
  op("Park", "campaign", "Complete the campaign mission “Decapitation”"),
  op("Reece", "dmz", "Reach DMZ Level 4"),
  op("Coffey", "dmz", "Reach DMZ Level 9"),
  op("Simone", "dmz", "Reach DMZ Level 15"),
  op("Hector", "dmz", "Reach DMZ Level 19"),
  op("Blackwell", "multiplayer", "Get 3 Operator kills without dying, 10 times"),
  op("Jae", "multiplayer", "Get 50 hipfire Operator kills"),
  op("Velikan", "multiplayer", "Get 15 Operator double kills or better"),
  op("Valen", "multiplayer", "Get 20 longshot Operator kills"),
  op("Zimo", "multiplayer", "Get 50 headshot Operator kills"),
  op("Kyle", "bundle", "C.O.D.E. Valor Pack (available in Warzone Season 1)"),
  op("Ju Kwon", "classified", "Unlock method classified", "unconfirmed"),
];

export const OPERATOR_SOURCE_LABEL: Record<Operator["source"], string> = {
  base: "Starting operators",
  "pre-order": "Pre-order",
  vault: "Vault Edition",
  campaign: "Campaign",
  dmz: "DMZ",
  multiplayer: "Multiplayer challenges",
  bundle: "Store bundle",
  classified: "Classified",
};

/** Other milestone unlocks on the 1–55 path. */
export const MILESTONES = [
  { level: 2, name: "Demolition default loadout" },
  { level: 3, name: "Sniper default loadout" },
  { level: 4, name: "Create-a-Class" },
  { level: 55, name: "Prestige choice (Classic or Regular)" },
];
