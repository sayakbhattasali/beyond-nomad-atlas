import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-12">
      <div className="mx-auto w-full min-w-0 grid max-w-7xl gap-8 md:grid-cols-[1.2fr_.8fr_.8fr]">
        <div className="min-w-0">
          <div className="mb-4 flex items-center gap-3">
            <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20">
              <Image
                src="/logo.png"
                alt="Beyond Nomad Atlas Logo"
                fill
                sizes="40px"
                className="object-cover scale-[1.4]"
              />
            </span>
            <div className="min-w-0">
              <p className="font-bold tracking-[.15em] sm:tracking-[.25em] uppercase text-white truncate">BEYOND NOMAD <span className="text-[0.85em] text-ember">Atlas</span></p>
               <p className="text-sm text-white/48 truncate">Uncovering Odisha's Hidden Gems.</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/55 break-words">
            A curated cinematic discovery platform for modern explorers and weekend nomads — built for quick escapes,
            atmospheric journeys, and timeless weekend memories.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">Explore</p>
          <div className="grid gap-2 text-sm text-white/55">
            <Link href="/destinations">Destinations</Link>
            <Link href="/planner">Trip Planner</Link>
            <Link href="/about">About</Link>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">System Focus</p>
          <p className="text-sm leading-6 text-white/55">
            Premium UI, immersive atmosphere, responsive navigation, and a curated exploration system built for the modern traveler.
          </p>
        </div>
      </div>
    </footer>
  );
}
