"use client";

import { Medal, Shield } from "lucide-react";
import { useState } from "react";
import { CATALOG, PRESTIGE_MASTER, camoById } from "@/data";
import { CamoDetail } from "@/components/Camo";
import { Stagger } from "@/components/motion";
import { CardButton, LevelTag, PageHeader, Panel, Segmented, VBadge } from "@/components/ui";

const PYRO = ["pyroclast", "pyroclast-terminus", "pyroclast-scatter", "pyroclast-cascade"];

export default function Prestige() {
  const [view, setView] = useState<"player" | "weapon">("player");
  const [open, setOpen] = useState<string | null>(null);
  const pp = CATALOG.playerPrestige;
  const ranks = [...pp.prestigeThemes.map((t) => t.prestige), PRESTIGE_MASTER];

  return (
    <>
      <PageHeader code="08 · Prestige" title="Prestige" sub="Two separate systems: your player rank, and each weapon's own prestige track.">
        <Segmented label="Prestige system" value={view} onChange={setView} options={[{ value: "player", label: "Player" }, { value: "weapon", label: "Weapon" }]} />
      </PageHeader>

      {view === "player" ? (
        <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <Panel title={<span className="flex items-center gap-2"><Shield size={15} className="text-gold" /> How it works</span>} code="SYS" bracket>
              <ul className="space-y-2.5 text-sm leading-relaxed text-dim">
                <li>Level 1 to <span className="text-fg">55</span> (Commander), then 10 Prestige ranks, then <span className="text-fg">Prestige Master</span> from level 56 to 1,000.</li>
                <li><span className="text-fg">Classic</span> resets level unlocks and Create-a-Class, and gives +20% XP, one Permanent Unlock Token and “Prime” cosmetics.</li>
                <li><span className="text-fg">Regular</span> restarts at level 1 but keeps every unlock.</li>
                <li>You choose a path after level 55 and again on each new Prestige.</li>
              </ul>
              <div className="mt-3"><VBadge v={pp.verification} /></div>
            </Panel>
          </div>

          <ol className="space-y-3">
            {ranks.map((rank) => {
              const theme = pp.prestigeThemes.find((t) => t.prestige === rank);
              const list = pp.rewards.filter((r) => r.prestige === rank);
              return (
                <li key={rank} id={`p${rank}`} className="panel scroll-mt-20">
                  <div className="flex items-center gap-3 border-b border-line px-4 py-3">
                    <span className="flex h-9 w-9 items-center justify-center border border-gold/60 bg-gold/10 font-mono text-sm text-gold">{rank === PRESTIGE_MASTER ? "M" : rank}</span>
                    <div>
                      <div className="h-display text-xl text-fg">{rank === PRESTIGE_MASTER ? "Prestige Master" : `Prestige ${rank}`}</div>
                      <div className="text-xs text-dim">{theme ? `Inspired by ${theme.inspiredBy}` : "Levels 56–1,000 · final title Prestige Legend"}</div>
                    </div>
                  </div>
                  <ul className="px-4 py-2">
                    {list.map((r) => (
                      <li key={r.id} className="flex items-center gap-3 py-1.5 text-sm">
                        <span className="w-[72px] shrink-0 font-mono text-[11px] text-faint">{r.level === 0 ? "INSTANT" : `LEVEL ${r.level}`}</span>
                        <span className="text-fg">{r.name}</span>
                        {r.path !== "both" && <span className="font-mono text-[10px] uppercase text-faint">{r.path}</span>}
                      </li>
                    ))}
                    {rank > 1 && rank < PRESTIGE_MASTER && <li className="py-1.5 text-xs text-faint">Rewards at levels 10–40 for this Prestige haven&apos;t been published yet.</li>}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      ) : (
        <div className="space-y-4">
          <Panel title={<span className="flex items-center gap-2"><Medal size={15} className="text-gold" /> Pyroclast — the weapon prestige camo</span>} code="PRS">
            <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {PYRO.map((k, i) => {
                const c = camoById.get(`han-86:${k}`)!;
                return (
                  <Stagger.Item key={k}>
                    <CardButton onClick={() => setOpen(c.id)} label={`${c.name} — how to unlock`} className="h-full w-full rounded-[3px] border border-gold/25 bg-[linear-gradient(160deg,rgb(196_164_91/0.1),transparent_60%)] p-4 text-left transition-colors hover:border-gold/60">
                      <div className="mb-1 flex items-center justify-between"><span className="font-mono text-[10px] tracking-[0.16em] text-gold">STAGE {i + 1}</span><VBadge v={c.verification} compact /></div>
                      <div className="h-display text-2xl text-fg">{c.name}</div>
                      <div className="mt-1 text-sm leading-snug text-dim">{c.requirements[0].text}</div>
                    </CardButton>
                  </Stagger.Item>
                );
              })}
            </Stagger>
          </Panel>
          <Panel title="How weapon prestige works" code="SYS">
            <ul className="space-y-2 text-sm leading-relaxed text-dim">
              <li>• At a weapon&apos;s max level you can enter <span className="text-fg">Prestige 1</span>. The weapon returns to level 1 and its standard attachments lock again. Apex and blueprint attachments stay.</li>
              <li>• Reaching max level again moves it into <span className="text-fg">Prestige Master</span>, which resets nothing and keeps counting.</li>
              <li>• Every weapon has the same four Pyroclast stages. Camos you&apos;ve earned are never lost.</li>
            </ul>
          </Panel>
          <Panel title="Max level by weapon" code="MAX">
            <ul className="grid gap-x-6 sm:grid-cols-2 xl:grid-cols-3">
              {[...CATALOG.weapons].sort((a, b) => (b.maxLevel.value ?? 0) - (a.maxLevel.value ?? 0)).map((w) => (
                <li key={w.id} className="flex items-center justify-between gap-3 border-b border-line py-2 text-sm">
                  <a href={`/weapons/${w.slug}/`} className="truncate text-fg hover:text-olive">{w.name}</a>
                  {w.maxLevel.value ? <LevelTag level={w.maxLevel.value} /> : <span className="font-mono text-xs text-faint">Not yet published</span>}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}
      <CamoDetail c={open ? camoById.get(open) ?? null : null} onClose={() => setOpen(null)} />
    </>
  );
}
