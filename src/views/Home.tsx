"use client";

import { ArrowRight, BookOpen, Crosshair, Layers, ListOrdered, Medal, Palette, Search, Target, Trophy, Users, Wrench } from "lucide-react";
import Link from "next/link";
import { CATALOG } from "@/data";
import { LOADOUT, OPERATORS } from "@/data/loadout";
import { Stagger, TiltCard } from "@/components/motion";
import { LevelTag, Stat } from "@/components/ui";
import { WeaponSchematic } from "@/components/WeaponArt";
import { byLevel, levelUnlocks, UNLOCK_KIND_LABEL } from "@/lib/unlocks";

export default function Home() {
  const named = CATALOG.camos.filter((c) => c.name).length;
  const path = byLevel(levelUnlocks());
  const preview = [...path.entries()].filter(([l]) => l >= 4).slice(0, 6);
  const s1 = CATALOG.weapons.filter((w) => w.season === 1);

  const tiles = [
    { href: "/unlocks/", icon: ListOrdered, title: "Level Unlocks", text: "Everything you get from player level 1 to 55", n: `${levelUnlocks().length} items` },
    { href: "/weapons/", icon: Crosshair, title: "Weapons", text: "Unlock level, max level, Apex attachment and full camo path for each gun", n: `${CATALOG.weapons.length} weapons` },
    { href: "/camos/", icon: Palette, title: "Camos", text: "Military, Special, Completionist, Prestige and Mastery — the challenge for each", n: `${CATALOG.camos.length} slots` },
    { href: "/attachments/", icon: Wrench, title: "Attachments", text: "Which weapon and level unlocks each attachment, including all 28 Apex attachments", n: `${CATALOG.attachments.length} listed` },
    { href: "/equipment/", icon: Layers, title: "Equipment & Perks", text: "Tacticals, lethals, field upgrades, perks and killstreaks", n: `${LOADOUT.length} items` },
    { href: "/operators/", icon: Users, title: "Operators", text: "How to unlock every operator — campaign, DMZ, challenges and editions", n: `${OPERATORS.length} operators` },
    { href: "/prestige/", icon: Medal, title: "Prestige", text: "Player prestige rewards and the weapon prestige Pyroclast path", n: "P1–P10 + Master" },
    { href: "/mastery/", icon: Trophy, title: "Mastery", text: "Divergence and the Multiplayer, DMZ and Warzone mastery camos", n: "9 camos" },
    { href: "/challenges/", icon: Target, title: "All Challenges", text: "Every published challenge in one searchable list", n: "Searchable" },
  ];

  return (
    <>
      <section className="bracket grid-bg relative mb-8 overflow-hidden rounded-[3px] border border-line bg-bg-2 px-5 py-8 md:px-10 md:py-12">
        <WeaponSchematic category="assault-rifle" className="pointer-events-none absolute -right-10 top-1/2 hidden h-[85%] w-[60%] -translate-y-1/2 opacity-[0.22] lg:block" />
        <div className="relative max-w-2xl">
          <div className="label mb-3 flex items-center gap-2"><span className="inline-block h-px w-6 bg-olive" /> Call of Duty: Modern Warfare 4 · Unofficial guide</div>
          <h1 className="h-display text-[2.6rem] leading-[0.92] text-fg [text-wrap:balance] md:text-[4.2rem]">
            Every unlock in MW4. <span className="text-olive">And how to get it.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-dim">
            Weapons, camos, attachments, equipment, perks, killstreaks, operators and prestige — each with its exact requirement and a source you can check.
          </p>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("armory:search"))}
            className="mt-6 flex h-12 w-full max-w-lg items-center gap-3 rounded-[3px] border border-line-2 bg-bg px-4 text-left text-dim transition-colors hover:border-olive"
          >
            <Search size={17} className="text-olive" />
            <span className="flex-1">Search any weapon, camo, perk or operator</span>
            <kbd className="hidden font-mono text-[10px] text-faint sm:inline">⌘K</kbd>
          </button>
          <div className="mt-8 grid grid-cols-3 gap-x-6 gap-y-4 sm:grid-cols-6">
            <Stat label="Weapons" value={CATALOG.weapons.length} />
            <Stat label="Camo slots" value={CATALOG.camos.length} />
            <Stat label="Named camos" value={named} />
            <Stat label="Gear & perks" value={LOADOUT.length} />
            <Stat label="Operators" value={OPERATORS.length} />
            <Stat label="Max level" value={55} tone="gold" />
          </div>
        </div>
      </section>

      <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map((t) => (
          <Stagger.Item key={t.href}>
            <TiltCard max={6}>
              <Link href={t.href} className="panel group flex h-full flex-col gap-3 p-5 transition-colors hover:border-olive/60">
                <div className="flex items-center justify-between">
                  <t.icon size={20} className="text-olive" />
                  <span className="font-mono text-[10.5px] uppercase tracking-wider text-faint">{t.n}</span>
                </div>
                <div>
                  <div className="h-display text-2xl text-fg group-hover:text-olive">{t.title}</div>
                  <p className="mt-1 text-sm leading-relaxed text-dim">{t.text}</p>
                </div>
              </Link>
            </TiltCard>
          </Stagger.Item>
        ))}
      </Stagger>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="panel min-w-0">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 className="h-display text-lg text-fg">The level path</h2>
            <Link href="/unlocks/" className="label flex items-center gap-1 hover:text-fg">All 55 levels <ArrowRight size={12} /></Link>
          </div>
          <ol className="divide-y divide-line">
            {preview.map(([level, items]) => (
              <li key={level} className="flex min-w-0 gap-4 px-4 py-3">
                <LevelTag level={level} />
                <div className="flex min-w-0 flex-wrap gap-1.5">
                  {items.slice(0, 7).map((u) => (
                    <Link key={u.kind + u.name} href={u.href} className="inline-flex h-6 items-center gap-1.5 rounded-[2px] border border-line bg-bg-2 px-2 text-xs text-fg hover:border-olive">
                      <span className="font-mono text-[9.5px] uppercase text-faint">{UNLOCK_KIND_LABEL[u.kind]}</span> {u.name}
                    </Link>
                  ))}
                  {items.length > 7 && <span className="text-xs text-dim">+{items.length - 7} more</span>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="panel">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 className="h-display text-lg text-fg">New in Season 1</h2>
            <span className="label text-gold">Nov 6</span>
          </div>
          <ul className="divide-y divide-line">
            {s1.map((w) => (
              <li key={w.id}>
                <Link href={`/weapons/${w.slug}/`} className="flex items-center gap-3 px-4 py-3 hover:bg-card/60">
                  <WeaponSchematic category={w.category} className="h-9 w-20 shrink-0" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-fg">{w.name}</div>
                    <div className="truncate text-xs text-dim">{w.unlock.text}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-line px-4 py-3 text-xs text-dim">
            <BookOpen size={12} className="mr-1 inline text-olive" /> Every entry shows a source badge. <Link href="/sources/" className="text-olive hover:underline">How data is verified</Link>
          </div>
        </section>
      </div>
    </>
  );
}
