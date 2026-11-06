"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ExternalLink, PlayCircle, Trophy, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ATTACHMENT_TYPE_LABEL, CATALOG, DIVERGENCE_ID, camoById, camoDisplayName, camosForWeapon, categoryById, sourceById, weaponById } from "@/data";
import type { Camo, CamoGroup, Weapon } from "@/data/schema";
import { CamoDetail, CamoTile, GROUP_LABEL } from "@/components/Camo";
import { WeaponArt } from "@/components/WeaponArt";
import { Stagger } from "@/components/motion";
import { weaponVideoUrl } from "@/lib/watch";
import { CardButton, EmptyState, LevelTag, Panel, VBadge } from "@/components/ui";

type Tab = "camos" | "attachments" | "prestige" | "sources";

export default function WeaponDetail({ slug }: { slug: string }) {
  const weapon = weaponById.get(slug);
  const params = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("camos");
  const openId = params.get("camo");
  const setOpen = (id: string | null) => router.replace(id ? `/weapons/${slug}/?camo=${encodeURIComponent(id)}` : `/weapons/${slug}/`, { scroll: false });

  if (!weapon) return <EmptyState title="Weapon not found" />;
  const cat = categoryById.get(weapon.category)!;
  const camos = camosForWeapon(weapon.id);
  const divergence = camoById.get(DIVERGENCE_ID)!;
  const groups: { g: CamoGroup; list: Camo[] }[] = [
    { g: "military", list: camos.filter((c) => c.group === "military") },
    { g: "special", list: camos.filter((c) => c.group === "special") },
    { g: "completionist", list: [...camos.filter((c) => c.group === "completionist"), divergence] },
    { g: "prestige", list: camos.filter((c) => c.group === "prestige") },
  ];
  const atts = CATALOG.attachments.filter((a) => a.unlockWeaponId === weapon.id).sort((a, b) => (a.unlockLevel ?? 0) - (b.unlockLevel ?? 0));
  const apex = atts.find((a) => a.type === "apex");
  const disputed = weapon.unlock.verification.status === "unconfirmed" && weapon.season === 0;
  const official = sourceById.get(weapon.season ? "cod-s1-blog" : "cod-launch-blog");

  return (
    <>
      <Link href={`/weapons/?class=${weapon.category}`} className="label mb-4 inline-flex items-center gap-1.5 hover:text-fg">
        <ArrowLeft size={12} /> {cat.name}
      </Link>

      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="label mb-1">{cat.name} · {weapon.season ? `Season ${weapon.season}` : "Launch"}</div>
          <h1 className="h-display text-[2.75rem] text-fg md:text-[4rem]">{weapon.name}</h1>
        </div>
        <VBadge v={weapon.verification} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="panel bracket flex flex-col overflow-hidden">
          <WeaponArt weapon={weapon} size="hero" />
          <div className="grid grid-cols-1 border-t border-line sm:grid-cols-2">
            <a href={weaponVideoUrl(weapon)} target="_blank" rel="noreferrer noopener" className="flex items-center gap-3 px-4 py-3 text-sm text-fg transition-colors hover:bg-gold/[0.06]">
              <PlayCircle size={18} className="shrink-0 text-gold" />
              <span className="min-w-0 flex-1"><span className="block font-medium">See it in game</span><span className="block text-xs text-dim">Gunsmith & camo videos on YouTube</span></span>
            </a>
            {official?.url && (
              <a href={official.url} target="_blank" rel="noreferrer noopener" className="flex items-center gap-3 border-t border-line px-4 py-3 text-sm text-fg transition-colors hover:bg-olive/[0.06] sm:border-l sm:border-t-0">
                <ExternalLink size={16} className="shrink-0 text-olive" />
                <span className="min-w-0 flex-1"><span className="block font-medium">Official images</span><span className="block text-xs text-dim">Activision&apos;s {weapon.season ? "Season 1" : "launch"} post</span></span>
              </a>
            )}
          </div>
        </div>

        <div className="panel flex flex-col gap-4 p-5">
          <div className="label">How to unlock</div>
          <div className={`rounded-[3px] border p-3 ${disputed ? "border-warn/40 bg-warn/[0.04]" : "border-olive/40 bg-olive/[0.04]"}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="text-[15px] font-medium text-fg">{weapon.unlock.text ?? "Not yet published"}</div>
              <VBadge v={weapon.unlock.verification} compact />
            </div>
            {disputed && <p className="mt-1.5 flex gap-1.5 text-xs text-warn/90"><TriangleAlert size={12} className="mt-0.5 shrink-0" />{weapon.unlock.verification.note}</p>}
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <dt className="text-dim">Max weapon level</dt>
            <dd className="flex items-center justify-end gap-1.5 font-mono text-fg">{weapon.maxLevel.value ?? "—"} <VBadge v={weapon.maxLevel.verification} compact /></dd>
            <dt className="text-dim">Apex attachment</dt>
            <dd className="text-right text-fg">{apex ? apex.name : weapon.category === "launcher" || weapon.category === "melee" ? "None" : "—"}</dd>
            <dt className="text-dim">Class</dt>
            <dd className="text-right text-fg">{cat.name}</dd>
            <dt className="text-dim">Slot</dt>
            <dd className="text-right capitalize text-fg">{cat.slot}</dd>
            <dt className="text-dim">Camo slots</dt>
            <dd className="text-right font-mono text-fg">{camos.length + 1}</dd>
          </dl>
          {apex && <p className="border-t border-line pt-3 text-xs leading-relaxed text-dim">Reach max level ({weapon.maxLevel.value}) to unlock the {apex.name}. It stays unlocked through Weapon Prestige.</p>}
        </div>
      </div>

      <div role="tablist" aria-label="Weapon sections" className="scrollbar-none mt-6 flex gap-1 overflow-x-auto border-b border-line">
        {(["camos", "attachments", "prestige", "sources"] as Tab[]).map((t) => (
          <button key={t} role="tab" type="button" aria-selected={tab === t} onClick={() => setTab(t)} className={`relative h-11 shrink-0 px-4 font-mono text-[12px] uppercase tracking-[0.12em] ${tab === t ? "text-fg" : "text-dim hover:text-fg"}`}>
            {t === "camos" ? "Camos" : t === "sources" ? "Sources" : t === "attachments" ? `Attachments (${atts.length})` : "Prestige"}
            {tab === t && <motion.span layoutId="weapon-tab" className="absolute inset-x-3 -bottom-px h-[2px] bg-olive" transition={{ type: "spring", stiffness: 460, damping: 36 }} />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} className="mt-5" role="tabpanel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
          {tab === "camos" && (
            <div className="space-y-7">
              <p className="text-sm text-dim">Tap any camo for exactly how to unlock it, plus a link to see it on the {weapon.name} in game.</p>
              {groups.map(({ g, list }) => (
                <section key={g}>
                  <div className="mb-3 flex items-baseline gap-3">
                    <h2 className={`font-mono text-[13px] uppercase tracking-[0.14em] ${g === "prestige" ? "text-gold" : "text-olive"}`}>{GROUP_LABEL[g]} · {list.length}</h2>
                    <span className="h-px flex-1 bg-line" />
                  </div>
                  <Stagger className={`grid gap-2.5 ${g === "military" ? "grid-cols-4 sm:grid-cols-8" : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"}`}>
                    {list.map((c) => <Stagger.Item key={c.id}><CamoTile c={c} onOpen={() => setOpen(c.id)} /></Stagger.Item>)}
                  </Stagger>
                  {g === "completionist" && <p className="mt-2 text-xs text-dim">Divergence is account-wide — earned once after 33 Harmonic Break camos.</p>}
                </section>
              ))}
              <Link href="/mastery/" className="panel flex items-center justify-between p-4 hover:border-olive/60">
                <span className="flex items-center gap-3"><Trophy size={18} className="text-gold" /><span><span className="block text-sm text-fg">Mode Mastery</span><span className="block text-xs text-dim">Account-wide Multiplayer, DMZ and Warzone mastery camos</span></span></span>
                <span className="label">Open</span>
              </Link>
            </div>
          )}

          {tab === "attachments" && (
            <Panel title={`Attachments unlocked by the ${weapon.name}`} code="GSM">
              {atts.length === 0 ? (
                <EmptyState title="Not yet published">This weapon&apos;s attachment unlock list hasn&apos;t been published by a reliable source yet.</EmptyState>
              ) : (
                <ul>
                  {atts.map((a) => (
                    <li key={a.id} className="flex items-center gap-3 border-b border-line py-2.5 last:border-0">
                      <LevelTag level={a.unlockLevel ?? "?"} />
                      <span className={`flex-1 text-sm ${a.type === "apex" ? "text-gold" : "text-fg"}`}>{a.name}</span>
                      <span className="hidden font-mono text-[10.5px] uppercase tracking-wider text-faint sm:inline">{ATTACHMENT_TYPE_LABEL[a.type]}</span>
                      <VBadge v={a.verification} compact />
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-xs text-dim">Level means this weapon&apos;s level. Only part of each weapon&apos;s attachment list is published so far; more will be added as it&apos;s verified.</p>
            </Panel>
          )}

          {tab === "prestige" && <PrestigeTab weapon={weapon} camos={camos} onOpen={setOpen} />}

          {tab === "sources" && (
            <div className="grid gap-4 lg:grid-cols-2">
              <Panel title="Data verification" code="SRC">
                <dl className="space-y-3 text-sm">
                  {([["Weapon", weapon.verification], ["Unlock requirement", weapon.unlock.verification], ["Max level", weapon.maxLevel.verification]] as const).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-3"><dt className="text-dim">{k}</dt><dd><VBadge v={v} /></dd></div>
                  ))}
                </dl>
                <p className="mt-4 text-xs text-dim">Stats and descriptions haven&apos;t been published by a reliable source, so none are shown. MW4 Armory never borrows data from other Call of Duty games.</p>
              </Panel>
              <Panel title="Seen in game" code="OBS">
                {weapon.inGameObservations.length ? (
                  <ul className="space-y-2">{weapon.inGameObservations.map((o) => <li key={o} className="font-mono text-xs leading-relaxed text-fg/90">› {o}</li>)}</ul>
                ) : (
                  <p className="text-sm text-dim">No in-game screenshots checked for this weapon yet.</p>
                )}
              </Panel>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <CamoDetail c={openId ? camoById.get(openId) ?? null : null} onClose={() => setOpen(null)} />
    </>
  );
}

function PrestigeTab({ weapon, camos, onOpen }: { weapon: Weapon; camos: Camo[]; onOpen: (id: string) => void }) {
  const pyro = camos.filter((c) => c.group === "prestige");
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Pyroclast path" code="PRS">
        <ol className="space-y-3">
          {pyro.map((c, i) => (
            <li key={c.id}>
              <CardButton onClick={() => onOpen(c.id)} label={`${camoDisplayName(c)} — how to unlock`} className="flex w-full items-center gap-3 text-left">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/60 font-mono text-xs text-gold">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-fg">{camoDisplayName(c)}</span>
                  <span className="block text-xs text-dim">{c.requirements[0]?.text}</span>
                </span>
                <VBadge v={c.verification} compact />
              </CardButton>
            </li>
          ))}
        </ol>
      </Panel>
      <Panel title="How weapon prestige works" code="SYS">
        <ul className="space-y-2 text-sm leading-relaxed text-dim">
          <li>• At max level ({weapon.maxLevel.value ?? "?"}) you can enter <span className="text-fg">Prestige 1</span>. The weapon goes back to level 1 and its standard attachments lock again. Apex and blueprint attachments stay.</li>
          <li>• Reaching max level again moves it into <span className="text-fg">Prestige Master</span>, which resets nothing and keeps counting levels.</li>
          <li>• Camos you&apos;ve earned are never lost.</li>
          <li className="text-xs text-faint">Community reported — tap each stage&apos;s badge for sources.</li>
        </ul>
      </Panel>
    </div>
  );
}
