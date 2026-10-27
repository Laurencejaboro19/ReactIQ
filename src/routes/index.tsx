import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { BookOpen, Box, Clock, MessageCircle, Monitor, Shapes } from "lucide-react";
import { getReaction, reactions } from "@/data/reactions";
import { MechanismPlayer2D } from "@/components/mechanisms/MechanismPlayer2D";
import { ReactionCard } from "@/components/ReactionCard";
import { ComparisonTable, PricingCards } from "@/components/Pricing";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReactIQ — Reaction mechanism, simplified." },
      { name: "description", content: "Watch electrons move, bonds break and form — step by step in 2D, 3D and with an AI tutor." },
      { property: "og:title", content: "ReactIQ — Reaction mechanism, simplified." },
      { property: "og:description", content: "Understand reaction mechanisms in 2D, 3D and with an AI tutor." },
    ],
  }),
  component: Index,
});

const sn2 = getReaction("sn2")!;

function Index() {
  const [email, setEmail] = useState("");
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="glow-orb absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <Reveal>
            <span className="inline-block rounded-full border bg-surface px-3 py-1 text-xs text-muted-foreground">
              For Chemistry · Pharmacy · Pharmacology · Biochemistry students
            </span>
            <h1 className="mt-5 text-5xl font-bold leading-[1.02] sm:text-6xl">
              Reaction mechanism, <span className="text-primary">simplified.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Stop memorising arrows. Watch electrons move, bonds break and bonds form — step by step, in 2D, 3D and with an AI tutor.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-glow">
                <Link to="/reactions/$slug" params={{ slug: "sn2" }}>Try the demo</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/reactions">See reactions</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="mx-auto w-full max-w-[320px]">
            <div className="rounded-[2.5rem] border-[6px] border-surface-2 bg-surface p-3 shadow-glow">
              <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-muted" />
              <p className="px-1 pb-2 text-xs font-semibold">SN2 · CH₃Br + OH⁻</p>
              <MechanismPlayer2D scene={sn2.scene} steps={sn2.steps} compact title="SN2" className="[&>div]:aspect-[4/5]" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="The problem" title="Students memorise instead of understand" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [BookOpen, "Static textbook diagrams", "Arrows frozen on a page never show what moves first."],
            [Clock, "Rushed lectures", "A mechanism gets ninety seconds on a slide, then it's gone."],
            [Monitor, "Flat tools", "Existing apps draw structures but never explain why."],
          ].map(([Icon, t, d], i) => {
            const I = Icon as typeof BookOpen;
            return (
              <Reveal key={t as string} delay={i * 0.08} className="rounded-2xl border bg-surface p-6 transition-transform hover:-translate-y-1">
                <I className="h-6 w-6 text-primary" aria-hidden />
                <h3 className="mt-4 font-semibold">{t as string}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d as string}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <SectionHeading eyebrow="How it works" title="Three ways to learn every mechanism" />
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal className="rounded-2xl border bg-surface p-5">
            <MechanismPlayer2D scene={sn2.scene} steps={sn2.steps} compact />
            <h3 className="mt-4 flex items-center gap-2 font-semibold"><Shapes className="h-4 w-4 text-primary" /> 2D mode</h3>
            <p className="mt-1 text-sm text-muted-foreground">Animated walkthrough with standard skeletal structures, one step at a time.</p>
          </Reveal>
          <Reveal delay={0.08} className="rounded-2xl border bg-surface p-5">
            <svg viewBox="0 0 200 120" className="w-full rounded-2xl bg-stage" role="img" aria-label="Ball and stick preview">
              <line x1="60" y1="60" x2="140" y2="60" stroke="#b8bcc2" strokeWidth="6" />
              <line x1="100" y1="60" x2="90" y2="25" stroke="#b8bcc2" strokeWidth="6" />
              <line x1="100" y1="60" x2="85" y2="95" stroke="#b8bcc2" strokeWidth="6" />
              <circle cx="60" cy="60" r="14" fill="#e0352b" /><circle cx="100" cy="60" r="15" fill="#6f8296" />
              <circle cx="145" cy="60" r="18" fill="#a5502a" /><circle cx="90" cy="25" r="10" fill="#fff" /><circle cx="85" cy="95" r="10" fill="#fff" />
            </svg>
            <h3 className="mt-4 flex items-center gap-2 font-semibold"><Box className="h-4 w-4 text-primary" /> 3D mode <span className="rounded-full bg-primary/15 px-2 text-[11px] text-primary">Pro</span></h3>
            <p className="mt-1 text-sm text-muted-foreground">Stereochemistry, chiral centres and optical activity — like SN2 backside attack and Walden inversion.</p>
          </Reveal>
          <Reveal delay={0.16} className="rounded-2xl border bg-surface p-5">
            <div className="space-y-2 rounded-2xl bg-surface-2 p-3 text-xs">
              <p className="ml-auto w-fit rounded-2xl rounded-br-md bg-primary px-3 py-2 text-primary-foreground">Why does SN2 invert?</p>
              <p className="w-fit rounded-2xl rounded-bl-md border bg-surface px-3 py-2">The nucleophile attacks from the back, so the groups flip like an umbrella.</p>
            </div>
            <h3 className="mt-4 flex items-center gap-2 font-semibold"><MessageCircle className="h-4 w-4 text-primary" /> AI chat mode</h3>
            <p className="mt-1 text-sm text-muted-foreground">A text tutor for quick questions and clarifications.</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="Reactions library" title="From SN1 to Friedel–Crafts" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reactions.map((r) => <ReactionCard key={r.slug} r={r} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="Pricing" title="Free to start. Pro when you're ready." />
        <PricingCards />
        <ComparisonTable />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="Roadmap" title="Built by students, for students" />
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Now", ["Landing page", "Reactions tab", "2D, 3D and AI chat end-to-end", "Credits + Free/Pro split"]],
            ["Later", ["Ask questions during the voiceover", "Wider course-specific coverage"]],
          ].map(([t, items]) => (
            <Reveal key={t as string} className="rounded-2xl border bg-surface p-6">
              <h3 className="font-semibold text-primary">{t as string}</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {(items as string[]).map((i) => <li key={i}>• {i}</li>)}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="waitlist" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <Reveal className="relative overflow-hidden rounded-3xl border bg-surface p-8 text-center sm:p-12">
          <div className="glow-orb absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2" />
          <h2 className="relative text-3xl font-bold">Get Pro first.</h2>
          <p className="relative mt-2 text-muted-foreground">Join the waitlist for 3D mode and voiceovers.</p>
          <form
            className="relative mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^\S+@\S+\.\S+$/.test(email)) {
                toast.error("Please enter a valid email");
                return;
              }
              toast.success("You're on the waitlist!");
              setEmail("");
            }}
          >
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" aria-label="Email" required />
            <Button type="submit">Join the waitlist</Button>
          </form>
        </Reveal>
      </section>
    </>
  );
}
