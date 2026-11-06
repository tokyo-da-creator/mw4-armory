"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type ReactNode } from "react";

export interface ZoomHandle {
  zoom: (factor: number) => void;
  reset: () => void;
}

const MIN = 1;
const MAX = 8;

/**
 * Pan / zoom surface for any content: wheel or pinch to zoom (anchored at the
 * cursor or fingers), drag to pan, double-click/tap to toggle 2.5×, keyboard
 * + / - / 0 and arrow keys. At 1× the content tilts slightly toward the pointer.
 */
export const ZoomViewer = forwardRef<ZoomHandle, { children: ReactNode; className?: string; label: string; onZoomChange?: (s: number) => void }>(function ZoomViewer(
  { children, className = "", label, onZoomChange },
  ref,
) {
  const box = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ s: 1, x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [dragging, setDragging] = useState(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const last = useRef<{ x: number; y: number; d: number } | null>(null);
  const tap = useRef(0);

  const clamp = useCallback((n: { s: number; x: number; y: number }) => {
    const el = box.current;
    const s = Math.min(MAX, Math.max(MIN, n.s));
    if (!el || s === 1) return { s, x: 0, y: 0 };
    const w = el.clientWidth;
    const h = el.clientHeight;
    const mx = ((s - 1) * w) / 2;
    const my = ((s - 1) * h) / 2;
    return { s, x: Math.min(mx, Math.max(-mx, n.x)), y: Math.min(my, Math.max(-my, n.y)) };
  }, []);

  /** Zoom by factor keeping the point (cx, cy) — relative to the box centre — fixed. */
  const zoomAt = useCallback(
    (factor: number, cx = 0, cy = 0) =>
      setT((p) => {
        const s = Math.min(MAX, Math.max(MIN, p.s * factor));
        const k = s / p.s;
        return clamp({ s, x: cx - (cx - p.x) * k, y: cy - (cy - p.y) * k });
      }),
    [clamp],
  );

  useImperativeHandle(ref, () => ({ zoom: (f) => zoomAt(f), reset: () => setT({ s: 1, x: 0, y: 0 }) }), [zoomAt]);
  useEffect(() => onZoomChange?.(t.s), [t.s, onZoomChange]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * 0.0022), e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2);
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [zoomAt]);

  const rel = (e: { clientX: number; clientY: number }) => {
    const r = box.current!.getBoundingClientRect();
    return { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 };
  };

  return (
    <div
      ref={box}
      tabIndex={0}
      role="img"
      aria-label={`${label}. Scroll or pinch to zoom, drag to pan, double-click to zoom in.`}
      className={`relative touch-none select-none overflow-hidden outline-none [perspective:1200px] ${t.s > 1 ? (dragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"} ${className}`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture?.(e.pointerId);
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        setDragging(true);
        const ps = [...pointers.current.values()];
        last.current = ps.length === 2 ? { x: (ps[0].x + ps[1].x) / 2, y: (ps[0].y + ps[1].y) / 2, d: Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y) } : { x: e.clientX, y: e.clientY, d: 0 };
        const now = Date.now();
        if (e.pointerType !== "mouse" && now - tap.current < 280) zoomAt(t.s > 1.5 ? 1 / t.s : 2.5, rel(e).x, rel(e).y);
        tap.current = now;
      }}
      onPointerMove={(e) => {
        if (!pointers.current.has(e.pointerId)) {
          if (t.s === 1 && e.pointerType === "mouse") {
            const p = rel(e);
            const r = box.current!.getBoundingClientRect();
            setTilt({ rx: (-p.y / r.height) * 8, ry: (p.x / r.width) * 10 });
          }
          return;
        }
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const ps = [...pointers.current.values()];
        const prev = last.current;
        if (!prev) return;
        if (ps.length === 2) {
          const mid = { x: (ps[0].x + ps[1].x) / 2, y: (ps[0].y + ps[1].y) / 2 };
          const d = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y);
          if (prev.d) { const m = rel({ clientX: mid.x, clientY: mid.y }); zoomAt(d / prev.d, m.x, m.y); }
          setT((p) => clamp({ ...p, x: p.x + mid.x - prev.x, y: p.y + mid.y - prev.y }));
          last.current = { ...mid, d };
        } else {
          setT((p) => clamp({ ...p, x: p.x + e.clientX - prev.x, y: p.y + e.clientY - prev.y }));
          last.current = { x: e.clientX, y: e.clientY, d: 0 };
        }
      }}
      onPointerUp={(e) => {
        pointers.current.delete(e.pointerId);
        if (!pointers.current.size) setDragging(false);
        const ps = [...pointers.current.values()];
        last.current = ps[0] ? { ...ps[0], d: 0 } : null;
      }}
      onPointerCancel={(e) => {
        pointers.current.delete(e.pointerId);
        setDragging(false);
      }}
      onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
      onDoubleClick={(e) => zoomAt(t.s > 1.5 ? 1 / t.s : 2.5, rel(e).x, rel(e).y)}
      onKeyDown={(e) => {
        const step = 40;
        if (e.key === "+" || e.key === "=") zoomAt(1.4);
        else if (e.key === "-") zoomAt(1 / 1.4);
        else if (e.key === "0") setT({ s: 1, x: 0, y: 0 });
        else if (e.key.startsWith("Arrow")) {
          const dx = e.key === "ArrowLeft" ? step : e.key === "ArrowRight" ? -step : 0;
          const dy = e.key === "ArrowUp" ? step : e.key === "ArrowDown" ? -step : 0;
          setT((p) => clamp({ ...p, x: p.x + dx, y: p.y + dy }));
        } else return;
        e.preventDefault();
      }}
    >
      <div
        className="h-full w-full will-change-transform"
        style={{
          transform: `translate3d(${t.x}px, ${t.y}px, 0) scale(${t.s}) rotateX(${t.s === 1 ? tilt.rx : 0}deg) rotateY(${t.s === 1 ? tilt.ry : 0}deg)`,
          transition: dragging ? "none" : "transform 220ms cubic-bezier(.2,.7,.2,1)",
        }}
      >
        {children}
      </div>
      {t.s > 1 && <div className="pointer-events-none absolute bottom-2 left-2 rounded-[2px] bg-bg/80 px-1.5 py-0.5 font-mono text-[10px] text-dim">{t.s.toFixed(1)}×</div>}
    </div>
  );
});

/** Fullscreen inspection overlay with animated open/close. */
export function Lightbox({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  // Portals only exist on the client; render nothing until mounted so server and client HTML match.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div onClick={(e) => e.stopPropagation()} className="fixed inset-0 z-[80] flex flex-col bg-bg/95 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} role="dialog" aria-modal="true" aria-label={title}>
          <div className="flex items-center justify-between border-b border-line px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <div className="h-display truncate text-2xl text-fg">{title}</div>
            <button type="button" onClick={onClose} aria-label="Close inspection" className="flex h-10 w-10 items-center justify-center text-dim hover:text-fg">
              <X size={20} />
            </button>
          </div>
          <motion.div className="relative min-h-0 flex-1" initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 26 }}>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
