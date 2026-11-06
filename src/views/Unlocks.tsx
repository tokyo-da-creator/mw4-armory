"use client";

import { motion } from "motion/react";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { LevelTag, PageHeader } from "@/components/ui";
import { byLevel, levelUnlocks, UNLOCK_KIND_LABEL, type UnlockKind } from "@/lib/unlocks";

const KINDS: UnlockKind[] = ["weapon", "perk", "killstreak", "field-upgrade", "lethal", "tactical", "feature"];

export default function Unlocks() {
  const all = useMemo(() => levelUnlocks(), []);
  const [kinds, setKinds] = useState<Set<UnlockKind>>(new Set());
  const list = kinds.size ? all.filter((u) => kinds.has(u.kind)) : all;
  const levels = [...byLevel(list).entries()];
  const toggle = (k: UnlockKind) =>
    setKinds((s) => {
      const n = new Set(s);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });

  return (
    <>
      <PageHeader
        code="02 · Level Unlocks"
        title="Player level 1–55"
        sub="Everything you unlock by leveling up in Multiplayer, from Create-a-Class at level 4 to the Cronen Squall and Air Lockdown at 55. Classic Prestige resets these; Regular Prestige keeps them."
      />
      <div className="scrollbar-none -mx-4 mb-5 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
        <button type="button" className="chip" aria-pressed={!kinds.size} onClick={() => setKinds(new Set())}>All <span className="text-faint">{all.length}</span></button>
        {KINDS.map((k) => (
          <button key={k} type="button" className="chip" aria-pressed={kinds.has(k)} onClick={() => toggle(k)}>
            {UNLOCK_KIND_LABEL[k]}s <span className="text-faint">{all.filter((u) => u.kind === k).length}</span>
          </button>
        ))}
      </div>

      <ol className="relative">
        <span className="absolute bottom-2 left-[22px] top-2 w-px bg-line" aria-hidden />
        {levels.map(([level, items], i) => (
          <motion.li
            key={level}
            className="relative flex gap-4 pb-4"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.3, delay: Math.min(i, 6) * 0.03 }}
          >
            <div className="relative z-[1] pt-0.5"><LevelTag level={level} /></div>
            <div className="grid min-w-0 flex-1 grid-cols-1 gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((u) => (
                <Link key={u.kind + u.name} href={u.href} className="panel group flex items-center justify-between gap-3 px-3 py-2.5 transition-colors hover:border-olive/60">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-fg group-hover:text-olive">{u.name}</div>
                    <div className="truncate font-mono text-[10px] uppercase tracking-wider text-faint">{UNLOCK_KIND_LABEL[u.kind]}{u.detail !== UNLOCK_KIND_LABEL[u.kind] ? ` · ${u.detail}` : ""}</div>
                  </div>
                  {u.altLevel && (
                    <span className="flex shrink-0 items-center gap-1 font-mono text-[10px] text-warn" title={`Activision's weapon card says level ${u.altLevel}`}>
                      <TriangleAlert size={11} /> or {u.altLevel}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </motion.li>
        ))}
      </ol>
      <p className="mt-4 flex items-start gap-2 text-xs text-dim">
        <TriangleAlert size={13} className="mt-0.5 shrink-0 text-warn" />
        Activision&apos;s launch post lists two different unlock levels for six weapons. They&apos;re shown at the progression-table level with the other value beside them. Check Career › Progression in game.
      </p>
    </>
  );
}
