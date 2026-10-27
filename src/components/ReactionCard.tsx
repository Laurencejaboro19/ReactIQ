import { Link } from "@tanstack/react-router";
import type { Reaction } from "@/data/reactions";

export function ReactionCard({ r }: { r: Reaction }) {
  return (
    <Link
      to="/reactions/$slug"
      params={{ slug: r.slug }}
      className="group relative flex h-full flex-col rounded-2xl border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow focus-visible:outline-2 focus-visible:outline-ring"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-full border px-2.5 py-0.5 text-[11px] text-muted-foreground">{r.category}</span>
        <span className="text-[11px] text-muted-foreground">{r.steps.length} steps</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold group-hover:text-primary">{r.name}</h3>
      <p className="mt-1 flex-1 text-sm text-muted-foreground">{r.short}</p>
      <div className="mt-4 flex items-center gap-1" aria-label={`Difficulty ${r.difficulty} of 3`}>
        {[1, 2, 3].map((d) => (
          <span key={d} className={d <= r.difficulty ? "h-1.5 w-5 rounded-full bg-primary" : "h-1.5 w-5 rounded-full bg-muted"} />
        ))}
      </div>
    </Link>
  );
}
