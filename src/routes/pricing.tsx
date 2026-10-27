import { createFileRoute } from "@tanstack/react-router";
import { ComparisonTable, PricingCards } from "@/components/Pricing";
import { SectionHeading } from "@/components/site/Reveal";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — ReactIQ" },
      { name: "description", content: "Compare ReactIQ Free and Pro plans." },
      { property: "og:title", content: "Pricing — ReactIQ" },
      { property: "og:description", content: "Compare ReactIQ Free and Pro plans." },
    ],
  }),
  component: () => (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeading eyebrow="Pricing" title="Free vs Pro" sub="Credits-based usage on every plan." />
      <PricingCards />
      <ComparisonTable />
    </section>
  ),
});
