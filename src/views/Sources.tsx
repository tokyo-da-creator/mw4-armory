"use client";

import { ExternalLink } from "lucide-react";
import { CATALOG, DATA_VERSION } from "@/data";
import { VERIFICATION_LABEL, type VerificationStatus } from "@/data/schema";
import { LOADOUT, OPERATORS } from "@/data/loadout";
import { PageHeader, Panel, VBadge } from "@/components/ui";

const MEANING: Record<VerificationStatus, string> = {
  official: "Published by Activision on callofduty.com.",
  "in-game": "Seen directly in the MW4 menus.",
  community: "From established guide sites. Treated as likely but not confirmed.",
  unconfirmed: "Sources disagree, or nothing reliable is published yet.",
  retired: "Changed or removed by a game update.",
};

export default function Sources() {
  return (
    <>
      <PageHeader code="11 · Sources & About" title="Sources & About" sub="Where every number comes from, and what MW4 Armory is." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="What the badges mean" code="KEY" bracket>
          <ul className="space-y-3">
            {(Object.keys(MEANING) as VerificationStatus[]).map((s) => (
              <li key={s} className="flex items-start gap-3">
                <VBadge v={{ status: s, sourceIds: [], lastVerified: null }} />
                <span className="text-sm text-dim">{MEANING[s]}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-dim">Tap any badge on the site to see its exact sources. Where sources disagree, both values are shown. Nothing is invented and nothing is copied from another Call of Duty game.</p>
        </Panel>
        <Panel title="What's in the guide" code="DB">
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            {[
              ["Weapons", CATALOG.weapons.length],
              ["Camo slots", CATALOG.camos.length],
              ["Camos with published names", CATALOG.camos.filter((c) => c.name).length],
              ["Attachments with unlock details", CATALOG.attachments.length],
              ["Equipment, perks & killstreaks", LOADOUT.length],
              ["Operators", OPERATORS.length],
              ["Data version", DATA_VERSION],
            ].map(([k, v]) => (
              <div key={String(k)} className="contents"><dt className="text-dim">{k}</dt><dd className="text-right font-mono text-fg">{v}</dd></div>
            ))}
          </dl>
        </Panel>
        <Panel title="Sources" code="SRC" className="lg:col-span-2">
          <ul className="divide-y divide-line">
            {CATALOG.sources.map((s) => (
              <li key={s.id} className="flex items-center gap-3 py-2.5 text-sm">
                <span className={`w-28 shrink-0 font-mono text-[10px] uppercase tracking-wider ${s.kind === "official" ? "text-done" : s.kind === "in-game" ? "text-olive" : "text-dim"}`}>{VERIFICATION_LABEL[s.kind === "official" ? "official" : s.kind === "in-game" ? "in-game" : "community"]}</span>
                {s.url ? (
                  <a className="flex min-w-0 flex-1 items-center gap-1.5 text-fg/90 hover:text-olive" href={s.url} target="_blank" rel="noreferrer noopener"><span className="truncate">{s.name}</span><ExternalLink size={12} className="shrink-0 text-faint" /></a>
                ) : (
                  <span className="flex-1 text-fg/90">{s.name}</span>
                )}
                <span className="hidden font-mono text-[10.5px] text-faint sm:inline">{s.accessed}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="About" code="INFO" className="lg:col-span-2">
          <p className="text-sm leading-relaxed text-dim">
            MW4 Armory is a free, unofficial guide to every unlock in Call of Duty: Modern Warfare 4 and how to get it. It isn&apos;t affiliated with, endorsed by or sponsored by Activision, Infinity Ward or Call of Duty. Call of Duty® and Modern Warfare® are trademarks of Activision Publishing, Inc. No game artwork is used. The 3D weapon models are original schematics, not in-game models.
          </p>
        </Panel>
      </div>
    </>
  );
}
