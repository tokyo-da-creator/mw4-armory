import { CATALOG, categoryById } from "@/data";
import { KIND_LABEL, LOADOUT, MILESTONES } from "@/data/loadout";

export type UnlockKind = "weapon" | "tactical" | "lethal" | "field-upgrade" | "perk" | "killstreak" | "feature";

export interface LevelUnlock {
  level: number;
  kind: UnlockKind;
  name: string;
  detail: string;
  href: string;
  /** Activision's post also gives this level for the same item */
  altLevel?: number;
}

export const UNLOCK_KIND_LABEL: Record<UnlockKind, string> = { weapon: "Weapon", feature: "Feature", ...KIND_LABEL };

/** Everything unlocked by player level 1–55, from the official launch data. */
export function levelUnlocks(): LevelUnlock[] {
  const out: LevelUnlock[] = [];
  for (const w of CATALOG.weapons) {
    if (w.season !== 0 || w.unlock.playerLevel === null) continue;
    const alt = w.unlock.verification.status === "unconfirmed" ? Number(w.unlock.verification.note?.match(/weapon card says level (\d+)/)?.[1]) : undefined;
    out.push({ level: w.unlock.playerLevel, kind: "weapon", name: w.name, detail: categoryById.get(w.category)!.name, href: `/weapons/${w.slug}/`, altLevel: alt && !Number.isNaN(alt) ? alt : undefined });
  }
  for (const g of LOADOUT) out.push({ level: g.level, kind: g.kind, name: g.name, detail: g.slot ?? KIND_LABEL[g.kind], href: `/equipment/#${g.id.replace(":", "-")}` });
  for (const m of MILESTONES) out.push({ level: m.level, kind: "feature", name: m.name, detail: "Feature", href: m.level === 55 ? "/prestige/" : "/unlocks/" });
  const order: UnlockKind[] = ["feature", "weapon", "perk", "killstreak", "field-upgrade", "lethal", "tactical"];
  return out.sort((a, b) => a.level - b.level || order.indexOf(a.kind) - order.indexOf(b.kind) || a.name.localeCompare(b.name));
}

export function byLevel(list: LevelUnlock[]): Map<number, LevelUnlock[]> {
  const m = new Map<number, LevelUnlock[]>();
  for (const u of list) m.set(u.level, [...(m.get(u.level) ?? []), u]);
  return m;
}
