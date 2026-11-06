"use client";

import { User } from "lucide-react";
import { OPERATORS, OPERATOR_SOURCE_LABEL, type Operator } from "@/data/loadout";
import { Stagger } from "@/components/motion";
import { PageHeader, VBadge } from "@/components/ui";

const ORDER: Operator["source"][] = ["base", "multiplayer", "dmz", "campaign", "pre-order", "vault", "bundle", "classified"];

export default function Operators() {
  return (
    <>
      <PageHeader code="07 · Operators" title="Operators" sub={`How to unlock all ${OPERATORS.length} launch operators — from Multiplayer challenges and DMZ levels to campaign missions and editions.`} />
      {ORDER.map((src) => {
        const list = OPERATORS.filter((o) => o.source === src);
        if (!list.length) return null;
        return (
          <section key={src} className="mb-8">
            <div className="mb-3 flex items-baseline gap-3">
              <h2 className="h-display text-2xl text-fg">{OPERATOR_SOURCE_LABEL[src]}</h2>
              <span className="label">{list.length}</span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <Stagger step={0.03} className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((o) => (
                <Stagger.Item key={o.id}>
                  <div id={o.id.replace(":", "-")} className="panel flex h-full scroll-mt-24 items-start gap-3 p-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] border border-line-2 bg-bg-2 text-olive"><User size={16} /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="h-display text-lg text-fg">{o.name}</div>
                        <VBadge v={o.verification} compact />
                      </div>
                      <p className="text-sm leading-snug text-dim">{o.how}</p>
                    </div>
                  </div>
                </Stagger.Item>
              ))}
            </Stagger>
          </section>
        );
      })}
    </>
  );
}
