import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, IndianRupee, MapPin, Navigation, Sparkles, Utensils } from "lucide-react";
import { destinations, getDestination } from "@/data/destinations";
import DestinationComments from "@/components/DestinationComments";
import SaveDestinationButton from "@/components/SaveDestinationButton";
import VisitDestinationButton from "@/components/VisitDestinationButton";
import MemoryButton from "@/components/MemoryButton";
import PosterButton from "@/components/poster/PosterButton";
import CinemaEntrance from "@/components/CinemaEntrance";

export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DestinationDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const destination = getDestination(slug);

  if (!destination) notFound();

  return (
    <main style={{ '--glow-color': 'transparent' } as React.CSSProperties}>
      <section className="relative min-h-[78vh] overflow-hidden px-6 pb-16 pt-32">
        <Image src={destination.image} alt={destination.name} fill className="object-cover opacity-35" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-ink/75 to-ink" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <CinemaEntrance>
            <Link href="/destinations" className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/70 backdrop-blur-xl hover:bg-white/10">
              <ArrowLeft size={16} /> Back to destinations
            </Link>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[.38em] text-ember">{destination.category}</p>
            <h1 className="max-w-full break-words text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-7xl">{destination.name}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/68">{destination.overview}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <SaveDestinationButton destinationSlug={destination.slug} />
              <VisitDestinationButton destinationSlug={destination.slug} />
              <MemoryButton destinationSlug={destination.slug} destinationName={destination.name} />
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <Info icon={MapPin} label="Distance" value={destination.distance} />
              <Info icon={IndianRupee} label="Budget Per Person" value={destination.budgetLabel} />
              <Info icon={Clock} label="Duration" value={destination.duration} />
            </div>
          </CinemaEntrance>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto flex flex-col gap-8 lg:grid lg:max-w-7xl lg:grid-cols-[.8fr_1.2fr]">
          {/* Save Memory - Mobile Order 1, Desktop Right Col Row 1 */}
          <div className="order-1 lg:col-start-2 lg:row-start-1">
            <PosterButton destination={destination} />
          </div>

          {/* Sidebar - Mobile Order 2, Desktop Left Col */}
          <aside className="glass h-fit order-2 rounded-[2rem] p-6 lg:sticky lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:top-28">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.32em] text-ember">Best time</p>
            <p className="text-xl font-semibold">{destination.bestTime}</p>

            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold text-white">Ideal for</p>
              <div className="flex flex-wrap gap-2">
                {destination.idealFor.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/62">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold text-white">Transport options</p>
              <div className="flex flex-wrap gap-2">
                {destination.transport.map((item) => (
                  <span key={item} className="rounded-full bg-ember/15 px-3 py-1 text-xs capitalize text-amberSoft">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content - Mobile Order 3, Desktop Right Col Row 2 */}
          <div className="order-3 space-y-8 lg:col-start-2 lg:row-start-2">
            <Panel icon={Navigation} title="Suggested Itinerary">
              <div className="space-y-4">
                {destination.itinerary.map((step, index) => (
                  <div key={step} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[.035] p-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ember/15 text-sm font-semibold text-ember">{index + 1}</span>
                    <p className="text-white/68">{step}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel icon={Sparkles} title="Hidden tips">
              <ul className="grid gap-3 text-white/68">
                {destination.hiddenTips.map((tip) => <li key={tip}>• {tip}</li>)}
              </ul>
            </Panel>

            <Panel icon={Utensils} title="Nearby food ideas">
              <div className="grid gap-3 sm:grid-cols-2">
                {destination.foodSpots.map((spot) => (
                  <div key={spot} className="rounded-2xl border border-white/10 bg-white/[.035] p-4 text-white/68">
                    {spot}
                  </div>
                ))}
              </div>
            </Panel>
            <DestinationComments destinationSlug={destination.slug} />
          </div>
        </div>
      </section>
    </main>
  );
}

function Info({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="glass rounded-3xl p-5">
      <Icon className="mb-4 text-ember" />
      <p className="text-xs uppercase tracking-[.26em] text-white/42">{label}</p>
      <p className="mt-2 font-semibold text-white">{value}</p>
    </div>
  );
}

function Panel({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-[2rem] p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ember/15 text-ember">
          <Icon size={20} />
        </span>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}
