"use client";

import { useMemo, useState } from "react";
import { destinations, TransportMode, Vibe } from "@/data/destinations";
import DestinationCard from "@/components/DestinationCard";
import { MotionDiv, stagger } from "@/components/Motion";
import { SlidersHorizontal } from "lucide-react";

const vibes: Array<Vibe | "any"> = ["any", "peaceful", "friends", "romantic", "photography", "heritage", "beach", "nature", "food"];
const transportModes: Array<TransportMode | "any"> = ["any", "bike", "cab", "train", "bus", "auto"];
const durations = ["any", "2-4 hours", "half day", "full day", "overnight"] as const;
const budgets = [
  { label: "Any budget", value: 99999 },
  { label: "Under ₹500", value: 500 },
  { label: "Under ₹1000", value: 1000 },
  { label: "Under ₹2000", value: 2000 },
  { label: "Weekend budget", value: 6000 }
];

export default function PlannerClient() {
  const [vibe, setVibe] = useState<Vibe | "any">("any");
  const [transport, setTransport] = useState<TransportMode | "any">("any");
  const [duration, setDuration] = useState<(typeof durations)[number]>("any");
  const [budget, setBudget] = useState(2000);

  const results = useMemo(() => {
    return destinations.filter((destination) => {
      const budgetMatch = destination.budget <= budget;
      const vibeMatch = vibe === "any" || destination.vibes.includes(vibe);
      const transportMatch = transport === "any" || destination.transport.includes(transport);
      const durationMatch = duration === "any" || destination.durationType.includes(duration);
      return budgetMatch && vibeMatch && transportMatch && durationMatch;
    });
  }, [budget, vibe, transport, duration]);

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <aside className="glass h-fit rounded-[2rem] p-5 lg:sticky lg:top-28">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ember/15 text-ember">
            <SlidersHorizontal size={20} />
          </span>
          <div>
            <h2 className="font-semibold text-white">Trip Moodboard</h2>
            <p className="text-sm text-white/50">Tune the escape.</p>
          </div>
        </div>

        <div className="space-y-5">
          <label className="grid gap-2">
            <span className="text-sm text-white/65">Budget Per Person</span>
            <select value={budget} onChange={(event) => setBudget(Number(event.target.value))} className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none focus:border-ember/60">
              {budgets.map((item) => <option key={item.label} value={item.value}>{item.label}</option>)}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-white/65">Duration</span>
            <select value={duration} onChange={(event) => setDuration(event.target.value as typeof duration)} className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none focus:border-ember/60">
              {durations.map((item) => <option key={item} value={item}>{item === "any" ? "Any duration" : item}</option>)}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-white/65">Vibe</span>
            <select value={vibe} onChange={(event) => setVibe(event.target.value as Vibe | "any")} className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none focus:border-ember/60">
              {vibes.map((item) => <option key={item} value={item}>{item === "any" ? "Any vibe" : item}</option>)}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-white/65">Transport</span>
            <select value={transport} onChange={(event) => setTransport(event.target.value as TransportMode | "any")} className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none focus:border-ember/60">
              {transportModes.map((item) => <option key={item} value={item}>{item === "any" ? "Any transport" : item}</option>)}
            </select>
          </label>
        </div>
      </aside>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[.28em] text-ember">Matches</p>
            <h2 className="mt-2 text-3xl font-semibold">{results.length} routes found</h2>
          </div>
        </div>

        <MotionDiv variants={stagger} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {results.map((destination, index) => (
            <DestinationCard key={destination.slug} destination={destination} index={index} />
          ))}
        </MotionDiv>

        {results.length === 0 && (
          <div className="glass rounded-[2rem] p-8 text-center">
            <h3 className="text-2xl font-semibold">No exact route found.</h3>
            <p className="mt-3 text-white/58">Loosen the budget or transport filter and try again.</p>
          </div>
        )}
      </section>
    </div>
  );
}
