import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { tutorAnswer, type Reaction } from "@/data/reactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "tutor"; text: string };

export function TutorChat({ reaction }: { reaction: Reaction }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "tutor", text: `Hi! I'm your ReactIQ tutor. Ask me anything about the ${reaction.name}.` },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [credits, setCredits] = useState(18);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [msgs, typing]);

  const ask = (q: string) => {
    const text = q.trim();
    if (!text || typing) return;
    if (credits <= 0) {
      setMsgs((m) => [...m, { role: "tutor", text: "You're out of credits on the Free plan. Join the Pro waitlist for more." }]);
      return;
    }
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setCredits((c) => c - 1);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "tutor", text: tutorAnswer(reaction, text) }]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="flex h-[560px] flex-col overflow-hidden rounded-2xl border bg-surface">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden /> AI tutor
        </div>
        <span className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted-foreground">
          Credits: <span className="font-semibold text-foreground">{credits}</span> left · Free plan
        </span>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <p
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "user" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md border bg-surface-2",
              )}
            >
              {m.text}
            </p>
          </div>
        ))}
        {typing && (
          <div className="flex w-16 items-center gap-1 rounded-2xl rounded-bl-md border bg-surface-2 px-4 py-3" aria-label="Tutor is typing">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-2">
        {reaction.suggestions.map((s) => (
          <button
            key={s}
            onClick={() => ask(s)}
            className="shrink-0 rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
      <form
        className="flex gap-2 border-t p-3"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about this mechanism…" aria-label="Your question" />
        <Button type="submit" size="icon" aria-label="Send">
          <Send />
        </Button>
      </form>
    </div>
  );
}
