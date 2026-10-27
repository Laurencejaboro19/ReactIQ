import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Atom, BookOpen, Box, Clock, Dna, FlaskConical, MessageCircle, Monitor, Pill, RotateCcw, Shapes, Stethoscope } from "lucide-react";
import { getReaction, reactions } from "@/data/reactions";
import { MechanismPlayer2D } from "@/components/mechanisms/MechanismPlayer2D";
import { ReactionCard } from "@/components/ReactionCard";
import { ComparisonTable, PricingCards } from "@/components/Pricing";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReactIQ — Reaction mechanism, simplified." },
      { name: "description", content: "Watch electrons move, bonds break and form — step by step in 2D, 3D and with an AI tutor. Free for chemistry, pharmacy, pharmacology and biochemistry students." },
      { property: "og:title", content: "ReactIQ — Reaction mechanism, simplified." },
      { property: "og:description", content: "Understand reaction mechanisms in 2D, 3D and with an AI tutor. Free for every student." },
    ],
  }),
  component: Index,
});

const sn2 = getReaction("sn2")!;

const problems = [
  {
    icon: BookOpen,
    title: "Static textbook diagrams",
    text: "A mechanism on paper is a finished picture: every arrow drawn at once, every bond already decided. It never shows you what moves first, what waits, or how a flat drawing of a tetrahedral carbon actually sits in space. So students copy the arrows and hope the pattern sticks.",
  },
  {
    icon: Clock,
    title: "Rushed lectures",
    text: "A mechanism gets ninety seconds on a slide, then the lecturer moves on. There is no pause button, no second angle, no chance to ask why the nucleophile attacks from the back. By the time you re-read your notes the logic has evaporated and only the shapes remain.",
  },
  {
    icon: Monitor,
    title: "Flat tools",
    text: "Existing apps draw structures beautifully but stop there, or they answer in paragraphs of text with no picture at all. Neither connects the arrow you push to the electrons that move — and that connection is the whole point of a mechanism.",
  },
];

const modes = [
  {
    icon: Shapes,
    title: "2D mode",
    text: "An animated walkthrough using the same skeletal structures you see in textbooks and exams. Curly arrows draw themselves, bonds break and form, intermediates appear — one step at a time, with a plain-English explanation beneath each step. Scrub back and forth, loop a step until it clicks, and check every charge and lone pair.",
    tags: ["Curly arrows", "Step scrubber", "Explanation per step"],
  },
  {
    icon: Box,
    title: "3D mode",
    text: "The same reaction as rotatable ball-and-stick molecules, playing repeatedly backwards and forwards. Built for the topics where space matters: watch the SN2 umbrella flip through its trigonal bipyramidal transition state, line up the anti-periplanar hydrogen in E2, or see benzene lose and regain planarity in Friedel–Crafts.",
    tags: ["Rotate & zoom", "Frame stepping", "Ball & stick / sticks / spacefill"],
  },
  {
    icon: MessageCircle,
    title: "AI chat mode",
    text: "A text tutor for quick questions and clarifications. It knows every step, the reagents and conditions, the stereochemistry, the common exam mistakes and why each reaction matters in pharmacy, pharmacology and biochemistry — and it answers in the time it takes to tap.",
    tags: ["Step-by-step", "Exam tips", "Course relevance"],
  },
];

const courses = [
  {
    icon: Atom,
    title: "Chemistry",
    text: "Mechanisms are the grammar of organic chemistry. ReactIQ covers the substitution, elimination, carbonyl, pericyclic and aromatic reactions that anchor a first- and second-year course, with the stereochemistry made visible.",
  },
  {
    icon: Pill,
    title: "Pharmacy",
    text: "Every ester prodrug, every alkylating anticancer drug and every synthesis in your medicinal chemistry module is one of these mechanisms. Each reaction page says exactly where it shows up in drugs and formulation.",
  },
  {
    icon: Stethoscope,
    title: "Pharmacology",
    text: "Why does a nitrogen mustard crosslink DNA? Why do prostaglandin analogues need a precise alkene geometry? Mechanisms explain drug action and toxicity, and the tutor connects the dots.",
  },
  {
    icon: Dna,
    title: "Biochemistry & medical biochemistry",
    text: "Aldolase is a retro-aldol. Fatty-acid synthesis is a Claisen. Methyltransferases do SN2. Seeing the organic mechanism first makes the enzyme mechanism obvious instead of mysterious.",
  },
];

