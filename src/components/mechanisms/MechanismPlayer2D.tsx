import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, Repeat } from "lucide-react";
import type { AtomFrame, BondStyle, Scene2D, Step } from "@/data/reactions";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEP_SECONDS = 2.6;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Props = {
  scene: Scene2D;
  steps: Step[];
  compact?: boolean;
  title?: string;
  className?: string;
};

export function MechanismPlayer2D({ scene, steps, compact = false, title, className }: Props) {
  const n = steps.length;
  const reduced = useReducedMotion();
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(compact && !reduced);
  const [loop, setLoop] = useState(compact);
  const dirRef = useRef(1);
  const posRef = useRef(0);
  posRef.current = pos;

  useEffect(() => {
    if (!playing) return;
    if (reduced) {
      const id = setInterval(() => {
        let p = Math.round(posRef.current) + dirRef.current;
        if (p > n || p < 0) {
          if (!loop) return setPlaying(false);
          dirRef.current *= -1;
          p = Math.round(posRef.current) + dirRef.current;
        }
        setPos(p);
      }, 1800);
      return () => clearInterval(id);
    }
    let raf = 0;
    let last = performance.now();
    let hold = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (hold > 0) {
        hold -= dt;
      } else {
        let p = posRef.current + (dirRef.current * dt) / STEP_SECONDS;
        if (p >= n || p <= 0) {
          p = clamp(p, 0, n);
          if (loop) {
            dirRef.current *= -1;
            hold = 0.8;
          } else {
            setPos(p);
            setPlaying(false);
            return;
          }
        }
        setPos(p);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, loop, n, reduced]);

  const idx = Math.min(Math.floor(pos), n - 1);
  const t = pos - idx;
  const drawT = dirRef.current > 0 || !playing ? clamp(t / 0.45) : clamp(t / 0.45);
  const moveT = ease(clamp((t - 0.45) / 0.55));

  const atoms = useMemo(() => {
    const m: Record<string, AtomFrame> = {};
    for (const a of scene.atoms) {
      const from: AtomFrame = a.frames[idx] ?? a.frames[a.frames.length - 1] ?? { x: 0, y: 0, hidden: true };
      const to: AtomFrame = a.frames[idx + 1] ?? from;
      const near = moveT < 0.5 ? from : to;
      m[a.id] = {
        x: lerp(from.x, to.x, moveT),
        y: lerp(from.y, to.y, moveT),
        label: near.label ?? from.label,
        charge: near.charge,
        hidden: from.hidden && to.hidden ? true : undefined,
      };
      (m[a.id] as AtomFrame & { op?: number }).op =
        from.hidden && !to.hidden ? moveT : !from.hidden && to.hidden ? 1 - moveT : from.hidden ? 0 : 1;
    }
    return m as Record<string, AtomFrame & { op?: number }>;
  }, [scene, idx, moveT]);

  const go = (p: number) => {
    setPlaying(false);
    setPos(clamp(p, 0, n));
  };
  const togglePlay = () => {
    if (!playing && pos >= n && !loop) setPos(0);
    if (!playing) dirRef.current = pos >= n ? -1 : 1;
    if (!playing && !loop) dirRef.current = 1;
    if (!playing && !loop && pos >= n) setPos(0);
    setPlaying((p) => !p);
  };

  const shown = Math.min(n, Math.max(1, pos >= n ? n : idx + 1));
  const step: Step = steps[shown - 1] ?? { title: "", text: "" };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className={cn("relative overflow-hidden rounded-2xl border bg-surface-2", compact ? "" : "aspect-[5/3]")}>
        <div className="glow-orb absolute -right-10 -top-10 h-40 w-40 opacity-60" />
        <svg
          viewBox="0 0 400 240"
          className="relative h-full w-full text-foreground"
          role="img"
          aria-label={`${title ?? "Mechanism"} — step ${shown} of ${n}: ${step.title}`}
        >
          <defs>
            <marker id="arrowhead" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="var(--primary)" />
            </marker>
          </defs>
          {scene.bonds.map((b, i) => {
            const pa = atoms[b.a];
            const pb = atoms[b.b];
            if (!pa || !pb) return null;
            const from: BondStyle = b.frames[idx] ?? "none";
            const to: BondStyle = b.frames[idx + 1] ?? from;
            return <Bond key={i} a={pa} b={pb} from={from} to={to} u={moveT} />;
          })}
          {Object.entries(atoms).map(([id, a]) =>
            a.hidden ? null : (
              <g key={id} opacity={a.op ?? 1} transform={`translate(${a.x} ${a.y})`}>
                {a.label ? (
                  <text textAnchor="middle" dominantBaseline="central" className="fill-current font-display" fontSize="17" fontWeight={600}>
                    {a.label}
                  </text>
                ) : null}
                {a.charge && (
                  <text x={a.label && a.label.length > 1 ? 16 : a.label ? 11 : 6} y={a.label ? -11 : -8} fontSize="12" fill="var(--primary)" fontWeight={700}>
                    {a.charge}
                  </text>
                )}
              </g>
            ),
          )}
          {scene.arrows
            .filter((ar) => ar.step === idx)
            .map((ar, i) => (
              <path
                key={i}
                d={ar.d}
                fill="none"
                stroke="var(--primary)"
                strokeWidth={2.4}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - drawT}
                markerEnd={drawT > 0.9 ? "url(#arrowhead)" : undefined}
                opacity={1 - moveT}
                style={{ filter: "drop-shadow(0 0 4px color-mix(in oklab, var(--primary) 60%, transparent))" }}
              />
            ))}
          {scene.annotations?.map((an, i) => {
            const op = clamp(1 - Math.abs(pos - an.frame) * 1.5);
            return op > 0 ? (
              <text key={i} x={an.x} y={an.y} fontSize="26" fill="var(--primary)" opacity={op} className="font-display">
                [ {an.text} ]
              </text>
            ) : null;
          })}
        </svg>
        {compact && (
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">{step.title}</span>
            <span>
              Step {shown}/{n}
            </span>
          </div>
        )}
      </div>

      {!compact && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="icon" variant="secondary" onClick={() => go(Math.ceil(pos) - 1)} aria-label="Previous step">
              <ChevronLeft />
            </Button>
            <Button size="icon" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
              {playing ? <Pause /> : <Play />}
            </Button>
            <Button size="icon" variant="secondary" onClick={() => go(Math.floor(pos) + 1)} aria-label="Next step">
              <ChevronRight />
            </Button>
            <span className="ml-1 text-sm font-medium tabular-nums" aria-live="polite">
              Step {shown} of {n}
            </span>
            <label className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
              <Repeat className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Loop (forwards and backwards)</span>
              <span className="sm:hidden">Loop</span>
              <Switch checked={loop} onCheckedChange={setLoop} aria-label="Loop forwards and backwards" />
            </label>
          </div>
          <Slider
            value={[pos * 100]}
            max={n * 100}
            step={1}
            onValueChange={([v]) => go((v ?? 0) / 100)}
            aria-label="Scrub mechanism"
          />
          <div className="rounded-2xl border bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Step {shown}</p>
            <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
          </div>
        </>
      )}
    </div>
  );
}

