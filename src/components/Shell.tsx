"use client";

import { BookOpen, Crosshair, Grid3x3, Home, Layers, Medal, MoreHorizontal, Palette, Search, Target, Trophy, Users, Wrench, ListOrdered } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CATALOG, DATA_VERSION } from "@/data";
import { search, staticIndex, type SearchDoc } from "@/lib/search";

export const NAV = [
  { href: "/", label: "Home", short: "Home", icon: Home, code: "01" },
  { href: "/unlocks/", label: "Level Unlocks", short: "Levels", icon: ListOrdered, code: "02" },
  { href: "/weapons/", label: "Weapons", short: "Weapons", icon: Crosshair, code: "03" },
  { href: "/camos/", label: "Camos", short: "Camos", icon: Palette, code: "04" },
  { href: "/attachments/", label: "Attachments", short: "Attach", icon: Wrench, code: "05" },
  { href: "/equipment/", label: "Equipment & Perks", short: "Gear", icon: Layers, code: "06" },
  { href: "/operators/", label: "Operators", short: "Ops", icon: Users, code: "07" },
  { href: "/prestige/", label: "Prestige", short: "Prestige", icon: Medal, code: "08" },
  { href: "/mastery/", label: "Mastery", short: "Mastery", icon: Trophy, code: "09" },
  { href: "/challenges/", label: "All Challenges", short: "Challenges", icon: Target, code: "10" },
  { href: "/sources/", label: "Sources & About", short: "Sources", icon: BookOpen, code: "11" },
] as const;

const MOBILE = [NAV[0], NAV[1], NAV[2], NAV[3]];

