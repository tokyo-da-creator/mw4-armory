"use client";

import { motion } from "motion/react";
import { ArrowRight, CircleHelp, Crosshair, ListChecks, PlayCircle } from "lucide-react";
import Link from "next/link";
import { camoDisplayName, weaponById } from "@/data";
import type { Camo, CamoGroup } from "@/data/schema";
import { prerequisiteSteps } from "@/lib/howto";
import { camoVideoUrl } from "@/lib/watch";
import { ModeTag, VBadge } from "./ui";
import { Sheet } from "./Sheet";

export const GROUP_LABEL: Record<CamoGroup, string> = {
  military: "Military",
  special: "Special",
  completionist: "Completionist",
  prestige: "Prestige",
  mastery: "Mastery",
};
const GROUP_CODE: Record<CamoGroup, string> = { military: "MIL", special: "SPC", completionist: "CMP", prestige: "PRS", mastery: "MST" };
const GROUP_TINT: Record<CamoGroup, string> = {
  military: "bg-bg-2",
  special: "bg-[radial-gradient(circle_at_70%_20%,rgb(165_174_115/0.12),transparent_65%)]",
  completionist: "bg-[radial-gradient(circle_at_30%_25%,rgb(196_164_91/0.14),transparent_65%)]",
  prestige: "bg-[radial-gradient(circle_at_30%_20%,rgb(196_164_91/0.2),transparent_65%)]",
  mastery: "bg-[radial-gradient(circle_at_50%_30%,rgb(196_164_91/0.24),transparent_70%)]",
};

/**
 * Camo slot plate. No licensed camo artwork exists for fan use, so the tile is
 * a labelled slot — name, group and the requirement — rather than a guessed pattern.
 */
export function CamoTile({ c, onOpen, showWeapon }: { c: Camo; onOpen: () => void; showWeapon?: boolean }) {
  const weapon = c.weaponId ? weaponById.get(c.weaponId) : null;
  const known = c.requirements.length > 0;
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative flex w-full flex-col overflow-hidden rounded-[3px] border border-line bg-card text-left transition-colors hover:border-olive"
      aria-label={`${camoDisplayName(c)}${weapon ? ` for ${weapon.name}` : ""} — how to unlock`}
    >
      <div className={`relative aspect-square w-full ${GROUP_TINT[c.group]} ${known ? "" : "hatch"}`}>
        <div className="absolute left-2 top-2 font-mono text-[9px] tracking-[0.16em] text-faint">
          {GROUP_CODE[c.group]}-{String(c.order).padStart(2, "0")}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          {known ? <Crosshair size={22} className="text-olive/80 transition-transform duration-300 group-hover:rotate-45" /> : <CircleHelp size={20} className="text-warn/60" />}
        </div>
        {c.requiredLevel !== null && <div className="absolute bottom-2 right-2 font-mono text-[10px] text-dim">LV {c.requiredLevel}</div>}
      </div>
      <div className="min-h-[52px] border-t border-line px-2.5 py-2">
        <div className={`truncate text-[13px] font-medium ${c.name ? "text-fg" : "italic text-dim"}`}>{c.name ?? c.slotLabel}</div>
        <div className="truncate font-mono text-[10px] uppercase tracking-wider text-faint">{showWeapon && weapon ? weapon.name : c.name ? c.slotLabel : "Not yet published"}</div>
      </div>
    </motion.button>
  );
}

/** How-to-unlock sheet for one camo. */
export function CamoDetail({ c, onClose }: { c: Camo | null; onClose: () => void }) {
  if (!c) return <Sheet open={false} onClose={onClose} title="">{null}</Sheet>;
  const weapon = c.weaponId ? weaponById.get(c.weaponId) : null;
  const steps = prerequisiteSteps(c);
  return (
    <Sheet open onClose={onClose} title={camoDisplayName(c)} code={`${GROUP_LABEL[c.group]} · ${c.slotLabel}${weapon ? ` · ${weapon.name}` : " · Account-wide"}`}>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <VBadge v={c.verification} />
      </div>

      <div className="label mb-2">How to unlock</div>
      <ol className="mb-5 space-y-2">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-3 rounded-[3px] border border-line bg-card px-3 py-2.5 text-sm text-fg">
            <span className="font-mono text-xs text-olive">{String(i + 1).padStart(2, "0")}</span>
            {s}
          </li>
        ))}
        {c.requirements.length > 0 ? (
          <li className="rounded-[3px] border border-olive/40 bg-olive/[0.04] p-3">
            <div className="mb-2 flex items-center gap-2 font-mono text-xs text-olive">
              {String(steps.length + 1).padStart(2, "0")} <span className="text-dim">Complete the challenge — any one mode</span>
            </div>
            <ul className="space-y-2">
              {c.requirements.map((r) => (
                <li key={r.mode} className="flex items-start gap-2 text-sm text-fg">
                  <ModeTag mode={r.mode} /> {r.text}
                </li>
              ))}
            </ul>
          </li>
        ) : (
          <li className="rounded-[3px] border border-dashed border-warn/40 p-3 text-sm text-dim">
            The challenge for this slot hasn&apos;t been published by a reliable source yet. In game, open Create a Class › Camo Select on this weapon to see it.
          </li>
        )}
      </ol>
      {c.requirements.some((r) => r.mode === "mp") && c.requirements.some((r) => r.mode === "dmz") && (
        <p className="mb-5 text-xs text-dim">Multiplayer and DMZ counts are separate — finishing either one unlocks the camo.</p>
      )}
      {c.verification.note && <p className="mb-5 text-xs leading-relaxed text-dim">{c.verification.note}</p>}

      <a href={camoVideoUrl(c)} target="_blank" rel="noreferrer noopener" className="mb-2 flex items-center gap-3 rounded-[3px] border border-gold/40 bg-gold/[0.06] px-3 py-3 transition-colors hover:border-gold">
        <PlayCircle size={20} className="shrink-0 text-gold" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-fg">See it in game</span>
          <span className="block text-xs text-dim">Video showcases of {c.name ?? "this camo"}{weapon ? ` on the ${weapon.name}` : ""} on YouTube</span>
        </span>
      </a>
      <p className="mb-5 text-[11px] text-faint">Opens YouTube search results from other creators. MW4 Armory doesn&apos;t host game artwork.</p>

      {weapon && (
        <Link href={`/weapons/${weapon.slug}/`} className="btn" onClick={onClose}>
          Open {weapon.name} <ArrowRight size={13} />
        </Link>
      )}
    </Sheet>
  );
}

/** Compact list row: name, where, requirement. */
export function CamoRow({ c, onOpen }: { c: Camo; onOpen: () => void }) {
  const weapon = c.weaponId ? weaponById.get(c.weaponId) : null;
  const req = c.requirements[0];
  return (
    <button type="button" onClick={onOpen} className="flex w-full items-center gap-3 border-b border-line py-3 text-left last:border-0 hover:bg-card/60">
      <ListChecks size={15} className="shrink-0 text-olive/70" />
      <div className="min-w-0 flex-1">
        <div className={`truncate text-sm font-medium ${c.name ? "text-fg" : "italic text-dim"}`}>{camoDisplayName(c)}{weapon ? <span className="font-normal text-dim"> · {weapon.name}</span> : null}</div>
        <div className="truncate text-xs text-dim">{req ? req.text : "Challenge not yet published"}</div>
      </div>
      <div className="flex shrink-0 gap-1">{c.requirements.map((r) => <ModeTag key={r.mode} mode={r.mode} />)}</div>
    </button>
  );
}