type P = { x: number; y: number; label?: string | undefined };
function shorten(a: P, b: P) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const rad = (l?: string) => (l === "" ? 0 : (l?.length ?? 1) > 1 ? 18 : 12);
  const ra = rad(a.label);
  const rb = rad(b.label);
  return {
    x1: a.x + (dx / len) * ra,
    y1: a.y + (dy / len) * ra,
    x2: b.x - (dx / len) * rb,
    y2: b.y - (dy / len) * rb,
    nx: -dy / len,
    ny: dx / len,
  };
}

function BondShape({ a, b, style, opacity }: { a: P; b: P; style: BondStyle; opacity: number }) {
  if (style === "none" || opacity <= 0.01) return null;
  const s = shorten(a, b);
  const common = { stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, opacity };
  switch (style) {
    case "single":
      return <line {...s} {...common} />;
    case "partial":
      return <line {...s} {...common} strokeDasharray="4 5" />;
    case "double":
      return (
        <g opacity={opacity}>
          <line x1={s.x1 + s.nx * 3.5} y1={s.y1 + s.ny * 3.5} x2={s.x2 + s.nx * 3.5} y2={s.y2 + s.ny * 3.5} stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
          <line x1={s.x1 - s.nx * 3.5} y1={s.y1 - s.ny * 3.5} x2={s.x2 - s.nx * 3.5} y2={s.y2 - s.ny * 3.5} stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
        </g>
      );
    case "triple":
      return (
        <g opacity={opacity}>
          <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
          <line x1={s.x1 + s.nx * 5} y1={s.y1 + s.ny * 5} x2={s.x2 + s.nx * 5} y2={s.y2 + s.ny * 5} stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
          <line x1={s.x1 - s.nx * 5} y1={s.y1 - s.ny * 5} x2={s.x2 - s.nx * 5} y2={s.y2 - s.ny * 5} stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
        </g>
      );
    case "wedge":
      return (
        <polygon
          points={`${s.x1},${s.y1} ${s.x2 + s.nx * 5},${s.y2 + s.ny * 5} ${s.x2 - s.nx * 5},${s.y2 - s.ny * 5}`}
          fill="currentColor"
          opacity={opacity}
        />
      );
    case "dash": {
      const lines = [];
      for (let i = 1; i <= 6; i++) {
        const k = i / 6;
        const x = lerp(s.x1, s.x2, k);
        const y = lerp(s.y1, s.y2, k);
        const w = 5 * k;
        lines.push(<line key={i} x1={x + s.nx * w} y1={y + s.ny * w} x2={x - s.nx * w} y2={y - s.ny * w} stroke="currentColor" strokeWidth={1.8} />);
      }
      return <g opacity={opacity}>{lines}</g>;
    }
  }
}

function Bond({ a, b, from, to, u }: { a: P; b: P; from: BondStyle; to: BondStyle; u: number }) {
  if (from === to) return <BondShape a={a} b={b} style={from} opacity={1} />;
  return (
    <>
      <BondShape a={a} b={b} style={from} opacity={1 - u} />
      <BondShape a={a} b={b} style={to} opacity={u} />
    </>
  );
}
