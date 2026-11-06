import { ATTACHMENT_TYPE_LABEL, CATALOG, camoDisplayName, weaponById } from "@/data";
import { KIND_LABEL, LOADOUT, OPERATORS, OPERATOR_SOURCE_LABEL } from "@/data/loadout";

export type SearchKind = "weapon" | "category" | "camo" | "challenge" | "attachment" | "prestige" | "gear" | "operator";

export interface SearchDoc {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  href: string;
  haystack: string;
}

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
// "wz55" should match "Wz.55" — also index the squashed form
const squash = (s: string) => norm(s).replace(/ /g, "");

function doc(d: Omit<SearchDoc, "haystack">, extra = ""): SearchDoc {
  const base = `${d.title} ${d.subtitle} ${extra}`;
  return { ...d, haystack: `${norm(base)} ${squash(d.title)}` };
}

let STATIC: SearchDoc[] | null = null;

export function staticIndex(): SearchDoc[] {
  if (STATIC) return STATIC;
  const docs: SearchDoc[] = [];
  for (const c of CATALOG.categories) {
    docs.push(doc({ id: `cat:${c.id}`, kind: "category", title: c.name, subtitle: "Weapon class", href: `/weapons/?class=${c.id}` }, c.short));
  }
  for (const w of CATALOG.weapons) {
    const cat = CATALOG.categories.find((c) => c.id === w.category)!;
    docs.push(doc({ id: w.id, kind: "weapon", title: w.name, subtitle: `${cat.name} · ${w.unlock.text ?? ""}`, href: `/weapons/${w.slug}/` }, cat.short));
  }
  for (const c of CATALOG.camos) {
    const w = c.weaponId ? weaponById.get(c.weaponId) : null;
    const where = w ? w.name : "Account-wide";
    const href = w ? `/weapons/${w.slug}/?camo=${encodeURIComponent(c.id)}` : c.group === "mastery" ? `/mastery/#${encodeURIComponent(c.id)}` : `/camos/?group=completionist`;
    const reqs = c.requirements.map((r) => r.text).join(" ");
    if (c.name) docs.push(doc({ id: c.id, kind: c.group === "prestige" ? "prestige" : "camo", title: camoDisplayName(c), subtitle: `${c.slotLabel} · ${where}`, href }, reqs));
    if (reqs) docs.push(doc({ id: `${c.id}#req`, kind: "challenge", title: c.requirements[0].text, subtitle: `${camoDisplayName(c)} · ${where}`, href }, reqs));
  }
  for (const a of CATALOG.attachments) {
    const w = a.unlockWeaponId ? weaponById.get(a.unlockWeaponId) : null;
    docs.push(doc({ id: a.id, kind: "attachment", title: a.name, subtitle: `${ATTACHMENT_TYPE_LABEL[a.type]}${w ? ` · ${w.name} level ${a.unlockLevel}` : ""}`, href: `/attachments/?q=${encodeURIComponent(a.name)}` }));
  }
  for (const r of CATALOG.playerPrestige.rewards) {
    const where = r.prestige === 11 ? `Prestige Master level ${r.level}` : `Prestige ${r.prestige}${r.level ? ` level ${r.level}` : ""}`;
    docs.push(doc({ id: r.id, kind: "prestige", title: r.name, subtitle: where, href: `/prestige/#p${r.prestige}` }));
  }
  for (const g of LOADOUT) {
    docs.push(doc({ id: g.id, kind: "gear", title: g.name, subtitle: `${KIND_LABEL[g.kind]}${g.slot ? ` · ${g.slot}` : ""} · Player level ${g.level}`, href: `/equipment/#${g.id.replace(":", "-")}` }, g.summary ?? ""));
  }
  for (const o of OPERATORS) {
    docs.push(doc({ id: o.id, kind: "operator", title: o.name, subtitle: `${OPERATOR_SOURCE_LABEL[o.source]} · ${o.how}`, href: `/operators/#${o.id.replace(":", "-")}` }));
  }
  STATIC = docs;
  return docs;
}

const KIND_WEIGHT: Record<SearchKind, number> = { weapon: 40, category: 30, operator: 22, gear: 20, camo: 20, prestige: 15, attachment: 10, challenge: 5 };

/** Token AND-match with partial-prefix support; ranks title hits above body hits. */
export function search(query: string, docs: SearchDoc[], limit = 30): SearchDoc[] {
  const q = norm(query);
  if (!q) return [];
  const tokens = q.split(" ");
  const qs = squash(query);
  const scored: { d: SearchDoc; s: number }[] = [];
  for (const d of docs) {
    if (!tokens.every((t) => d.haystack.includes(t)) && !d.haystack.includes(qs)) continue;
    const title = norm(d.title);
    let s = KIND_WEIGHT[d.kind];
    if (title === q || squash(d.title) === qs) s += 100;
    else if (title.startsWith(q) || squash(d.title).startsWith(qs)) s += 60;
    else if (tokens.every((t) => title.includes(t))) s += 30;
    scored.push({ d, s });
  }
  return scored.sort((a, b) => b.s - a.s || a.d.title.localeCompare(b.d.title)).slice(0, limit).map((x) => x.d);
}
