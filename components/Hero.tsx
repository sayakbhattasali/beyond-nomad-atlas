"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPinned, Sparkles } from "lucide-react";
import { useWeatherAtmosphere } from "@/hooks/useWeatherAtmosphere";
import { useEffect, useState } from "react";
import { destinations, Destination } from "@/data/destinations";

// ─── Subtle rain streaks ───────────────────────────────────────────────────
function RainLayer() {
  const streaks = Array.from({ length: 48 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-85 md:opacity-65">
      {streaks.map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 rounded-full bg-white/20"
          style={{
            left: `${(i / 48) * 100 + Math.random() * 4}%`,
            width: i % 4 === 0 ? "1.5px" : "1px",
            height: `${80 + Math.random() * 100}px`,
          }}
          animate={{ y: ["0vh", "110vh"], opacity: [0, 0.6, 0] }}
          transition={{
            duration: 0.8 + Math.random() * 0.7,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated cloud drift ──────────────────────────────────────────────────
function CloudLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-100 md:opacity-90">
      {/* Primary layered mass — much more visible */}
      <motion.div
        className="absolute -left-[30%] top-[-5%] h-[60vh] w-[100vw] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(210,205,200,0.22), rgba(160,155,150,0.10) 40%, transparent 75%)",
          filter: "blur(90px)",
        }}
        animate={{ x: ["0vw", "50vw", "0vw"] }}
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Secondary drifting shape — higher contrast */}
      <motion.div
        className="absolute right-[-20%] top-[10%] h-[50vh] w-[85vw] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(190,188,185,0.18), rgba(140,138,135,0.08) 45%, transparent 80%)",
          filter: "blur(110px)",
        }}
        animate={{ x: ["0vw", "-40vw", "0vw"] }}
        transition={{ duration: 48, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Tertiary bottom mass */}
      <motion.div
        className="absolute -left-[25%] bottom-[-5%] h-[45vh] w-[90vw] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(180,178,175,0.14), transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{ x: ["0vw", "45vw", "0vw"], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Fourth layer for extra depth */}
      <motion.div
        className="absolute right-[10%] bottom-[20%] h-[30vh] w-[60vw] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(200,200,205,0.1), transparent 60%)",
          filter: "blur(100px)",
        }}
        animate={{ x: ["0vw", "-25vw", "0vw"] }}
        transition={{ duration: 55, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ─── Soft fog pulse ────────────────────────────────────────────────────────
function FogLayer() {
  return (
    <>
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-55 md:opacity-28"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 30%, rgba(160,155,148,0.08), transparent 70%)",
        }}
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-45 md:opacity-22"
        style={{
          background:
            "radial-gradient(ellipse 60% 30% at 30% 60%, rgba(130,125,118,0.06), transparent 70%)",
        }}
        animate={{ opacity: [0.7, 0.4, 0.7], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────
export default function Hero() {
  const { theme, state, isLoaded } = useWeatherAtmosphere();
  const [isDesktop, setIsDesktop] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    name: string;
    slug: string;
    steps: string[];
    subtitle: string;
  } | null>(null);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    // Pick random recommendation
    const randomDest = destinations[Math.floor(Math.random() * destinations.length)];
    // Randomly pick 4 steps or first 4
    const steps = randomDest.itinerary.slice(0, 4);

    const subtitles = [
      "Based on tonight's mood",
      "Current Bhubaneswar atmosphere",
      "Good weather for this",
      "Late evening recommendation",
      "Perfect cinematic escape"
    ];
    const subtitle = subtitles[Math.floor(Math.random() * subtitles.length)];

    setRecommendation({
      name: randomDest.name,
      slug: randomDest.slug,
      steps: steps.length > 0 ? steps : randomDest.itinerary.slice(0, 4),
      subtitle
    });

    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const desktopImageAdj = isDesktop ? 0.06 : 0;
  const imageFilter = isLoaded
    ? `brightness(${theme.imageBrightness + desktopImageAdj}) saturate(${theme.imageSaturation + desktopImageAdj}) contrast(${theme.imageContrast})`
    : "brightness(0.82) saturate(0.92) contrast(1.04)";

  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden px-6 pb-20 pt-24 md:pb-24 md:pt-28 lg:pb-28 lg:pt-32"
      aria-label={`Hero — ${isLoaded ? theme.label : "Loading atmosphere"}`}
    >
      {/* ── Background Layers ── */}
      <div className="absolute inset-0 z-0">

        {/* Mobile background */}
        <div className="absolute inset-0 md:hidden">
          <div
            className="absolute inset-0 bg-[url('/images/mobile-hero.png')] bg-cover bg-center transition-all duration-[2000ms] ease-in-out"
            style={{ filter: imageFilter }}
          />
        </div>

        {/* Desktop background — higher base opacity for clarity */}
        <div
          className="absolute inset-0 hidden bg-[url('/images/hero.png')] bg-cover bg-center opacity-65 transition-all duration-[2000ms] ease-in-out md:block"
          style={{ filter: imageFilter }}
        />

        {/* Atmospheric tint layer — lighter on desktop */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            className="absolute inset-0 md:opacity-50"
            style={{ backgroundColor: theme.tintColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Main gradient overlay — reduced on desktop */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`overlay-${state}`}
            className="absolute inset-0 md:opacity-70"
            style={{ background: theme.overlayGradient }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Primary glow blob — subtler on desktop */}
        <motion.div
          className="absolute left-1/2 top-1/4 h-56 w-56 md:h-52 md:w-52 rounded-full blur-[60px] md:blur-[80px] md:opacity-55"
          style={{ backgroundColor: theme.glowPrimary }}
          animate={{ y: [0, 28, 0], x: [0, -24, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Secondary glow blob — subtler on desktop */}
        <motion.div
          className="absolute bottom-20 right-10 h-64 w-64 md:h-72 md:w-72 rounded-full blur-[80px] md:blur-[100px] md:opacity-45"
          style={{ backgroundColor: theme.glowSecondary }}
          animate={{ y: [0, -34, 0], x: [0, 24, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Conditional atmospheric effects */}
        {isLoaded && theme.showRain && <RainLayer />}
        {isLoaded && theme.showClouds && <CloudLayer />}
        {isLoaded && theme.showFog && <FogLayer />}

        {/* ── Bottom Cinematic Transition ── */}
        <div className="absolute inset-x-0 bottom-0 z-[1] h-[35vh] pointer-events-none">
          {/* Deep ink fade that perfectly matches the page background */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/95 to-transparent" />

          {/* Subtle atmospheric depth blur */}
          <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-ink to-transparent opacity-80 blur-3xl" />

          {/* Soft shadow blending for smooth flow */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent opacity-50" />
        </div>
      </div>

      {/* ── Hero Content ── */}
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 md:gap-12 lg:grid-cols-[1.1fr_.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-balance text-[2.75rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl md:text-[4.25rem] lg:text-[5rem] xl:text-[5.5rem]">
            Explore Odisha beyond the classroom.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/60 sm:mt-7 sm:text-lg sm:leading-8 md:max-w-2xl">
            A cinematic travel OS for evening walks, café plans, beach resets,
            intercity day trips and overnight escapes from KIIT.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <Link
              href="/planner"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ember px-7 py-3.5 text-[15px] font-semibold text-black transition hover:bg-amberSoft hover:scale-[1.02] active:scale-[0.98]"
            >
              Start planning <ArrowRight size={18} />
            </Link>
            <Link
              href="/destinations"
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-7 py-3.5 text-[15px] font-semibold text-white backdrop-blur-xl transition hover:bg-white/12"
            >
              Browse destinations
            </Link>
          </div>
        </motion.div>

        {/* Dynamic Recommendation Card */}
        <Link
          href={recommendation ? `/destinations/${recommendation.slug}` : "/destinations"}
          className="block group"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9 }}
            className="glass relative overflow-hidden rounded-[2.5rem] p-5 transition-all duration-500 group-hover:bg-white/[0.04] group-hover:shadow-[0_0_40px_rgba(255,191,0,0.05)] active:scale-[0.98]"
          >
            <div className="rounded-[2rem] border border-white/14 bg-black/18 p-6">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[.32em] text-ember">
                    {recommendation?.subtitle || "Feels Like"}
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold transition-colors group-hover:text-ember">
                    {recommendation?.name || "Loading..."}
                  </h2>
                </div>
                <MapPinned className="text-ember transition-transform group-hover:scale-110" />
              </div>
              <div className="space-y-4">
                {(recommendation?.steps || []).map((step, index) => (
                  <div
                    key={`${recommendation?.name}-${index}`}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition-colors group-hover:bg-white/[0.08]"
                  >
                    <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-ember/15 text-sm font-semibold text-ember ring-1 ring-ember/30 shadow-[0_0_12px_rgba(255,191,0,0.15)]">
                      {index + 1}
                    </span>
                    <p className="text-sm text-white/70 line-clamp-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
