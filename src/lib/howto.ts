import { CATALOG, camoById, categoryById, weaponById } from "@/data";
import type { Camo, Prereq } from "@/data/schema";

/** Readable label for a camo, with its weapon when it has one. */
export function camoLabel(c: Camo): string {
  const n = c.name ?? c.slotLabel;
  const w = c.weaponId ? weaponById.get(c.weaponId) : null;
  return w ? `${n} — ${w.name}` : n;
}

function one(p: Prereq): string {
  const wn = (id: string) => weaponById.get(id)?.name ?? id;
  switch (p.kind) {
    case "camo": {
      const c = camoById.get(p.camoId);
      return c ? `Unlock ${camoLabel(c)}` : `Unlock ${p.camoId}`;
    }
    case "weapon-level":
      return `Reach ${wn(p.weaponId)} weapon level ${p.level}`;
    case "weapon-prestige":
      return {
        p1: `Enter Weapon Prestige 1 on the ${wn(p.weaponId)}`,
        "p1-max": `Reach max level in Weapon Prestige 1 on the ${wn(p.weaponId)}`,
        master: `Enter Weapon Prestige Master on the ${wn(p.weaponId)}`,
      }[p.stage];
    case "weapon-master-level":
      return `Reach Weapon Prestige Master level ${p.level} on the ${wn(p.weaponId)}`;
    case "camo-count":
      return `Unlock ${p.count} Harmonic Break camos (any weapons)`;
  }
}

/**
 * The steps that must be done before this camo's challenge opens, written for
 * people. Long camo lists are summarised (e.g. Gold needs 11 camos).
 */
export function prerequisiteSteps(c: Camo): string[] {
  const camoPrereqs = c.prereqs.filter((p): p is Extract<Prereq, { kind: "camo" }> => p.kind === "camo");
  const other = c.prereqs.filter((p) => p.kind !== "camo").map(one);

  if (c.group === "completionist" && c.slotLabel === "Completionist 1") {
    return [...other, "Unlock all 8 Military and all 3 Special camos on this weapon"];
  }
  if (c.group === "completionist" && c.slotLabel === "Completionist 2" && c.weaponId) {
    const w = weaponById.get(c.weaponId)!;
    const cat = categoryById.get(w.category)!;
    const n = CATALOG.weapons.filter((x) => x.category === w.category && x.season === 0).length;
    return [...other, `Unlock Gold on this weapon and on all ${n} launch ${cat.name}`];
  }
  return [...other, ...camoPrereqs.map(one)];
}

/** Is any part of this record unconfirmed? Used to flag rows. */
export const isUnverified = (c: Camo) => c.verification.status === "unconfirmed";
