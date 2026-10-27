import type { CSSProperties, ReactNode } from "react";

/**
 * Fade-up on entry, done with a pure CSS animation so content is always visible
 * (server-rendered, no JavaScript required) and never stuck at opacity 0.
 */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const style: CSSProperties = delay ? { animationDelay: `${delay}s` } : {};
  return (
    <div className={`reveal ${className ?? ""}`} style={style}>
      {children}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-muted-foreground">{sub}</p>}
    </Reveal>
  );
}
