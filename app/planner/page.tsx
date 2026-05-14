import PlannerClient from "@/components/PlannerClient";
import SectionHeader from "@/components/SectionHeader";

export default function PlannerPage() {
  return (
    <main className="page-shell px-6 pb-24">
      <section className="mx-auto max-w-7xl pb-10 pt-12">
        <SectionHeader
          eyebrow="Trip planner"
          title="Filter escapes by budget, duration, vibe and transport."
          description="Curated Odisha escapes for late-night drives, rainy café plans, beach resets and spontaneous weekend departures."
        />
        <PlannerClient />
      </section>
    </main>
  );
}
