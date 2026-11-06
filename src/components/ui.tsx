"use client";

import { Archive, Eye, Info, Lock, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { sourceById } from "@/data";
import { VERIFICATION_LABEL, type Verification } from "@/data/schema";
import { AnimatedNumber } from "./motion";

export function PageHeader({ code, title, sub, children }: { code: string; title: string; sub?: ReactNode; children?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-4 border-b border-line pb-5 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <div className="label mb-2 flex items-center gap-2">
          <span className="inline-block h-px w-6 bg-olive" />
          {code}
        </div>
        <h1 className="h-display text-[2.4rem] text-fg [text-wrap:balance] md:text-[3.25rem]">{title}</h1>
        {sub && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-dim">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </header>
  );
}

export function Panel({ title, code, action, children, className = "", bracket, id }: { title?: ReactNode; code?: string; action?: ReactNode; children: ReactNode; className?: string; bracket?: boolean; id?: string }) {
  return (
    <section id={id} className={`panel scroll-mt-20 ${bracket ? "bracket" : ""} ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="flex min-w-0 items-baseline gap-3">
            {code && <span className="label text-faint">{code}</span>}
            <h2 className="h-display truncate text-lg text-fg">{title}</h2>
          </div>
          {action}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Stat({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: "gold" | "done" }) {
  return (
    <div className="min-w-0">
      <div className="label truncate">{label}</div>
      <div className={`mt-1 font-mono text-2xl tabular-nums ${tone === "gold" ? "text-gold" : tone === "done" ? "text-done" : "text-fg"}`}>{typeof value === "number" ? <AnimatedNumber value={value} /> : value}</div>
      {sub && <div className="mt-0.5 truncate text-xs text-dim">{sub}</div>}
    </div>
  );
}

const V_ICON = { official: ShieldCheck, "in-game": Eye, community: Info, unconfirmed: ShieldQuestion, retired: Archive } as const;
const V_COLOR = { official: "text-done border-done/40", "in-game": "text-olive border-olive/40", community: "text-dim border-line-2", unconfirmed: "text-warn border-warn/40", retired: "text-locked border-line" } as const;

/** Every data point can show where it came from. */
export function VBadge({ v, compact }: { v: Verification; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const Icon = V_ICON[v.status];
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        aria-controls={id}
        className={`inline-flex h-5 items-center gap-1 rounded-[2px] border px-1.5 font-mono text-[10px] uppercase tracking-wider ${V_COLOR[v.status]}`}
        title={VERIFICATION_LABEL[v.status]}
      >
        <Icon size={11} strokeWidth={2} />
        {!compact && VERIFICATION_LABEL[v.status]}
      </button>
      {open && (
        <div id={id} role="dialog" className="absolute right-0 z-50 mt-1.5 w-72 max-w-[80vw] rounded-[3px] border border-line-2 bg-raised p-3 text-left shadow-2xl shadow-black/60" onClick={(e) => e.stopPropagation()}>
          <div className={`mb-1.5 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider ${V_COLOR[v.status].split(" ")[0]}`}>
            <Icon size={12} /> {VERIFICATION_LABEL[v.status]}
          </div>
          {v.note && <p className="mb-2 text-xs leading-relaxed text-fg/90">{v.note}</p>}
          {v.sourceIds.length > 0 ? (
            <ul className="space-y-1">
              {v.sourceIds.map((s) => {
                const src = sourceById.get(s);
                if (!src) return null;
                return (
                  <li key={s} className="text-xs leading-snug">
                    {src.url ? (
                      <a href={src.url} target="_blank" rel="noreferrer noopener" className="text-olive underline decoration-olive/30 underline-offset-2 hover:decoration-olive">
                        {src.name}
                      </a>
                    ) : (
                      <span className="text-dim">{src.name}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-xs text-dim">No source yet.</p>
          )}
          {v.lastVerified && <div className="label mt-2 text-faint">Checked {v.lastVerified}</div>}
        </div>
      )}
    </div>
  );
}

export function ModeTag({ mode }: { mode: string }) {
  const map: Record<string, string> = { mp: "MP", dmz: "DMZ", wz: "WZ", campaign: "CMP", any: "ALL" };
  return <span className="inline-flex h-[18px] min-w-[34px] shrink-0 items-center justify-center rounded-[2px] bg-bg-2 px-1 font-mono text-[10px] tracking-wider text-dim ring-1 ring-line">{map[mode] ?? mode}</span>;
}

export function LevelTag({ level, warn }: { level: number | string; warn?: boolean }) {
  return (
    <span className={`inline-flex h-6 min-w-[46px] shrink-0 items-center justify-center rounded-[2px] px-1.5 font-mono text-[11px] tabular-nums ${warn ? "bg-warn/10 text-warn ring-1 ring-warn/40" : "bg-bg-2 text-fg ring-1 ring-line-2"}`}>
      LV {level}
    </span>
  );
}

export function EmptyState({ icon, title, children }: { icon?: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="hatch flex flex-col items-center justify-center rounded-[3px] border border-dashed border-line-2 px-6 py-12 text-center">
      <div className="mb-3 text-locked">{icon ?? <Lock size={22} />}</div>
      <div className="h-display text-xl text-fg">{title}</div>
      {children && <div className="mt-2 max-w-md text-sm leading-relaxed text-dim">{children}</div>}
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex items-center gap-3 py-16 text-dim">
      <span className="h-2 w-2 animate-pulse rounded-full bg-olive" />
      <span className="label">Loading armory…</span>
    </div>
  );
}

export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="scrollbar-none inline-flex max-w-full overflow-x-auto rounded-[3px] border border-line bg-bg-2 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`h-7 shrink-0 rounded-[2px] px-3 font-mono text-[11px] uppercase tracking-wider transition-colors ${value === o.value ? "bg-raised text-fg ring-1 ring-olive/60" : "text-dim hover:text-fg"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Small notice for content that hasn't been published by a reliable source. */
export function Pending({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-[3px] border border-warn/30 bg-warn/[0.04] p-4">
      <Info size={16} className="mt-0.5 shrink-0 text-warn" />
      <div className="text-sm leading-relaxed text-dim">{children}</div>
    </div>
  );
}

/**
 * Clickable card that may contain other buttons (e.g. a source badge).
 * A real <button> can't contain another button, so this is a keyboard-accessible div.
 */
export function CardButton({ onClick, className = "", children, label }: { onClick: () => void; className?: string; children: ReactNode; label?: string }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-olive ${className}`}
    >
      {children}
    </div>
  );
}
