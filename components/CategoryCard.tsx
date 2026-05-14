"use client";

import { MotionArticle } from "@/components/Motion";
import { categories } from "@/data/categories";
import {
  ArrowUpRight,
  Coffee,
  Moon,
  Palmtree,
  Train,
  Umbrella,
  Route
} from "lucide-react";
import Link from "next/link";

type Category = (typeof categories)[number];

const iconMap = {
  moon: Moon,
  coffee: Coffee,
  palmtree: Palmtree,
  train: Train,
  umbrella: Umbrella,
  route: Route
};

export default function CategoryCard({
  category,
  index
}: {
  category: Category;
  index: number;
}) {
  const Icon = iconMap[category.icon as keyof typeof iconMap];

  return (
    <MotionArticle
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: { delay: index * 0.03, duration: 0.55 }
        }
      }}
      whileHover={{ y: -8 }}
      className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${category.gradient} shadow-glass`}
    >
      <Link
        href={`/destinations?category=${category.slug}`}
        className="block p-6 h-full"
      >
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-ember/10 blur-3xl transition group-hover:bg-ember/20" />

        <div className="relative z-10 flex min-h-56 flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-amberSoft ring-1 ring-white/10">
              <Icon size={22} />
            </span>

            <ArrowUpRight className="text-white/35 transition group-hover:text-ember" />
          </div>

          <div>
            <h3 className="mb-3 text-2xl font-semibold text-white">
              {category.title}
            </h3>

            <p className="text-sm leading-6 text-white/62">
              {category.description}
            </p>
          </div>

          <div className="mt-6 text-sm font-semibold text-ember">
            Explore route
          </div>
        </div>
      </Link>
    </MotionArticle>
  );
}