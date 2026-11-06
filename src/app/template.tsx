"use client";

import { motion } from "motion/react";

/** Re-mounts on every navigation: each page slides up and fades in. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}
