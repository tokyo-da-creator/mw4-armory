"use client";

import { AnimatePresence, motion } from "motion/react";
import { Boxes, Expand, Hand, Pause, Play, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Weapon } from "@/data/schema";
import type { Weapon3DHandle } from "./Weapon3D";
import { WeaponSchematic } from "./WeaponArt";
import { Lightbox } from "./ZoomViewer";

const Weapon3D = dynamic(() => import("./Weapon3D"), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center"><span className="label animate-pulse">Assembling model…</span></div>,
});

function ToolButton({ label, onClick, active, children }: { label: string; onClick: () => void; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`flex h-9 w-9 items-center justify-center rounded-[3px] border backdrop-blur transition-colors ${active ? "border-olive bg-olive/15 text-olive" : "border-line-2 bg-bg/70 text-dim hover:border-olive hover:text-fg"}`}
    >
      {children}
    </button>
  );
}

/** The interactive weapon stage: 3D model with orbit, zoom, pan and exploded view. */
function Stage({ weapon, full, onExpand }: { weapon: Weapon; full?: boolean; onExpand?: () => void }) {
  const [spin, setSpin] = useState(true);
  const [exploded, setExploded] = useState(false);
  const [hint, setHint] = useState(true);
  const h3 = useRef<Weapon3DHandle | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 4500);
    return () => clearTimeout(t);
  }, []);

  const zoom = (f: number) => h3.current?.zoom(f);

  return (
    <div className={`grid-bg relative h-full w-full overflow-hidden bg-bg-2 ${full ? "" : "min-h-[260px]"}`} onPointerDown={() => setHint(false)}>
      {/* vignette + scanline atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(9_11_10/0.75)_100%)]" />
      <div className="scan pointer-events-none absolute inset-x-0 z-[1] h-24" />

      <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <Weapon3D category={weapon.category} onReady={(h) => (h3.current = h)} autoRotate={spin} />
      </motion.div>

      <div className="pointer-events-none absolute left-3 top-3 z-[2] font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
        3D schematic · not in-game model
      </div>
      {!full && <div className="pointer-events-none absolute bottom-3 left-4 z-[2] h-display text-[clamp(1.6rem,6vw,4.25rem)] text-fg/[0.07]">{weapon.name}</div>}

      <AnimatePresence>
        {hint && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pointer-events-none absolute bottom-4 left-1/2 z-[2] flex -translate-x-1/2 items-center gap-2 rounded-[3px] border border-line-2 bg-bg/80 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-fg backdrop-blur">
            <Hand size={13} className="text-olive" /> Drag to rotate · pinch or scroll to zoom
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute right-3 top-3 z-[3] flex flex-col gap-1.5">
        <ToolButton label="Zoom in" onClick={() => zoom(0.7)}><ZoomIn size={15} /></ToolButton>
        <ToolButton label="Zoom out" onClick={() => zoom(1.4)}><ZoomOut size={15} /></ToolButton>
        {(
          <>
            <ToolButton label={spin ? "Stop turntable" : "Start turntable"} active={spin} onClick={() => { h3.current?.setAutoRotate(!spin); setSpin(!spin); }}>
              {spin ? <Pause size={15} /> : <Play size={15} />}
            </ToolButton>
            <ToolButton label={exploded ? "Assemble" : "Exploded view"} active={exploded} onClick={() => { h3.current?.setExploded(!exploded); setExploded(!exploded); }}>
              <Boxes size={15} />
            </ToolButton>
          </>
        )}
        <ToolButton label="Reset view" onClick={() => { h3.current?.reset(); setExploded(false); }}><RotateCcw size={15} /></ToolButton>
        {onExpand && <ToolButton label="Inspect fullscreen" onClick={onExpand}><Expand size={15} /></ToolButton>}
      </div>
    </div>
  );
}

export function WeaponInspector({ weapon, className = "" }: { weapon: Weapon; className?: string }) {
  const [full, setFull] = useState(false);
  return (
    <>
      <div className={className}>
        {/* Keep the inline WebGL context out while fullscreen is open */}
        {full ? <div className="grid-bg flex h-full min-h-[260px] items-center justify-center bg-bg-2"><WeaponSchematic category={weapon.category} className="h-2/3 w-2/3 opacity-30" /></div> : <Stage weapon={weapon} onExpand={() => setFull(true)} />}
      </div>
      <Lightbox open={full} onClose={() => setFull(false)} title={`Inspect · ${weapon.name}`}>
        <Stage weapon={weapon} full />
      </Lightbox>
    </>
  );
}

/** Lightweight inspect trigger + lightbox for list views. */
export function InspectButton({ weapon }: { weapon: Weapon }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label={`Inspect ${weapon.name} in 3D`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className="flex h-8 items-center gap-1.5 rounded-[3px] border border-line-2 bg-bg/80 px-2 font-mono text-[10px] uppercase tracking-wider text-dim opacity-100 backdrop-blur transition hover:border-olive hover:text-fg md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
      >
        <Expand size={12} /> Inspect
      </button>
      <Lightbox open={open} onClose={() => setOpen(false)} title={`Inspect · ${weapon.name}`}>
        <Stage weapon={weapon} full />
      </Lightbox>
    </>
  );
}
