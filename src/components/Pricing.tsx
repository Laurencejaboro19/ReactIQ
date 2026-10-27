import { Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";

export const included: [string, string][] = [
  ["2D mode", "Every mechanism, step by step, unlimited"],
  ["3D mode", "Interactive ball-and-stick animations for every reaction"],
  ["AI chat mode", "Ask the tutor as many questions as you like"],
  ["Reaction library", "Full access — nothing locked"],
  ["Stereochemistry views", "Rotate, zoom and step through transition states"],
  ["Voiceover on 2D mechanisms", "Coming soon — free when it lands"],
];

export function PricingCards() {
  return (
    <Reveal className="relative overflow-hidden rounded-3xl border border-primary/50 bg-surface p-8 shadow-glow sm:p-10">
      <div className="glow-orb absolute -right-20 -top-20 h-72 w-72" />
      <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> Free for every student
          </span>
          <p className="mt-4 font-display text-6xl font-bold">₦0</p>
          <p className="mt-2 max-w-md text-muted-foreground">
            2D, 3D and the AI tutor — all of it, for every reaction, with no credits, no locks and no upgrade button. We're students too.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
          <Button asChild size="lg">
            <Link to="/reactions">Start learning</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/reactions/$slug" params={{ slug: "sn2" }}>Try the SN2 demo</Link>
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

export function ComparisonTable() {
  return (
    <Reveal className="mt-8 overflow-hidden rounded-2xl border bg-surface">
      <table className="w-full text-left">
        <caption className="sr-only">What's included in ReactIQ</caption>
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-sm font-semibold">Feature</th>
            <th className="px-4 py-3 text-sm font-semibold text-primary">Included</th>
          </tr>
        </thead>
        <tbody>
          {included.map(([f, v]) => (
            <tr key={f} className="border-b last:border-0">
              <th scope="row" className="px-4 py-3 text-sm font-medium">{f}</th>
              <td className="px-4 py-3 text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {v}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t px-4 py-3 text-xs text-muted-foreground">No account needed. Open a reaction and start.</p>
    </Reveal>
  );
}