const faqs = [
  {
    q: "Is ReactIQ really free?",
    a: "Yes. 2D mode, 3D mode, the AI tutor and all twelve reactions are free for everyone, with no account, credits or locked content. We are students building this for students.",
  },
  {
    q: "Which reactions are covered?",
    a: "SN1, SN2, E1, E2, aldol condensation, Grignard reaction, ozonolysis, Diels–Alder, Fischer esterification, Claisen condensation, Wittig reaction and Friedel–Crafts acylation — each with a 2D walkthrough, a 3D animation, study notes and tutor knowledge. Wider course-specific coverage is on the roadmap.",
  },
  {
    q: "Does it work on my phone?",
    a: "ReactIQ is designed mobile-first. 2D mode and the tutor work on any modern browser. 3D mode uses WebGL, which every current phone browser supports; if you open the link inside another app's built-in browser (for example WhatsApp or Instagram) and the 3D view stays blank, open the page in Chrome or Safari instead.",
  },
  {
    q: "Is the AI tutor accurate?",
    a: "The tutor answers from a curated knowledge base written and checked for each reaction — steps, conditions, stereochemistry, exam pitfalls and clinical relevance — rather than from an open-ended language model, so it does not invent chemistry. If it doesn't know something it says so and points you to the 2D or 3D view.",
  },
  {
    q: "Can I use it for revision the night before an exam?",
    a: "That is exactly what the Exam tips and Common mistakes sections on every reaction page are for. Watch the 2D animation once, rebuild the mechanism from memory on paper, then check the stereochemistry in 3D.",
  },
  {
    q: "Where is the voiceover?",
    a: "Voiceover for 2D mechanisms is the next feature on our list, followed by the ability to ask questions during the voiceover. Join the list below and we'll tell you when it lands — it will be free too.",
  },
];

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
            <p className="mt-3 text-sm text-muted-foreground">
              Twelve core mechanisms from SN2 to Friedel–Crafts, each with an animated 2D walkthrough, a rotatable 3D animation, study notes written for your course and a tutor that answers in seconds. Free, no account needed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-glow">
                <Link to="/reactions/$slug" params={{ slug: "sn2" }}>Try the demo</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/reactions">See reactions</Link>
              </Button>
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-3 text-center sm:max-w-md">
              {[
                ["12", "reactions"],
                ["2D + 3D", "every mechanism"],
                ["₦0", "forever"],
              ].map(([n, l]) => (
                <div key={l} className="rounded-2xl border bg-surface px-3 py-3">
                  <dt className="font-display text-xl font-bold text-primary">{n}</dt>
                  <dd className="text-[11px] text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
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
        <SectionHeading
          eyebrow="The problem"
          title="Students memorise instead of understand"
          sub="Reaction mechanisms are one of the hardest parts of chemistry and the life sciences — not because the ideas are hard, but because of how they are taught."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {problems.map(({ icon: I, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08} className="rounded-2xl border bg-surface p-6 transition-transform hover:-translate-y-1">
              <I className="h-6 w-6 text-primary" aria-hidden />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-8 max-w-3xl text-center text-muted-foreground">
          <p>
            The result is predictable: students memorise a pattern of arrows for the exam and forget it a week later, then meet the same chemistry again in drug action, enzyme catalysis and synthesis without the foundation to understand it. ReactIQ replaces memorising with watching.
          </p>
        </Reveal>
      </section>

      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <SectionHeading eyebrow="How it works" title="Three ways to learn every mechanism" sub="Pick a reaction, then choose the mode that fits the question in your head." />
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal className="rounded-2xl border bg-surface p-5">
            <MechanismPlayer2D scene={sn2.scene} steps={sn2.steps} compact />
            <h3 className="mt-4 flex items-center gap-2 font-semibold">
              <Shapes className="h-4 w-4 text-primary" /> {modes[0]!.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{modes[0]!.text}</p>
            <Tags tags={modes[0]!.tags} />
          </Reveal>
          <Reveal delay={0.08} className="rounded-2xl border bg-surface p-5">
            <svg viewBox="0 0 200 120" className="w-full rounded-2xl bg-stage" role="img" aria-label="Ball and stick preview">
              <line x1="60" y1="60" x2="140" y2="60" stroke="#b8bcc2" strokeWidth="6" />
              <line x1="100" y1="60" x2="90" y2="25" stroke="#b8bcc2" strokeWidth="6" />
              <line x1="100" y1="60" x2="85" y2="95" stroke="#b8bcc2" strokeWidth="6" />
              <circle cx="60" cy="60" r="14" fill="#e0352b" />
              <circle cx="100" cy="60" r="15" fill="#6f8296" />
              <circle cx="145" cy="60" r="18" fill="#a5502a" />
              <circle cx="90" cy="25" r="10" fill="#fff" />
              <circle cx="85" cy="95" r="10" fill="#fff" />
            </svg>
            <h3 className="mt-4 flex items-center gap-2 font-semibold">
              <Box className="h-4 w-4 text-primary" /> {modes[1]!.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{modes[1]!.text}</p>
            <Tags tags={modes[1]!.tags} />
          </Reveal>
          <Reveal delay={0.16} className="rounded-2xl border bg-surface p-5">
            <div className="space-y-2 rounded-2xl bg-surface-2 p-3 text-xs">
              <p className="ml-auto w-fit rounded-2xl rounded-br-md bg-primary px-3 py-2 text-primary-foreground">Why does SN2 invert?</p>
              <p className="w-fit rounded-2xl rounded-bl-md border bg-surface px-3 py-2">The nucleophile attacks the σ* orbital from the back, so the three groups flip like an umbrella — Walden inversion.</p>
              <p className="ml-auto w-fit rounded-2xl rounded-br-md bg-primary px-3 py-2 text-primary-foreground">Why does it matter for pharmacy?</p>
              <p className="w-fit rounded-2xl rounded-bl-md border bg-surface px-3 py-2">Alkylating anticancer drugs attack DNA by exactly this mechanism…</p>
            </div>
            <h3 className="mt-4 flex items-center gap-2 font-semibold">
              <MessageCircle className="h-4 w-4 text-primary" /> {modes[2]!.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{modes[2]!.text}</p>
            <Tags tags={modes[2]!.tags} />
          </Reveal>
        </div>

        <Reveal className="mt-10 rounded-3xl border bg-surface p-6 sm:p-8">
          <h3 className="text-xl font-bold">A lesson in four minutes</h3>
          <ol className="mt-5 grid gap-5 sm:grid-cols-4">
            {[
              [FlaskConical, "Pick a reaction", "Open the Reactions tab and tap one — say SN2. You'll see what it is, which category it belongs to and how many steps it takes."],
              [Shapes, "Watch it in 2D", "Press play. Each curly arrow draws itself, the step is explained underneath, and you can scrub back until the logic is obvious."],
              [RotateCcw, "Rotate it in 3D", "Switch to 3D and drag the molecule. Step frame by frame through the transition state and see the geometry a page can't show."],
              [MessageCircle, "Ask the tutor", "Anything still fuzzy? Ask in plain English — 'why anti-periplanar?', 'what are the conditions?', 'what do examiners want?'."],
            ].map(([Icon, t, d], i) => {
              const I = Icon as typeof FlaskConical;
              return (
                <li key={t as string} className="relative">
                  <span className="absolute -left-1 -top-2 font-display text-4xl font-bold text-primary/15">{i + 1}</span>
                  <I className="relative h-5 w-5 text-primary" aria-hidden />
                  <p className="relative mt-3 font-semibold">{t as string}</p>
                  <p className="relative mt-1 text-sm leading-relaxed text-muted-foreground">{d as string}</p>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="Who it's for" title="Made for your course" sub="Drug action, enzyme behaviour and synthesis all depend on mechanisms — so every reaction page tells you where it shows up in yours." />
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map(({ icon: I, title, text }, i) => (
            <Reveal key={title} delay={i * 0.06} className="rounded-2xl border bg-surface p-6">
              <I className="h-6 w-6 text-primary" aria-hidden />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="Reactions library" title="From SN1 to Friedel–Crafts" sub="Twelve mechanisms across substitution, elimination, addition, carbonyl, pericyclic and organometallic chemistry. Tap one, then choose how you want to learn it." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reactions.map((r) => (
            <ReactionCard key={r.slug} r={r} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="Pricing" title="Free for every student. All of it." />
        <PricingCards />
        <ComparisonTable />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="FAQ" title="Questions students ask us" />
        <Reveal className="mx-auto max-w-3xl rounded-2xl border bg-surface px-5">
          <Accordion type="single" collapsible>
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`q${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="Roadmap" title="Built by students, for students" sub="We are students, so the first version stays at ground level and focuses on doing a few things well." />
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Now", ["Landing page and reactions tab", "2D, 3D and AI chat working end to end for all 12 reactions", "Study notes: conditions, course relevance, exam tips, common mistakes", "Free for everyone — no credits, no locks"]],
            ["Later", ["Voiceover on 2D mechanisms", "Ask questions during the voiceover", "Wider coverage: more reactions and course-specific packs", "Practice mode: draw the arrows yourself and get checked"]],
          ].map(([t, items]) => (
            <Reveal key={t as string} className="rounded-2xl border bg-surface p-6">
              <h3 className="font-semibold text-primary">{t as string}</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {(items as string[]).map((i) => (
                  <li key={i}>• {i}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="waitlist" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <Reveal className="relative overflow-hidden rounded-3xl border bg-surface p-8 text-center sm:p-12">
          <div className="glow-orb absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2" />
          <h2 className="relative text-3xl font-bold">Stay in the loop.</h2>
          <p className="relative mt-2 text-muted-foreground">Be first to hear about new reactions, voiceovers and course packs.</p>
          <form
            className="relative mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^\S+@\S+\.\S+$/.test(email)) {
                toast.error("Please enter a valid email");
                return;
              }
              toast.success("You're on the list — thanks!");
              setEmail("");
            }}
          >
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" aria-label="Email" required />
            <Button type="submit">Keep me posted</Button>
          </form>
        </Reveal>
      </section>
    </>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <li key={t} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[11px] text-muted-foreground">
          {t}
        </li>
      ))}
    </ul>
  );
}
