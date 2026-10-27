import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { categories, reactions, type Category } from "@/data/reactions";
import { ReactionCard } from "@/components/ReactionCard";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reactions/")({
  head: () => ({
    meta: [
      { title: "Reactions library — ReactIQ" },
      { name: "description", content: "Search and filter 12 organic reaction mechanisms." },
      { property: "og:title", content: "Reactions library — ReactIQ" },
      { property: "og:description", content: "Search and filter 12 organic reaction mechanisms." },
    ],
  }),
  component: ReactionsPage,
});

function ReactionsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | null>(null);
  const list = reactions.filter(
    (r) => (!cat || r.category === cat) && (r.name + r.short).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-bold">Reactions</h1>
      <div className="relative mt-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search reactions" className="pl-9" aria-label="Search reactions" />
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by category">
        {[null, ...categories].map((c) => (
          <button
            key={c ?? "all"}
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors",
              cat === c ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {c ?? "All"}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => <ReactionCard key={r.slug} r={r} />)}
      </div>
      {list.length === 0 && <p className="mt-10 text-center text-muted-foreground">No reactions match.</p>}
    </section>
  );
}
