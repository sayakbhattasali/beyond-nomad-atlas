"use client";

import Image from "next/image";
import { Destination } from "@/data/destinations";
import { Clock, IndianRupee, MapPin, ArrowUpRight } from "lucide-react";
import { MotionArticle } from "@/components/Motion";
import { useCinemaTransition } from "@/components/CinemaTransitionContext";
import { useRef, useCallback } from "react";

export default function DestinationCard({
  destination,
  index = 0,
}: {
  destination: Destination;
  index?: number;
}) {
  const { triggerTransition } = useCinemaTransition();
  const imageRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        triggerTransition(destination.slug, destination.image, rect);
      }
    },
    [destination.slug, destination.image, triggerTransition]
  );

  return (
    <MotionArticle
      variants={{
        hidden: { opacity: 0, y: 26 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            delay: index * 0.035,
            duration: 0.58,
          },
        },
      }}
      className="card-hover group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] cursor-pointer"
    >
      <a onClick={handleClick} className="block">
        <div ref={imageRef} className="relative h-64 overflow-hidden">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-[0.24em] text-ember truncate">
                {destination.category}
              </p>

              <h3 className="mt-1 line-clamp-2 text-2xl font-semibold leading-tight text-white break-words">
                {destination.name}
              </h3>
            </div>

            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md">
              <ArrowUpRight size={18} />
            </span>
          </div>
        </div>

        <div className="p-5">
          <p className="mb-5 text-sm leading-6 text-white/60">
            {destination.summary}
          </p>

          <div className="grid gap-3 text-sm text-white/62">
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-ember" />
              {destination.distance}
            </span>

            <span className="flex items-center gap-2">
              <IndianRupee size={16} className="text-ember" />
              {destination.budgetLabel}
            </span>

            <span className="flex items-center gap-2">
              <Clock size={16} className="text-ember" />
              {destination.duration}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {destination.vibes.slice(0, 3).map((vibe) => (
              <span
                key={vibe}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs capitalize text-white/58"
              >
                {vibe}
              </span>
            ))}
          </div>
        </div>
      </a>
    </MotionArticle>
  );
}