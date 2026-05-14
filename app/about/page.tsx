import SectionHeader from "@/components/SectionHeader";
import { MotionDiv, MotionSection, fadeUp, stagger } from "@/components/Motion";
import { Compass, MapPinned, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="page-shell px-6 pb-24">
      <MotionSection initial="hidden" animate="show" variants={stagger} className="mx-auto max-w-7xl pt-12">
        <SectionHeader
          eyebrow="The Vision"
          title="A travel guide that thinks like a KIIT student."
          description="BEYOND NOMAD Atlas is not meant to be another tourism directory. It is a curated map of atmospheric paths, emotional resonance, and timeless escape."
        />

        <MotionDiv variants={fadeUp} className="glass mb-10 rounded-[2.5rem] p-8 md:p-12">
          <h2 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Some days need a walk. Some need Puri. Some need a train out of the routine.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/62">
            The platform organizes Odisha experiences by how modern explorers actually plan:
            how much time they have, how they wish to wander, and what kind of atmospheric memory they want to create.
          </p>
        </MotionDiv>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: Compass, title: "Vibe-first discovery", text: "Atmospheric walks, hidden resets, intercity paths and overnight journeys." },
            { icon: MapPinned, title: "The Nomad Path", text: "Every route is framed from an explorer's reality, not generic tourist maps." },
            { icon: Sparkles, title: "Cinematic Atmosphere", text: "Built to feel expansive, atmospheric and emotionally immersive from the first screen." }
          ].map((item) => (
            <MotionDiv key={item.title} variants={fadeUp} className="glass rounded-[2rem] p-6">
              <item.icon className="mb-5 text-ember" />
              <h3 className="mb-3 text-2xl font-semibold">{item.title}</h3>
              <p className="leading-7 text-white/58">{item.text}</p>
            </MotionDiv>
          ))}
        </div>
      </MotionSection>
    </main>
  );
}
