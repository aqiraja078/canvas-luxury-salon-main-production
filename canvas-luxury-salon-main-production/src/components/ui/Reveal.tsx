"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useSyncExternalStore, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Slight scale for cards */
  scale?: boolean;
};

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  scale,
}: Props) {
  const isClient = useIsClient();
  const reduce = useReducedMotion();

  if (!isClient || reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, scale: scale ? 0.97 : 1 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-24px 0px -80px 0px", amount: 0.2 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
