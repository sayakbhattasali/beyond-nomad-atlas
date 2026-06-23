"use client";

import { useState } from "react";
import { Download, Loader2, Image as ImageIcon } from "lucide-react";
import { Destination } from "@/data/destinations";
import { generatePoster } from "./generatePoster";

export default function PosterButton({ destination }: { destination: Destination }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSaveMemory = async () => {
    try {
      setIsGenerating(true);
      const dataUrl = await generatePoster(destination);
      
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `beyond-nomad-${destination.slug}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to generate memory:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleSaveMemory}
      disabled={isGenerating}
      className="glass group relative flex w-full flex-col items-start rounded-[2rem] p-6 md:p-8 text-left transition-all hover:bg-white/[0.04] active:scale-[0.99] disabled:opacity-50 disabled:active:scale-100 shadow-glass overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-ember/5 blur-3xl transition-all group-hover:bg-ember/10" />

      <div className="mb-5 flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ember/15 text-ember transition-all group-hover:bg-ember/25 group-hover:scale-105">
            <ImageIcon size={20} />
          </span>
          <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">Save Memory</h3>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-full bg-white/5 text-white/40 transition-all group-hover:bg-white/10 group-hover:text-ember">
          {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-1">
        <p className="text-sm md:text-base text-white/60 leading-relaxed max-w-[280px] sm:max-w-md">
          Preserve this cinematic journey as a collectible memory fragment.
        </p>
        <span className="text-[10px] uppercase tracking-[0.2em] text-ember/60 mt-2">
          High-Quality Cinematic Export
        </span>
      </div>
    </button>
  );
}
