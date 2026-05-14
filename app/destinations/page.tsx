import DestinationCard from "@/components/DestinationCard";
import SectionHeader from "@/components/SectionHeader";
import { MotionDiv, MotionSection, stagger } from "@/components/Motion";
import { destinations } from "@/data/destinations";
import { categories } from "@/data/categories";
import Link from "next/link";
import { X } from "lucide-react";
import DestinationComments from "@/components/DestinationComments";

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;

  const selectedCategory = categories.find((c) => c.slug === categorySlug);

  const filteredDestinations = selectedCategory
    ? destinations.filter((d) => d.category === selectedCategory.title)
    : destinations;

  return (
    <main className="page-shell px-6 pb-24">
      <MotionSection initial="hidden" animate="show" variants={stagger} className="mx-auto max-w-7xl">
        <div className="pb-12 pt-12">
          <SectionHeader
            eyebrow="Atlas Core"
            title="Exploration Hub"
            description="Browse atmospheric journeys across Bhubaneswar, Odisha's hidden outskirts, and timeless coastal escapes."
          />
        </div>

        {selectedCategory && (
          <div className="mb-10 flex items-center">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-1.5 pl-4 pr-2 text-sm font-medium text-white shadow-glass">
              <span className="text-white/40 font-normal">Filtering:</span>
              <span className="text-ember">{selectedCategory.title}</span>
              <Link
                href="/destinations"
                className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-ember/20 hover:text-ember"
                title="Reset filters"
              >
                <X size={14} />
              </Link>
            </div>
          </div>
        )}

        <MotionDiv variants={stagger} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDestinations.map((destination, index) => (
            <DestinationCard key={destination.slug} destination={destination} index={index} />
          ))}
        </MotionDiv>

        {filteredDestinations.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-white/40">No destinations found in this category yet.</p>
            <Link href="/destinations" className="mt-4 inline-block text-ember hover:underline">
              View all destinations
            </Link>
          </div>
        )}
      </MotionSection>
    </main>
  );
}
