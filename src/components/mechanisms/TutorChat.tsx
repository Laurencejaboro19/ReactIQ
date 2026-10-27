import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import type { Reaction } from "@/data/reactions";
import { answer } from "@/data/tutor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "tutor"; text: string; followUps?: string[] };

const topics = (name: string): [string, string][] => [
  ["Step by step", `Walk me through the ${name} step by step`],
  ["Conditions", `What are the conditions for the ${name}?`],
  ["Exam tips", `Exam tips for the ${name}`],
  ["Common mistakes", `Common mistakes in the ${name}`],
  ["Why it matters", `Why does the ${name} matter for pharmacy?`],
  ["Key terms", `Key terms for the ${name}`],
];

export function TutorChat({ reaction }: { reaction: Reaction }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "tutor",
      text: `Hi! I'm your ReactIQ tutor. We're looking at the ${reaction.name}: ${reaction.summary}\n\nAsk me about any step, the reagents and conditions, stereochemistry, what examiners look for, or why this reaction matters in pharmacy, pharmacology and biochemistry.`,
      followUps: reaction.suggestions,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [msgs, typing]);

  const ask = (q: string) => {
    const text = q.trim();
    if (!text || typing) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    const reply = answer(reaction, text);
    const delay = Math.min(1600, 500 + reply.text.length * 1.2);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "tutor", text: reply.text, followUps: reply.followUps }]);
      setTyping(false);
    }, delay);
  };

  const last = msgs[msgs.length - 1];
  const chips = !typing && last?.role === "tutor" && last.followUps?.length ? last.followUps : [];

  return (
    <div className="flex h-[640px] flex-col overflow-hidden rounded-2xl border bg-surface">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden /> AI tutor · {reaction.name}
        </div>
        <span className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted-foreground">Free · unlimited questions</span>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b px-4 py-2" aria-label="Quick topics">
        {topics(reaction.name).map(([label, q]) => (
          <button
            key={label}
            onClick={() => ask(q)}
            className="shrink-0 rounded-full bg-surface-2 px-3 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "user" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md border bg-surface-2",
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex w-16 items-center gap-1 rounded-2xl rounded-bl-md border bg-surface-2 px-4 py-3" aria-label="Tutor is typing">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </div>
        )}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {chips.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        className="flex gap-2 border-t p-3"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Ask anything about the ${reaction.name}…`} aria-label="Your question" />
        <Button type="submit" size="icon" aria-label="Send">
          <Send />
        </Button>
      </form>
    </div>
  );
}
