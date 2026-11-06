import { z } from "zod";

/**
 * Verification statuses, in order of trust.
 * Community-reported data must NEVER be presented as officially confirmed.
 */
export const VerificationStatus = z.enum([
  "official", // Officially confirmed (Activision / callofduty.com)
  "in-game", // In-game verified (seen in the MW4 UI)
  "community", // Community reported (third-party guides)
  "unconfirmed", // Unconfirmed / awaiting verification
  "retired", // Retired or changed
]);
export type VerificationStatus = z.infer<typeof VerificationStatus>;

export const VERIFICATION_LABEL: Record<VerificationStatus, string> = {
  official: "Officially confirmed",
  "in-game": "In-game verified",
  community: "Community reported",
  unconfirmed: "Unconfirmed",
  retired: "Retired / changed",
};

export const GameMode = z.enum(["mp", "dmz", "wz", "campaign", "any"]);
export type GameMode = z.infer<typeof GameMode>;
export const MODE_LABEL: Record<GameMode, string> = {
  mp: "Multiplayer",
  dmz: "DMZ",
  wz: "Warzone",
  campaign: "Campaign",
  any: "Any mode",
};

/** Every record carries its own provenance. */
export const Verification = z.object({
  status: VerificationStatus,
  sourceIds: z.array(z.string()).default([]),
  lastVerified: z.string().nullable().default(null), // ISO date
  note: z.string().optional(), // conflicts, caveats
});
export type Verification = z.infer<typeof Verification>;

export const Source = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url().nullable(),
  kind: z.enum(["official", "in-game", "community"]),
  accessed: z.string(),
});
export type Source = z.infer<typeof Source>;

export const WeaponCategoryId = z.enum([
  "assault-rifle",
  "smg",
  "shotgun",
  "lmg",
  "marksman-rifle",
  "sniper-rifle",
  "pistol",
  "launcher",
  "melee",
]);
export type WeaponCategoryId = z.infer<typeof WeaponCategoryId>;

export const WeaponCategory = z.object({
  id: WeaponCategoryId,
  name: z.string(),
  short: z.string(),
  slot: z.enum(["primary", "secondary", "melee"]),
});
export type WeaponCategory = z.infer<typeof WeaponCategory>;

export const Weapon = z.object({
  id: z.string(), // stable id == slug
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  category: WeaponCategoryId,
  season: z.number().int().min(0), // 0 = launch
  unlock: z.object({
    text: z.string().nullable(),
    playerLevel: z.number().int().nullable(),
    verification: Verification,
  }),
  maxLevel: z.object({
    value: z.number().int().nullable(),
    verification: Verification,
  }),
  description: z.string().nullable(),
  /** Raw text seen in the user's own in-game screenshots. Never interpreted beyond what is shown. */
  inGameObservations: z.array(z.string()).default([]),
  verification: Verification,
});
export type Weapon = z.infer<typeof Weapon>;

export const CamoGroup = z.enum(["military", "special", "completionist", "prestige", "mastery"]);
export type CamoGroup = z.infer<typeof CamoGroup>;

/** A per-mode requirement. MP and DMZ are always separate — never merged. */
export const ModeRequirement = z.object({
  mode: GameMode,
  text: z.string(),
  target: z.number().int().positive().nullable(), // numeric target for progress tracking
});
export type ModeRequirement = z.infer<typeof ModeRequirement>;

/** Machine-checkable prerequisite rules evaluated by the progress engine. */
export const Prereq = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("camo"), camoId: z.string() }),
  z.object({ kind: z.literal("weapon-level"), weaponId: z.string(), level: z.number().int() }),
  z.object({ kind: z.literal("weapon-prestige"), weaponId: z.string(), stage: z.enum(["p1", "p1-max", "master"]) }),
  z.object({ kind: z.literal("weapon-master-level"), weaponId: z.string(), level: z.number().int() }),
  z.object({ kind: z.literal("camo-count"), camoSuffix: z.string(), count: z.number().int() }),
]);
export type Prereq = z.infer<typeof Prereq>;

export const Camo = z.object({
  id: z.string(),
  name: z.string().nullable(), // null = name not verified
  slotLabel: z.string(), // e.g. "Special 2" — always present
  group: CamoGroup,
  order: z.number().int(),
  weaponId: z.string().nullable(), // null = account-wide
  requirements: z.array(ModeRequirement), // empty = unknown
  requiredLevel: z.number().int().nullable(),
  prereqs: z.array(Prereq),
  /** Military camos auto-complete from tracked weapon level when the level is known. */
  autoFromLevel: z.boolean().default(false),
  verification: Verification,
});
export type Camo = z.infer<typeof Camo>;

export const AttachmentType = z.enum([
  "ammunition",
  "apex",
  "barrel",
  "bolt",
  "comb",
  "cylinder",
  "guard",
  "laser",
  "magazine",
  "muzzle",
  "optic",
  "rear-grip",
  "stock",
  "trigger-action",
  "underbarrel",
]);
export type AttachmentType = z.infer<typeof AttachmentType>;

export const Attachment = z.object({
  id: z.string(),
  name: z.string(),
  type: AttachmentType,
  unlockWeaponId: z.string().nullable(),
  unlockLevel: z.number().int().nullable(),
  compatibleWeaponIds: z.array(z.string()).nullable(), // null = not verified
  description: z.string().nullable(),
  verification: Verification,
});
export type Attachment = z.infer<typeof Attachment>;

export const PlayerReward = z.object({
  id: z.string(),
  prestige: z.number().int().min(0).max(11), // 11 = Prestige Master
  level: z.number().int(), // level within that prestige (0 = instant)
  name: z.string(),
  kind: z.enum(["operator", "loading-screen", "emblem", "charm", "decal", "sticker", "blueprint", "calling-card", "icon", "level-color", "title", "other"]),
  path: z.enum(["both", "regular", "classic"]),
  verification: Verification,
});
export type PlayerReward = z.infer<typeof PlayerReward>;

export const ChallengeTier = z.object({
  tier: z.number().int(),
  requirement: ModeRequirement,
  reward: z.string().nullable(),
});

export const CallingCard = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  tiers: z.array(ChallengeTier),
  verification: Verification,
});
export type CallingCard = z.infer<typeof CallingCard>;

export const CareerChallenge = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  tiers: z.array(ChallengeTier),
  prereqIds: z.array(z.string()),
  verification: Verification,
});
export type CareerChallenge = z.infer<typeof CareerChallenge>;

export const Catalog = z.object({
  dataVersion: z.string(),
  game: z.literal("Call of Duty: Modern Warfare 4"),
  currentSeason: z.number().int(),
  sources: z.array(Source),
  categories: z.array(WeaponCategory),
  weapons: z.array(Weapon),
  camos: z.array(Camo),
  attachments: z.array(Attachment),
  attachmentTypeTotals: z.record(z.string(), z.number().int()),
  playerPrestige: z.object({
    maxLevel: z.number().int(),
    prestigeCount: z.number().int(),
    masterMaxLevel: z.number().int(),
    verification: Verification,
    prestigeThemes: z.array(z.object({ prestige: z.number().int(), inspiredBy: z.string(), regularName: z.string(), classicName: z.string() })),
    rewards: z.array(PlayerReward),
  }),
  callingCards: z.array(CallingCard),
  careerChallenges: z.array(CareerChallenge),
});
export type Catalog = z.infer<typeof Catalog>;
