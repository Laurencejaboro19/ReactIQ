import { ClientOnly, createFileRoute, Link, notFound } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { AlertTriangle, ArrowLeft, BookOpen, FlaskConical, GraduationCap, Lightbulb, Stethoscope } from "lucide-react";
import { getReaction } from "@/data/reactions";
import { getNotes } from "@/data/notes";
import { Reveal } from "@/components/site/Reveal";
import { MechanismPlayer2D } from "@/components/mechanisms/MechanismPlayer2D";
import { TutorChat } from "@/components/mechanisms/TutorChat";
import { cn } from "@/lib/utils";

const Molecule3D = lazy(() => import("@/components/mechanisms/Molecule3D"));

export const Route = createFileRoute("/reactions/$slug")({
  loader: ({ params }) => {
    const r = getReaction(params.slug);
    if (!r) throw notFound();
    return { slug: r.slug, name: r.name, summary: r.summary };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} mechanism — ReactIQ` : "Unavailable — ReactIQ" },
      { name: "description", content: loaderData?.summary ?? "" },
      { property: "og:title", content: loaderData ? `${loaderData.name} mechanism — ReactIQ` : "ReactIQ" },
      { property: "og:description", content: loaderData?.summary ?? "" },
    ],
  }),
  component: Detail,
});

type ModeT = "2D" | "3D" | "AI chat";

const LoadingStage = ({ label }: { label: string }) => (
  <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-stage text-sm text-stage-foreground sm:aspect-video" role="status">
    <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
    {label}
  </div>
);

function Detail() {
  const { slug } = Route.useLoaderData();
  const r = getReaction(slug)!;
  const notes = getNotes(slug);
  const [mode, setMode] = useState<ModeT>("2D");

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/reactions" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Reactions
      </Link>
      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">{r.category}</p>
      <h1 className="mt-1 text-4xl font-bold">{r.name}</h1>
      <p className="mt-2 text-muted-foreground">{r.summary}</p>

      <div role="tablist" aria-label="Mode" className="mt-6 inline-flex rounded-full border bg-surface p-1">
        {(["2D", "3D", "AI chat"] as ModeT[]).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={cn("rounded-full px-5 py-1.5 text-sm font-medium transition-colors", mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {mode === "2D" && <MechanismPlayer2D key={r.slug} scene={r.scene} steps={r.steps} title={r.name} />}
        {mode === "3D" && (
          <div className="relative rounded-3xl border bg-surface p-3">
            <ClientOnly fallback={<LoadingStage label="Preparing the 3D viewer…" />}>
              <Suspense fallback={<LoadingStage label="Loading the 3D viewer (about 1 MB on first visit)…" />}>
                <Molecule3D scene={r.scene3d} />
              </Suspense>
            </ClientOnly>
            <div className="mt-4 rounded-2xl border bg-surface-2 p-4">
              <h3 className="font-semibold">Why 3D matters here</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.why3d}</p>
            </div>
          </div>
        )}
        {mode === "AI chat" && <TutorChat key={r.slug} reaction={r} />}
      </div>

      {notes && (
        <div className="mt-12 space-y-10">
          <Reveal>
            <h2 className="flex items-center gap-2 text-2xl font-bold"><BookOpen className="h-5 w-5 text-primary" /> Understanding the {r.name}</h2>
            <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
              {notes.overview.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </Reveal>

          <Reveal>
            <h2 className="flex items-center gap-2 text-2xl font-bold"><FlaskConical className="h-5 w-5 text-primary" /> Conditions at a glance</h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {notes.conditions.map((c) => (
                <div key={c.label} className="rounded-2xl border bg-surface p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-primary">{c.label}</dt>
                  <dd className="mt-1 text-sm text-foreground">{c.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal>
            <h2 className="flex items-center gap-2 text-2xl font-bold"><Stethoscope className="h-5 w-5 text-primary" /> Why it matters for your course</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {notes.relevance.map((x) => (
                <div key={x.course} className="rounded-2xl border bg-surface p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{x.course}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{x.text}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            <Reveal className="rounded-2xl border bg-surface p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold"><GraduationCap className="h-5 w-5 text-primary" /> Exam tips</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                {notes.examTips.map((t) => <li key={t} className="flex gap-2"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{t}</li>)}
              </ul>
            </Reveal>
            <Reveal delay={0.08} className="rounded-2xl border bg-surface p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold"><AlertTriangle className="h-5 w-5 text-primary" /> Common mistakes</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                {notes.mistakes.map((t) => <li key={t} className="flex gap-2"><span className="mt-[2px] shrink-0 text-primary">✗</span>{t}</li>)}
              </ul>
            </Reveal>
          </div>

          <Reveal>
            <h2 className="flex items-center gap-2 text-2xl font-bold"><Lightbulb className="h-5 w-5 text-primary" /> Key terms</h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-3">
              {notes.keyTerms.map((t) => (
                <div key={t.term} className="rounded-2xl border bg-surface-2 p-4">
                  <dt className="font-semibold">{t.term}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{t.def}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal className="rounded-2xl border border-primary/40 bg-surface p-5 text-sm text-muted-foreground">
            Still unsure about something? Switch to <button onClick={() => { setMode("AI chat"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="font-semibold text-primary underline-offset-2 hover:underline">AI chat</button> and ask the tutor — it knows these notes.
          </Reveal>
        </div>
      )}
    </section>
  );
}
