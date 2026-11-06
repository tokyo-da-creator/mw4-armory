"use client";

import { Lock, Search } from "lucide-react";
import { useState } from "react";
import { CATALOG, DIVERGENCE_ID, camoById, camoDisplayName, weaponById } from "@/data";
import type { CamoGroup } from "@/data/schema";
import { OPERATORS } from "@/data/loadout";
import { CamoDetail, CamoRow, GROUP_LABEL } from "@/components/Camo";
import { CardButton, EmptyState, ModeTag, PageHeader, Panel, Pending, VBadge } from "@/components/ui";
import { prerequisiteSteps } from "@/lib/howto";

export function Mastery() {
  const [open, setOpen] = useState<string | null>(null);
  const chains = (["mp", "dmz", "wz"] as const).map((m) => ({ m, list: CATALOG.camos.filter((c) => c.id.startsWith(`mastery:${m}:`)) }));
  const div = camoById.get(DIVERGENCE_ID)!;
  return (
    <>
      <PageHeader code="09 · Mastery" title="Mastery" sub="Account-wide camos at the top of the grind. Each mode's three tiers unlock in order after Divergence." />
      <Panel title="Gate: Divergence" code="GATE" className="mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-fg">{div.requirements[0].text}. Harmonic Break is the third Completionist camo on each weapon.</p>
          <VBadge v={div.verification} compact />
        </div>
      </Panel>
      <div className="grid gap-4 lg:grid-cols-3">
        {chains.map(({ m, list }) => (
          <Panel key={m} title={m === "mp" ? "Multiplayer" : m === "dmz" ? "DMZ" : "Warzone"} code="3 TIERS">
            <ol className="space-y-3">
              {list.map((c, i) => (
                <li key={c.id} id={c.id}>
                  <CardButton onClick={() => setOpen(c.id)} label={`${c.name} — how to unlock`} className="w-full rounded-[3px] border border-line p-3 text-left transition-colors hover:border-gold/60">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-mono text-[10px] tracking-[0.16em] text-gold">TIER {i + 1}</div>
                        <div className="h-display text-xl text-fg">{c.name}</div>
                      </div>
                      <VBadge v={c.verification} compact />
                    </div>
                    <p className="mt-1 text-sm text-dim">{c.requirements[0]?.text ?? "Requirement classified until Warzone integration."}</p>
                    <p className="mt-2 flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-faint"><Lock size={10} /> After {prerequisiteSteps(c)[0]?.replace(/^Unlock /, "")}</p>
                  </CardButton>
                </li>
              ))}
            </ol>
          </Panel>
        ))}
      </div>
      <CamoDetail c={open ? camoById.get(open) ?? null : null} onClose={() => setOpen(null)} />
    </>
  );
}

const GROUPS: CamoGroup[] = ["military", "special", "completionist", "prestige", "mastery"];

export function Challenges() {
  const [open, setOpen] = useState<string | null>(null);
  const [group, setGroup] = useState<CamoGroup | "">("");
  const [mode, setMode] = useState<"mp" | "dmz" | "">("");
  const [cls, setCls] = useState("");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(80);
  const list = CATALOG.camos
    .filter((c) => c.requirements.length > 0)
    .filter((c) => {
      const w = c.weaponId ? weaponById.get(c.weaponId) : null;
      if (group && c.group !== group) return false;
      if (mode && !c.requirements.some((r) => r.mode === mode)) return false;
      if (cls && w?.category !== cls) return false;
      if (q) {
        const hay = `${camoDisplayName(c)} ${w?.name ?? ""} ${c.requirements.map((r) => r.text).join(" ")}`.toLowerCase();
        if (!q.toLowerCase().split(/\s+/).every((t) => hay.includes(t))) return false;
      }
      return true;
    });
  const opChallenges = OPERATORS.filter((o) => o.source === "multiplayer" && (!q || `${o.name} ${o.how}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <>
      <PageHeader code="10 · Challenges" title="All Challenges" sub="Every published MW4 challenge in one list. Multiplayer and DMZ requirements are always listed separately." />
      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        <div className="relative col-span-2 md:col-span-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input className="field pl-9" placeholder="e.g. headshots, mounted" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search challenges" />
        </div>
        <select className="field" value={group} onChange={(e) => setGroup(e.target.value as CamoGroup | "")} aria-label="Camo group"><option value="">All camo groups</option>{GROUPS.map((g) => <option key={g} value={g}>{GROUP_LABEL[g]}</option>)}</select>
        <select className="field" value={mode} onChange={(e) => setMode(e.target.value as "mp" | "dmz" | "")} aria-label="Mode"><option value="">All modes</option><option value="mp">Multiplayer</option><option value="dmz">DMZ</option></select>
        <select className="field" value={cls} onChange={(e) => setCls(e.target.value)} aria-label="Class"><option value="">All classes</option>{CATALOG.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      </div>

      {opChallenges.length > 0 && !group && !cls && mode !== "dmz" && (
        <Panel title="Operator challenges" code="OPS" className="mb-4">
          <ul>
            {opChallenges.map((o) => (
              <li key={o.id} className="flex items-center gap-3 border-b border-line py-2.5 last:border-0">
                <ModeTag mode="mp" />
                <span className="w-24 shrink-0 text-sm font-medium text-fg">{o.name}</span>
                <span className="flex-1 text-sm text-dim">{o.how}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel title={`Camo challenges · ${list.length}`} code="DB">
        {list.length === 0 ? <EmptyState title="No challenges match" /> : list.slice(0, limit).map((c) => <CamoRow key={c.id} c={c} onOpen={() => setOpen(c.id)} />)}
        {list.length > limit && <div className="mt-4 flex justify-center"><button type="button" className="btn" onClick={() => setLimit(limit + 160)}>Show more ({list.length - limit})</button></div>}
      </Panel>

      <div className="mt-4">
        <Pending>
          <span className="text-fg">Calling card, career and reticle challenges</span> haven&apos;t been published by a reliable source yet. They&apos;ll be added here once they can be verified, rather than guessed or copied from another Call of Duty game.
        </Pending>
      </div>
      <CamoDetail c={open ? camoById.get(open) ?? null : null} onClose={() => setOpen(null)} />
    </>
  );
}
