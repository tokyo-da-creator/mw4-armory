"use client";

import { AnimatePresence, motion, useDragControls } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

function useIsDesktop() {
  const [d, setD] = useState(true);
  useEffect(() => {
    const m = window.matchMedia("(min-width: 768px)");
    const f = () => setD(m.matches);
    f();
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  return d;
}

/** Right-hand drawer on desktop, bottom sheet on mobile (drag down to dismiss). Escape / backdrop closes. */
export function Sheet({ open, onClose, title, children, code }: { open: boolean; onClose: () => void; title: ReactNode; code?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();
  const drag = useDragControls();
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    setTimeout(() => ref.current?.focus(), 0);
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", k);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, [open, onClose]);

  const from = desktop ? { x: "100%" } : { y: "100%" };
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
          <motion.div
            ref={ref}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            initial={from}
            animate={{ x: 0, y: 0 }}
            exit={from}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            drag={desktop ? false : "y"}
            dragListener={false}
            dragControls={drag}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, i) => (i.offset.y > 120 || i.velocity.y > 600) && onClose()}
            className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-[6px] border-t border-line-2 bg-bg-2 outline-none md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[480px] md:rounded-none md:border-l md:border-t-0"
          >
            <div className="flex h-5 touch-none items-center justify-center md:hidden" onPointerDown={(e) => drag.start(e)} aria-hidden>
              <div className="h-1 w-10 rounded-full bg-line-2" />
            </div>
            <div onPointerDown={(e) => !desktop && !(e.target as HTMLElement).closest("button") && drag.start(e)} className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-line bg-bg-2/95 px-5 py-4 backdrop-blur">
              <div className="min-w-0">
                {code && <div className="label mb-1">{code}</div>}
                <div className="h-display text-2xl text-fg">{title}</div>
              </div>
              <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 flex h-9 w-9 items-center justify-center text-dim hover:text-fg">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
