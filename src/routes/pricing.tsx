import { createFileRoute } from "@tanstack/react-router";
import { ComparisonTable, PricingCards } from "@/components/Pricing";
import { SectionHeading } from "@/components/site/Reveal";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Free for students — ReactIQ" },
      { name: "description", content: "ReactIQ is free for every student: 2D, 3D and AI chat for all reactions." },
      { property: "og:title", content: "Free for students — ReactIQ" },
      { property: "og:description", content: "ReactIQ is free for every student: 2D, 3D and AI chat for all reactions." },
    ],
  }),
  component: () => (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeading eyebrow="Pricing" title="Everything is free." sub="No plans, no credits, no locked mechanisms." />
      <PricingCards />
      <ComparisonTable />
    </section>
  ),
});
