"use client";

import { FIELD_UPGRADES, KILLSTREAKS, LETHALS, PERKS, TACTICALS, type LoadoutItem } from "@/data/loadout";
import { Stagger } from "@/components/motion";
import { LevelTag, PageHeader, VBadge } from "@/components/ui";

function Item({ g }: { g: LoadoutItem }) {
  const anchor = g.id.replace(":", "-");
  return (
    <Stagger.Item>
      <div id={anchor} className="panel flex h-full scroll-mt-24 items-start gap-3 p-3.5 target:border-olive">
        <LevelTag level={g.level} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm font-medium text-fg">{g.name}</div>
            <VBadge v={g.verification} compact />
          </div>
          {g.slot && <div className="font-mono text-[10px] uppercase tracking-wider text-faint">{g.slot}</div>}
          {g.summary && <p className="mt-1 text-xs leading-relaxed text-dim">{g.summary}</p>}
          <p className="mt-1 text-xs text-olive/90">Unlock: reach player level {g.level}</p>
        </div>
      </div>
    </Stagger.Item>
  );
}

function Section({ id, title, items, note, cols = "sm:grid-cols-2 xl:grid-cols-3" }: { id: string; title: string; items: LoadoutItem[]; note?: string; cols?: string }) {
  const sorted = [...items].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  return (
    <section id={id} className="mb-10 scroll-mt-20">
      <div className="mb-3 flex items-baseline gap-3">
        <h2 className="h-display text-2xl text-fg">{title}</h2>
        <span className="label">{items.length}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      {note && <p className="mb-3 text-xs text-dim">{note}</p>}
      <Stagger step={0.02} className={`grid grid-cols-1 gap-2 ${cols}`}>
        {sorted.map((g) => <Item key={g.id} g={g} />)}
      </Stagger>
    </section>
  );
}

export default function Equipment() {
  const jump = [
    ["perks", "Perks"],
    ["killstreaks", "Killstreaks"],
    ["field-upgrades", "Field Upgrades"],
    ["lethals", "Lethals"],
    ["tacticals", "Tacticals"],
  ];
  return (
    <>
      <PageHeader code="06 · Equipment & Perks" title="Equipment & Perks" sub="Every perk, killstreak, field upgrade, lethal and tactical, with the player level that unlocks it." />
      <nav className="scrollbar-none -mx-4 mb-6 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:px-0" aria-label="Jump to section">
        {jump.map(([id, label]) => <a key={id} href={`#${id}`} className="chip">{label}</a>)}
      </nav>

      <section id="perks" className="mb-10 scroll-mt-20">
        <div className="mb-3 flex items-baseline gap-3"><h2 className="h-display text-2xl text-fg">Perks</h2><span className="label">{PERKS.length} · pick 3</span><span className="h-px flex-1 bg-line" /></div>
        <div className="grid gap-4 lg:grid-cols-3">
          {["Perk 1", "Perk 2", "Perk 3"].map((slot) => (
            <div key={slot}>
              <div className="label mb-2 text-olive">{slot}</div>
              <Stagger step={0.03} className="grid gap-2">
                {PERKS.filter((p) => p.slot === slot).sort((a, b) => a.level - b.level).map((g) => <Item key={g.id} g={g} />)}
              </Stagger>
            </div>
          ))}
        </div>
      </section>

      <section id="killstreaks" className="mb-10 scroll-mt-20">
        <div className="mb-3 flex items-baseline gap-3"><h2 className="h-display text-2xl text-fg">Killstreaks</h2><span className="label">{KILLSTREAKS.length}</span><span className="h-px flex-1 bg-line" /></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {["4 kills", "6 kills", "8 kills", "10 kills", "12 kills"].map((cost) => (
            <div key={cost}>
              <div className="label mb-2 text-gold">{cost}</div>
              <Stagger step={0.03} className="grid gap-2">
                {KILLSTREAKS.filter((k) => k.slot === cost).sort((a, b) => a.level - b.level).map((g) => <Item key={g.id} g={g} />)}
              </Stagger>
            </div>
          ))}
        </div>
      </section>

      <Section id="field-upgrades" title="Field Upgrades" items={FIELD_UPGRADES} />
      <Section id="lethals" title="Lethals" items={LETHALS} />
      <Section id="tacticals" title="Tacticals" items={TACTICALS} />
    </>
  );
}
