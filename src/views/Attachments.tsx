"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ATTACHMENT_TYPE_LABEL, CATALOG, weaponById } from "@/data";
import type { AttachmentType } from "@/data/schema";
import { EmptyState, LevelTag, PageHeader, Panel, VBadge } from "@/components/ui";

export default function Attachments() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [type, setType] = useState<AttachmentType | "">("");
  const [weapon, setWeapon] = useState("");
  const types = Object.keys(CATALOG.attachmentTypeTotals) as AttachmentType[];
  const listedTotal = Object.values(CATALOG.attachmentTypeTotals).reduce((a, b) => a + b, 0);

  const rows = CATALOG.attachments
    .filter((a) => (!type || a.type === type) && (!weapon || a.unlockWeaponId === weapon) && (!q || a.name.toLowerCase().includes(q.toLowerCase())))
    .sort((x, y) => x.type.localeCompare(y.type) || (x.unlockLevel ?? 0) - (y.unlockLevel ?? 0) || x.name.localeCompare(y.name));
  const byType = types.map((t) => ({ t, rows: rows.filter((r) => r.type === t) })).filter((g) => g.rows.length);
  const missing = type && !CATALOG.attachments.some((a) => a.type === type);

  return (
    <>
      <PageHeader
        code="05 · Attachments"
        title="Attachments"
        sub={`Which weapon, at which level, unlocks each attachment. Once unlocked, an attachment is shared with every weapon that can use it. ${CATALOG.attachments.length} of about ${listedTotal} attachments are published with unlock details so far.`}
      />

      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-3">
        <input className="field col-span-2 md:col-span-1" placeholder="Search attachments" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search attachments" />
        <select className="field" value={type} onChange={(e) => setType(e.target.value as AttachmentType | "")} aria-label="Attachment type">
          <option value="">All types</option>
          {types.map((t) => <option key={t} value={t}>{ATTACHMENT_TYPE_LABEL[t]} ({CATALOG.attachments.filter((a) => a.type === t).length}/{CATALOG.attachmentTypeTotals[t]})</option>)}
        </select>
        <select className="field" value={weapon} onChange={(e) => setWeapon(e.target.value)} aria-label="Unlocked by weapon">
          <option value="">Any weapon</option>
          {CATALOG.weapons.filter((w) => CATALOG.attachments.some((a) => a.unlockWeaponId === w.id)).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </div>

      {byType.length === 0 ? (
        <EmptyState title={missing ? `No ${ATTACHMENT_TYPE_LABEL[type as AttachmentType]} unlock details yet` : "No attachments match"}>
          {missing ? "This category exists in MW4, but names and unlock levels haven't been published by a reliable source yet." : null}
        </EmptyState>
      ) : (
        <div className="space-y-4">
          {byType.map(({ t, rows }) => (
            <Panel key={t} title={ATTACHMENT_TYPE_LABEL[t]} code={`${rows.length} of ${CATALOG.attachmentTypeTotals[t]}`}>
              {t === "apex" && <p className="mb-3 text-xs text-dim">Apex attachments unlock when a weapon hits max level and stay unlocked through Weapon Prestige.</p>}
              <ul>
                {rows.map((a) => {
                  const w = a.unlockWeaponId ? weaponById.get(a.unlockWeaponId) : null;
                  return (
                    <li key={a.id} className="flex items-center gap-3 border-b border-line py-2.5 last:border-0">
                      <LevelTag level={a.unlockLevel ?? "?"} />
                      <div className="min-w-0 flex-1">
                        <div className={`truncate text-sm ${t === "apex" ? "text-gold" : "text-fg"}`}>{a.name}</div>
                        <div className="truncate text-xs text-dim">
                          {w ? <>Level {a.unlockLevel} on the <Link className="text-fg/80 hover:text-olive" href={`/weapons/${w.slug}/`}>{w.name}</Link>{t === "apex" ? " (max level)" : ""}</> : "Unlock not yet published"}
                        </div>
                      </div>
                      <VBadge v={a.verification} compact />
                    </li>
                  );
                })}
              </ul>
            </Panel>
          ))}
        </div>
      )}
      <p className="mt-6 text-xs text-dim">Reticle challenges haven&apos;t been published for MW4 yet, so they aren&apos;t listed.</p>
    </>
  );
}
