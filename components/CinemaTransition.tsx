"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCinemaTransition } from "./CinemaTransitionContext";

export default function CinemaTransition() {
  const { transition, clearTransition } = useCinemaTransition();
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "expanding" | "holding">("idle");

  useEffect(() => {
    if (transition) {
      setPhase("expanding");
    }
  }, [transition]);

  const handleExpandComplete = () => {
    if (phase === "expanding" && transition) {
      setPhase("holding");
      // Navigate after the expansion animation completes
      router.push(`/destinations/${transition.slug}`);
      // Clear after a short delay to let the new page render underneath
      setTimeout(() => {
        setPhase("idle");
        clearTransition();
      }, 400);
    }
  };

  if (!transition) return null;

  const { rect, imageSrc } = transition;

  // Calculate the scale needed to fill the viewport from the card's position
  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1920;
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 1080;

  return (
    <AnimatePresence>
      {phase !== "idle" && (
        <motion.div
          key="cinema-overlay"
          className="fixed inset-0 z-[9998] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          {/* Expanding image container */}
          <motion.div
            className="absolute overflow-hidden"
            initial={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              borderRadius: "2rem",
            }}
            animate={{
              top: 0,
              left: 0,
              width: viewportW,
              height: viewportH,
              borderRadius: "0rem",
            }}
            transition={{
              duration: 0.6,
              ease: [0.32, 0.72, 0, 1], // Custom cinematic bezier
            }}
            onAnimationComplete={handleExpandComplete}
          >
            {/* The hero image expanding */}
            <motion.img
              src={imageSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            />

            {/* Cinematic dark gradient overlay (matches destination page header) */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(8,7,6,0.6) 50%, rgba(8,7,6,0.95) 100%)",
              }}
            />

            {/* Subtle vignette */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
