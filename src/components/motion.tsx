"use client";

import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type Variants } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Counts up/down to `value` whenever it changes. */
export function AnimatedNumber({ value, decimals = 0, className = "" }: { value: number; decimals?: number; className?: string }) {
  const [shown, setShown] = useState(value);
  const from = useRef(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) {
      setShown(value);
      from.current = value;
      return;
    }
    const c = animate(from.current, value, { duration: 0.9, ease: [0.2, 0.7, 0.2, 1], onUpdate: (v) => setShown(v) });
    from.current = value;
    return () => c.stop();
  }, [value, reduce]);
  return <span className={`tabular-nums ${className}`}>{shown.toFixed(decimals)}</span>;
}

export const staggerParent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: 0.04 } } };
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 320, damping: 28 } },
};

/** Grid/list whose children rise in sequence. Children should be <Stagger.Item>. */
export function Stagger({ children, className = "", as = "div", step = 0.035 }: { children: ReactNode; className?: string; as?: "div" | "ul"; step?: number }) {
  const C = as === "ul" ? motion.ul : motion.div;
  return (
    <C className={className} variants={{ hidden: {}, show: { transition: { staggerChildren: step, delayChildren: 0.04 } } }} initial="hidden" animate="show">
      {children}
    </C>
  );
}
Stagger.Item = function Item({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={staggerChild}>
      {children}
    </motion.div>
  );
};

/** Section that rises in on mount. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 30, delay }}>
      {children}
    </motion.div>
  );
}

/** 3D tilt toward the pointer with a moving glare — for cards you can pick up and look at. */
export function TiltCard({ children, className = "", max = 9 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 220, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 220, damping: 20 });
  const glare = useTransform([px, py], ([x, y]: number[]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgb(240 242 238 / 0.09), transparent 55%)`);
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <div className="[perspective:1000px]">
      <motion.div
        className={`relative [transform-style:preserve-3d] ${className}`}
        style={{ rotateX: rx, rotateY: ry }}
        whileHover={{ scale: 1.015 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
      >
        {children}
        <motion.div className="pointer-events-none absolute inset-0 rounded-[3px]" style={{ background: glare }} />
      </motion.div>
    </div>
  );
}
