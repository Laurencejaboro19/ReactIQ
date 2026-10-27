import { Link } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";

export const comparison: [string, string, string][] = [
  ["2D mode", "Yes, uses credits", "Yes, with more credits"],
  ["AI chat mode", "Yes, uses credits", "Yes, with more credits"],
  ["3D mode", "Not available", "Included"],
  ["Reaction library", "Some mechanisms locked", "Full access"],
  ["AI model quality", "Standard", "Smarter model"],
  ["Voiceover on 2D mechanisms", "Not available", "Included"],
];

export function PricingCards() {
  const scrollToWaitlist = () => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Reveal className="rounded-2xl border bg-surface p-6">
        <h3 className="text-lg font-semibold">Free</h3>
        <p className="mt-3 font-display text-5xl font-bold">₦0</p>
        <p className="mt-2 text-sm text-muted-foreground">2D walkthroughs and AI chat on a monthly credit allowance.</p>
        <Button asChild variant="secondary" className="mt-6 w-full">
          <Link to="/reactions">Start learning</Link>
        </Button>
      </Reveal>
      <Reveal delay={0.1} className="relative overflow-hidden rounded-2xl border border-primary/60 bg-surface p-6 shadow-glow">
        <div className="glow-orb absolute -right-16 -top-16 h-56 w-56" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Pro</h3>
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Most popular</span>
          </div>
          <p className="mt-3 font-display text-5xl font-bold text-primary">Coming soon</p>
          <p className="mt-2 text-sm text-muted-foreground">3D mode, voiceovers, a smarter tutor and the full library — with more credits.</p>
          <Button className="mt-6 w-full" onClick={scrollToWaitlist} asChild>
            <Link to="/" hash="waitlist">Join the waitlist</Link>
          </Button>
        </div>
      </Reveal>
    </div>
  );
}

function Cell({ v }: { v: string }) {
  const no = v === "Not available";
  return (
    <td className="px-4 py-3 text-sm">
      <span className={no ? "inline-flex items-center gap-1.5 text-muted-foreground" : "inline-flex items-center gap-1.5"}>
        {no ? <Minus className="h-4 w-4" aria-hidden /> : <Check className="h-4 w-4 text-primary" aria-hidden />}
        {v}
      </span>
    </td>
  );
}

export function ComparisonTable() {
  return (
    <Reveal className="mt-8 overflow-x-auto rounded-2xl border bg-surface">
      <table className="w-full min-w-[520px] text-left">
        <caption className="sr-only">Free vs Pro comparison</caption>
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-sm font-semibold">Feature</th>
            <th className="px-4 py-3 text-sm font-semibold">Free</th>
            <th className="px-4 py-3 text-sm font-semibold text-primary">Pro</th>
          </tr>
        </thead>
        <tbody>
          {comparison.map(([f, free, pro]) => (
            <tr key={f} className="border-b last:border-0">
              <th scope="row" className="px-4 py-3 text-sm font-medium">{f}</th>
              <Cell v={free} />
              <Cell v={pro} />
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t px-4 py-3 text-xs text-muted-foreground">Usage is credits-based: each 2D walkthrough and AI chat message uses credits.</p>
    </Reveal>
  );
}
