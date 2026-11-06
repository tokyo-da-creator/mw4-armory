import { weaponById } from "@/data";
import type { Camo, Weapon } from "@/data/schema";

/**
 * Links out to public video search so players can see the real in-game look.
 * MW4 Armory hosts no game artwork; these open third-party results on YouTube.
 */
const yt = (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

export const weaponVideoUrl = (w: Weapon) => yt(`Modern Warfare 4 ${w.name} gunsmith`);

export function camoVideoUrl(c: Camo): string {
  const w = c.weaponId ? weaponById.get(c.weaponId) : null;
  if (!w) return yt(`Modern Warfare 4 ${c.name ?? c.slotLabel} ${c.group === "mastery" ? "mastery " : ""}camo`);
  return yt(c.name ? `Modern Warfare 4 ${w.name} ${c.name} camo` : `Modern Warfare 4 ${w.name} camos`);
}
