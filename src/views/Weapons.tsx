"use client";

import { Search, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CATALOG, categoryById } from "@/data";
import type { Weapon, WeaponCategoryId } from "@/data/schema";
import { WeaponArt } from "@/components/WeaponArt";
import { InspectButton } from "@/components/WeaponInspector";
import { Stagger, TiltCard } from "@/components/motion";
import { EmptyState, PageHeader, VBadge } from "@/components/ui";

type Sort = "class" | "name" | "unlock" | "max";

export default function Weapons() {
  const params = useSearchParams();
  const router = useRouter();
  const cls = (params.get("class") as WeaponCategoryId | null) ?? null;
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("class");
  const setClass = (c: WeaponCategoryId | null) => router.replace(c ? `/weapons/?class=${c}` : "/weapons/", { scroll: false });

  const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let list = CATALOG.weapons.filter((w) => (!cls || w.category === cls) && (!q || squash(w.name).includes(squash(q))));
  const catOrder = CATALOG.categories.map((c) => c.id);
  list = [...list].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "unlock") return (a.unlock.playerLevel ?? 999) - (b.unlock.playerLevel ?? 999);
    if (sort === "max") return (b.maxLevel.value ?? 0) - (a.maxLevel.value ?? 0);
    return catOrder.indexOf(a.category) - catOrder.indexOf(b.category) || a.season - b.season || (a.unlock.playerLevel ?? 99) - (b.unlock.playerLevel ?? 99);
  });
  const grouped = sort === "class" && !cls;

  return (
    <>
      <PageHeader code="03 · Weapons" title="Weapons" sub={`${CATALOG.weapons.filter((w) => w.season === 0).length} launch weapons and ${CATALOG.weapons.filter((w) => w.season === 1).length} Season 1 additions. Open any weapon for how to unlock it, its camos and its attachments.`} />
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by name" className="field pl-9" aria-label="Filter weapons by name" />
        </div>
        <div className="scrollbar-none -mx-4 flex gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:flex-1 lg:flex-wrap lg:px-0">
          <button type="button" className="chip" aria-pressed={!cls} onClick={() => setClass(null)}>All</button>
          {CATALOG.categories.map((c) => (
            <button key={c.id} type="button" className="chip" aria-pressed={cls === c.id} onClick={() => setClass(c.id)}>
              {c.name} <span className="text-faint">{CATALOG.weapons.filter((w) => w.category === c.id).length}</span>
            </button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="field lg:w-48" aria-label="Sort weapons">
          <option value="class">Sort: Class</option>
          <option value="unlock">Sort: Unlock level</option>
          <option value="max">Sort: Max level</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>

      {list.length === 0 ? (
        <EmptyState title="No weapons match">Clear the filter to see every weapon.</EmptyState>
      ) : grouped ? (
        CATALOG.categories.map((cat) => {
          const ws = list.filter((w) => w.category === cat.id);
          if (!ws.length) return null;
          return (
            <section key={cat.id} className="mb-8">
              <div className="mb-3 flex items-baseline gap-3">
                <h2 className="h-display text-2xl text-fg">{cat.name}</h2>
                <span className="label">{ws.length} · {cat.slot}</span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <Grid list={ws} />
            </section>
          );
        })
      ) : (
        <Grid list={list} />
      )}
    </>
  );
}

function Grid({ list }: { list: Weapon[] }) {
  return (
    <Stagger key={list.map((w) => w.id).join()} className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {list.map((w) => {
        const disputed = w.unlock.verification.status === "unconfirmed" && w.season === 0;
        return (
          <Stagger.Item key={w.id}>
            <TiltCard>
              <Link href={`/weapons/${w.slug}/`} className="panel group block overflow-hidden transition-colors hover:border-olive/60">
                <div className="relative">
                  <WeaponArt weapon={w} />
                  <div className="absolute bottom-2 right-2"><InspectButton weapon={w} /></div>
                </div>
                <div className="border-t border-line p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="h-display truncate text-xl text-fg group-hover:text-olive">{w.name}</div>
                      <div className="font-mono text-[10.5px] uppercase tracking-wider text-dim">{categoryById.get(w.category)?.name}{w.season ? ` · Season ${w.season}` : ""}</div>
                    </div>
                    <VBadge v={w.verification} compact />
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3 text-xs">
                    <div>
                      <dt className="label text-[9.5px]">Unlock</dt>
                      <dd className={`mt-0.5 flex items-center gap-1 ${disputed ? "text-warn" : "text-fg"}`}>{disputed && <TriangleAlert size={11} />}<span className="truncate">{w.season ? "Season 1" : w.unlock.text}</span></dd>
                    </div>
                    <div>
                      <dt className="label text-[9.5px]">Max level</dt>
                      <dd className="mt-0.5 font-mono text-fg">{w.maxLevel.value ?? "—"}</dd>
                    </div>
                  </dl>
                </div>
              </Link>
            </TiltCard>
          </Stagger.Item>
        );
      })}
    </Stagger>
  );
}
