"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CATALOG, camoById } from "@/data";
import type { CamoGroup, WeaponCategoryId } from "@/data/schema";
import { CamoDetail, CamoTile, GROUP_LABEL } from "@/components/Camo";
import { Stagger } from "@/components/motion";
import { EmptyState, PageHeader, Panel } from "@/components/ui";

const GROUPS: CamoGroup[] = ["military", "special", "completionist", "prestige", "mastery"];
type ModeF = "all" | "mp" | "dmz" | "wz";
const PAGE = 96;

const HOW: Record<CamoGroup, string> = {
  military: "8 per weapon. Unlocked by leveling the weapon.",
  special: "3 per weapon. Each opens at a weapon level, then needs a challenge.",
  completionist: "Gold, Platinum and Harmonic Break per weapon, then account-wide Divergence.",
  prestige: "4 Pyroclast stages per weapon, earned through Weapon Prestige.",
  mastery: "Account-wide, after Divergence: 3 each for Multiplayer, DMZ and Warzone.",
};

export default function Camos() {
  const params = useSearchParams();
  const [groups, setGroups] = useState<Set<CamoGroup>>(() => {
    const g = params.get("group") as CamoGroup | null;
    return new Set(g && GROUPS.includes(g) ? [g] : []);
  });
  const [weapon, setWeapon] = useState("");
  const [cls, setCls] = useState<WeaponCategoryId | "">("");
  const [mode, setMode] = useState<ModeF>("all");
  const [named, setNamed] = useState(false);
  const [limit, setLimit] = useState(PAGE);
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (g: CamoGroup) =>
    setGroups((s) => {
      const n = new Set(s);
      if (n.has(g)) n.delete(g);
      else n.add(g);
      return n;
    });

  const all = CATALOG.camos;
  const filtered = all.filter((c) => {
    if (groups.size && !groups.has(c.group)) return false;
    if (weapon && c.weaponId !== weapon) return false;
    if (cls && (!c.weaponId || CATALOG.weapons.find((w) => w.id === c.weaponId)?.category !== cls)) return false;
    if (mode !== "all" && !c.requirements.some((r) => r.mode === mode)) return false;
    if (named && !c.name) return false;
    return true;
  });
  const shown = filtered.slice(0, limit);

  return (
    <>
      <PageHeader code="04 · Camos" title="Camos" sub="Every camo slot on every weapon and how to unlock it. Names and challenges appear where they've been published; the rest are marked." />

      <div className="mb-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {GROUPS.map((g) => (
          <button key={g} type="button" onClick={() => toggle(g)} aria-pressed={groups.has(g)} className={`rounded-[3px] border p-3 text-left transition-colors ${groups.has(g) ? "border-olive bg-olive/10" : "border-line bg-card hover:border-line-2"}`}>
            <div className="flex items-baseline justify-between"><span className={`h-display text-lg ${g === "prestige" || g === "mastery" ? "text-gold" : "text-fg"}`}>{GROUP_LABEL[g]}</span><span className="font-mono text-[10.5px] text-faint">{all.filter((c) => c.group === g).length}</span></div>
            <p className="mt-1 text-xs leading-snug text-dim">{HOW[g]}</p>
          </button>
        ))}
      </div>

      <Panel className="mb-5">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <select className="field" value={weapon} onChange={(e) => setWeapon(e.target.value)} aria-label="Weapon">
            <option value="">All weapons</option>
            {CATALOG.weapons.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
          <select className="field" value={cls} onChange={(e) => setCls(e.target.value as WeaponCategoryId | "")} aria-label="Weapon class">
            <option value="">All classes</option>
            {CATALOG.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="field" value={mode} onChange={(e) => setMode(e.target.value as ModeF)} aria-label="Game mode">
            <option value="all">All modes</option>
            <option value="mp">Multiplayer</option>
            <option value="dmz">DMZ</option>
            <option value="wz">Warzone</option>
          </select>
          <label className="flex h-9 cursor-pointer items-center gap-2 rounded-[3px] border border-line bg-bg-2 px-3 text-sm text-dim">
            <input type="checkbox" checked={named} onChange={(e) => setNamed(e.target.checked)} className="accent-[#A5AE73]" /> Published names only
          </label>
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-dim">
          <span>{filtered.length} camos · {filtered.filter((c) => c.requirements.length).length} with published challenges</span>
          {(groups.size > 0 || weapon || cls || mode !== "all" || named) && (
            <button type="button" className="hover:text-fg" onClick={() => { setGroups(new Set()); setWeapon(""); setCls(""); setMode("all"); setNamed(false); }}>Reset filters</button>
          )}
        </div>
      </Panel>

      {filtered.length === 0 ? (
        <EmptyState title="No camos match these filters" />
      ) : (
        <>
          <Stagger step={0.01} key={`${[...groups].join()}|${weapon}|${cls}|${mode}|${named}`} className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
            {shown.map((c) => <Stagger.Item key={c.id}><CamoTile c={c} showWeapon onOpen={() => setOpen(c.id)} /></Stagger.Item>)}
          </Stagger>
          {filtered.length > limit && (
            <div className="mt-6 flex justify-center">
              <button type="button" className="btn" onClick={() => setLimit((l) => l + PAGE * 2)}>Show more ({filtered.length - limit} left)</button>
            </div>
          )}
        </>
      )}
      <CamoDetail c={open ? camoById.get(open) ?? null : null} onClose={() => setOpen(null)} />
    </>
  );
}
