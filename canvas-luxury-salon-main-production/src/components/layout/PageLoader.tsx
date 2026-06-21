"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const isDev = process.env.NODE_ENV === "development";

export function PageLoader() {
  const [done, setDone] = useState(isDev);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (isDev) return;
    const t = window.setTimeout(() => setDone(true), reduce ? 0 : 650);
    return () => window.clearTimeout(t);
  }, [reduce]);

  if (isDev || reduce) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            className="font-display text-2xl tracking-wide text-gold-light sm:text-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {site.name}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
