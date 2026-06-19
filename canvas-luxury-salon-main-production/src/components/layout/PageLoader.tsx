"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { HumaLogo } from "@/components/brand/HumaLogo";

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
          <div className="flex flex-col items-center gap-6">
            <motion.div
              className="h-px w-32 bg-gradient-to-r from-transparent via-gold to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <HumaLogo variant="ornate" size="lg" className="group justify-center" />
            </motion.div>
            <motion.div
              className="h-1 w-24 overflow-hidden rounded-full bg-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="h-full w-1/2 rounded-full bg-gold"
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.1,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
