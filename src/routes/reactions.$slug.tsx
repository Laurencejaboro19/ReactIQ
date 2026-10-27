import { ClientOnly, createFileRoute, Link, notFound } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getReaction } from "@/data/reactions";
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

function Detail() {
  const { slug } = Route.useLoaderData();
  const r = getReaction(slug)!;
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
            <ClientOnly fallback={<div className="aspect-video rounded-2xl bg-stage" />}>
              <Suspense fallback={<div className="aspect-video rounded-2xl bg-stage" />}>
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
    </section>
  );
}
