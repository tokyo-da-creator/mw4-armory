import { ATTACHMENTS, ATTACHMENT_TYPE_TOTALS } from "./attachments";
import { CAMOS } from "./camos";
import { PLAYER_PRESTIGE } from "./playerPrestige";
import { Catalog, type Camo, type Weapon } from "./schema";
import { SOURCES } from "./sources";
import { CATEGORIES, WEAPONS } from "./weapons";

/**
 * The static game database. Versioned independently from user progress so a
 * new season can ship new records without touching anyone's saved data.
 */
export const DATA_VERSION = "2026.11.05-s1";

/** Parsed through Zod at import time — a malformed record fails the build. */
export const CATALOG: Catalog = Catalog.parse({
  dataVersion: DATA_VERSION,
  game: "Call of Duty: Modern Warfare 4",
  currentSeason: 1,
  sources: SOURCES,
  categories: CATEGORIES,
  weapons: WEAPONS,
  camos: CAMOS,
  attachments: ATTACHMENTS,
  attachmentTypeTotals: ATTACHMENT_TYPE_TOTALS,
  playerPrestige: PLAYER_PRESTIGE,
  // No calling-card or career-challenge list has been published by a reliable
  // source yet. The system is fully built; records will be added as verified.
  callingCards: [],
  careerChallenges: [],
});

export const weaponById = new Map(CATALOG.weapons.map((w) => [w.id, w]));
export const camoById = new Map(CATALOG.camos.map((c) => [c.id, c]));
export const sourceById = new Map(CATALOG.sources.map((s) => [s.id, s]));
export const categoryById = new Map(CATALOG.categories.map((c) => [c.id, c]));

export const camosForWeapon = (id: string): Camo[] => CATALOG.camos.filter((c) => c.weaponId === id);

export const weaponsByCategory = (): { category: (typeof CATALOG.categories)[number]; weapons: Weapon[] }[] =>
  CATALOG.categories.map((category) => ({ category, weapons: CATALOG.weapons.filter((w) => w.category === category.id) }));

export function camoDisplayName(c: Camo): string {
  return c.name ?? `${c.slotLabel} (name unverified)`;
}

export { ATTACHMENT_TYPE_LABEL } from "./attachments";
export { DIVERGENCE_ID } from "./camos";
export { PRESTIGE_MASTER } from "./playerPrestige";
