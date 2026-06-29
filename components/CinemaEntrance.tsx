"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

/**
 * Wraps content in a cinematic fade-up entrance animation.
 * Used on pages that are targets of the cinema transition overlay.
 */
export default function CinemaEntrance({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