function isActive(path: string, href: string) {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(href) || path + "/" === href;
}

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname() || "/";
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest?.("input,textarea,select,[contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    const open = () => setSearchOpen(true);
    window.addEventListener("keydown", k);
    window.addEventListener("armory:search", open);
    return () => {
      window.removeEventListener("keydown", k);
      window.removeEventListener("armory:search", open);
    };
  }, []);
  useEffect(() => setMoreOpen(false), [path]);

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-dvh md:pl-[248px]">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:bg-olive focus:px-3 focus:py-2 focus:text-bg">
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-line bg-bg-2/80 backdrop-blur md:flex">
        <Link href="/" className="block border-b border-line px-5 pb-4 pt-5">
          <Brand />
        </Link>
        <button type="button" onClick={() => setSearchOpen(true)} className="mx-4 mt-4 flex h-9 items-center gap-2 rounded-[3px] border border-line bg-bg px-3 text-left text-sm text-dim hover:border-line-2">
          <Search size={14} />
          <span className="flex-1">Search armory</span>
          <kbd className="font-mono text-[10px] text-faint">⌘K</kbd>
        </button>
        <nav className="mt-3 flex-1 overflow-y-auto px-2 pb-4" aria-label="Main">
          {NAV.map((n) => {
            const active = isActive(path, n.href);
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`group relative isolate flex h-9 items-center gap-3 rounded-[2px] px-3 text-[13.5px] transition-colors ${active ? "text-fg" : "text-dim hover:bg-card hover:text-fg"}`}
              >
                {active && <motion.span layoutId="nav-active" className="absolute inset-0 -z-10 rounded-[2px] border-l-2 border-olive bg-raised" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                <span className="w-5 font-mono text-[10px] text-faint">{n.code}</span>
                <Icon size={15} className={active ? "text-olive" : ""} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line p-4">
          <p className="text-[10.5px] leading-snug text-faint">Unofficial fan project. Not affiliated with or endorsed by Activision. Data {DATA_VERSION}.</p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-bg/90 px-4 backdrop-blur md:hidden">
        <Link href="/" aria-label="Dashboard">
          <Brand compact />
        </Link>
        <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search" className="flex h-10 w-10 items-center justify-center text-dim">
          <Search size={18} />
        </button>
      </header>

      <main id="main" className="mx-auto w-full max-w-[1320px] px-4 pb-28 pt-6 md:px-8 md:pb-16 md:pt-10">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-bg-2/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {MOBILE.map((n) => {
          const Icon = n.icon;
          const active = isActive(path, n.href);
          return (
            <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined} className={`relative flex h-16 flex-col items-center justify-center gap-1 ${active ? "text-olive" : "text-dim"}`}>
              {active && <motion.span layoutId="mnav-active" className="absolute inset-x-4 top-0 h-[2px] bg-olive" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
              <Icon size={19} />
              <span className="font-mono text-[9.5px] uppercase tracking-wider">{n.short}</span>
            </Link>
          );
        })}
        <button type="button" onClick={() => setMoreOpen((o) => !o)} aria-expanded={moreOpen} className={`flex h-16 flex-col items-center justify-center gap-1 ${moreOpen ? "text-olive" : "text-dim"}`}>
          <MoreHorizontal size={19} />
          <span className="font-mono text-[9.5px] uppercase tracking-wider">More</span>
        </button>
      </nav>

      <AnimatePresence>
      {moreOpen && (
        <motion.div className="fixed inset-0 z-30 md:hidden" onClick={() => setMoreOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60" />
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] grid grid-cols-2 gap-px border-t border-line bg-line" onClick={(e) => e.stopPropagation()}>
            {NAV.filter((n) => !MOBILE.includes(n as (typeof MOBILE)[number])).map((n) => {
              const Icon = n.icon;
              return (
                <Link key={n.href} href={n.href} className={`flex h-14 items-center gap-3 bg-bg-2 px-4 text-sm ${isActive(path, n.href) ? "text-olive" : "text-fg"}`}>
                  <Icon size={16} className="text-dim" /> {n.label}
                </Link>
              );
            })}
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
    </MotionConfig>
  );
}

function Brand({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-8 w-8 items-center justify-center border border-olive/60">
        <Grid3x3 size={14} className="text-olive" />
        <span className="absolute -right-px -top-px h-1.5 w-1.5 bg-gold" />
      </div>
      <div className="leading-none">
        <div className="h-display text-[1.35rem] tracking-[0.04em] text-fg">
          MW4 <span className="text-olive">Armory</span>
        </div>
        {!compact && <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Every unlock &amp; how to get it</div>}
      </div>
    </div>
  );
}

const KIND_LABEL: Record<SearchDoc["kind"], string> = { weapon: "Weapon", category: "Class", camo: "Camo", challenge: "Challenge", attachment: "Attachment", prestige: "Prestige", gear: "Gear", operator: "Operator" };
const FILTERS: (SearchDoc["kind"] | "all")[] = ["all", "weapon", "camo", "gear", "operator", "attachment", "challenge", "prestige"];

function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<(typeof FILTERS)[number]>("all");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const docs = useMemo(() => staticIndex(), []);
  const results = useMemo(() => search(q, kind === "all" ? docs : docs.filter((d) => d.kind === kind), 40), [q, kind, docs]);

  useEffect(() => {
    if (open) {
      setSel(0);
      setTimeout(() => input.current?.focus(), 10);
    }
  }, [open]);
  useEffect(() => setSel(0), [q, kind]);

  const go = useCallback(
    (d: SearchDoc) => {
      onClose();
      setQ("");
      router.push(d.href);
    },
    [onClose, router],
  );

  return (
    <AnimatePresence>
    {open && (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="fixed inset-0 z-[70] flex items-start justify-center bg-black/70 p-0 backdrop-blur-[2px] md:p-4 md:pt-[12vh]" onClick={onClose}>
      <motion.div initial={{ y: -14, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: -8, scale: 0.98 }} transition={{ type: "spring", stiffness: 420, damping: 32 }} role="dialog" aria-modal="true" aria-label="Search" className="flex h-full w-full flex-col border-line-2 bg-bg-2 md:h-auto md:max-h-[70vh] md:max-w-2xl md:rounded-[4px] md:border" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={16} className="text-olive" />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSel((s) => Math.min(s + 1, results.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setSel((s) => Math.max(s - 1, 0));
              }
              if (e.key === "Enter" && results[sel]) go(results[sel]);
            }}
            placeholder={`Search ${CATALOG.weapons.length} weapons, camos, gear, operators…`}
            className="h-14 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-faint"
            aria-label="Search query"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
          />
          <button type="button" onClick={onClose} className="label hover:text-fg">Esc</button>
        </div>
        <div className="scrollbar-none flex gap-1.5 overflow-x-auto border-b border-line px-4 py-2.5">
          {FILTERS.map((f) => (
            <button key={f} type="button" className="chip" aria-pressed={kind === f} onClick={() => setKind(f)}>
              {f === "all" ? "All" : KIND_LABEL[f]}
            </button>
          ))}
        </div>
        <ul id="search-results" role="listbox" className="flex-1 overflow-y-auto py-1">
          {q && results.length === 0 && <li className="px-4 py-8 text-center text-sm text-dim">No matches for “{q}”.</li>}
          {!q && <li className="px-4 py-8 text-center text-sm text-dim">Try “han 86”, “stormwave”, “ghost”, “uav”, “price” or “skybreaker”.</li>}
          {results.map((r, i) => (
            <li key={r.id} role="option" aria-selected={i === sel}>
              <button
                type="button"
                onMouseEnter={() => setSel(i)}
                onClick={() => go(r)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left ${i === sel ? "bg-raised" : ""}`}
              >
                <span className="w-[74px] shrink-0 font-mono text-[10px] uppercase tracking-wider text-faint">{KIND_LABEL[r.kind]}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-fg">{r.title}</span>
                  <span className="block truncate text-xs text-dim">{r.subtitle}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
    )}
    </AnimatePresence>
  );
}

