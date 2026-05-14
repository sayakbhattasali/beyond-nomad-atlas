import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import CategoryCard from "@/components/CategoryCard";
import DestinationCard from "@/components/DestinationCard";
import { MotionDiv, MotionSection, fadeUp, stagger } from "@/components/Motion";
import { categories } from "@/data/categories";
import { featuredDestinations } from "@/data/destinations";
import Link from "next/link";
import { ArrowRight, CloudRain, Map, WalletCards } from "lucide-react";

export default function HomePage() {
  return (
    <main>
      <Hero />

      <MotionSection
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="px-6 pt-20 pb-10 md:pt-24 md:pb-14"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Seek the Mood"
            title="Atmosphere precedes the journey."
            description="Select the emotional resonance you seek. The destination will follow the vibe."
          />
          <MotionDiv variants={stagger} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <CategoryCard key={category.slug} category={category} index={index} />
            ))}
          </MotionDiv>
        </div>
      </MotionSection>

      <MotionSection
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="px-6 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Signature Atlas"
            title="Curated Explorations"
            description="Our hand-picked routes for the weekend nomad."
            action={
              <Link href="/destinations" className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-sm font-semibold text-white/75 hover:bg-white/8">
                See all <ArrowRight size={16} />
              </Link>
            }
          />
          <MotionDiv variants={stagger} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredDestinations.map((destination, index) => (
              <DestinationCard key={destination.slug} destination={destination} index={index} />
            ))}
          </MotionDiv>
        </div>
      </MotionSection>

      <section className="px-6 pt-10 pb-20 md:pt-14 md:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-radial-warm p-8 shadow-glass md:p-12">
          <MotionDiv initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.36em] text-ember">Built for the Modern Nomad</p>
            <h2 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
              Journeys curated for the atmospheric soul and the curious explorer.
            </h2>
          </MotionDiv>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { icon: WalletCards, title: "Economic Path", text: "Journeys framed around realistic, mindful spending." },
              { icon: Map, title: "Atlas First", text: "Each destination includes atmospheric paths and travel feel." },
              { icon: CloudRain, title: "Vibe Driven", text: "Atmospheric walks, hidden resets, food trails, peaceful breaks." }
            ].map((item) => (
              <div key={item.title} className="glass rounded-[2rem] p-6">
                <item.icon className="mb-5 text-ember" />
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-sm leading-6 text-white/58">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
