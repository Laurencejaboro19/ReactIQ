import { describe, expect, it } from "vitest";
import { reactions } from "@/data/reactions";

const dist = (a: number[], b: number[]) => Math.hypot((a[0] ?? 0) - (b[0] ?? 0), (a[1] ?? 0) - (b[1] ?? 0), (a[2] ?? 0) - (b[2] ?? 0));

describe("reaction content", () => {
  for (const r of reactions) {
    describe(r.name, () => {
      const n = r.steps.length + 1;

      it("has a 2D scene with one frame per keyframe", () => {
        for (const a of r.scene.atoms) expect(a.frames.length, `atom ${a.id}`).toBe(n);
        const ids = new Set(r.scene.atoms.map((a) => a.id));
        for (const b of r.scene.bonds) {
          expect(ids.has(b.a), `bond atom ${b.a}`).toBe(true);
          expect(ids.has(b.b), `bond atom ${b.b}`).toBe(true);
          expect(b.frames.length, `bond ${b.a}-${b.b}`).toBe(n);
        }
        for (const ar of r.scene.arrows) expect(ar.step).toBeLessThan(r.steps.length);
        for (const a of r.scene.atoms)
          for (const fr of a.frames) {
            expect(fr.x).toBeGreaterThanOrEqual(0);
            expect(fr.x).toBeLessThanOrEqual(400);
            expect(fr.y).toBeGreaterThanOrEqual(0);
            expect(fr.y).toBeLessThanOrEqual(240);
          }
      });

      it("has a consistent 3D scene", () => {
        const s = r.scene3d;
        const nf = s.frameLabels.length;
        expect(nf).toBeGreaterThanOrEqual(3);
        for (const a of s.atoms) expect(a.frames.length).toBe(nf);
        for (const b of s.bonds) {
          expect(b.frames.length).toBe(nf);
          expect(b.a).toBeLessThan(s.atoms.length);
          expect(b.b).toBeLessThan(s.atoms.length);
        }
      });

      it("has sensible 3D geometry (bond lengths, no clashes)", () => {
        const s = r.scene3d;
        const problems: string[] = [];
        for (let f = 0; f < s.frameLabels.length; f++) {
          for (const b of s.bonds) {
            const order = b.frames[f] ?? 0;
            if (order <= 0) continue;
            const d = dist(s.atoms[b.a]!.frames[f]!, s.atoms[b.b]!.frames[f]!);
            const ea = s.atoms[b.a]!.el;
            const eb = s.atoms[b.b]!.el;
            const max = order < 0.85 ? 3.2 : /Mg|Al|Br|Cl|P|S/.test(ea + eb) ? 2.7 : 1.75;
            if (d < 0.85 || d > max) problems.push(`${r.slug} f${f} bond ${ea}${b.a}-${eb}${b.b} order ${order} length ${d.toFixed(2)}`);
          }
          // non-bonded heavy-atom clashes
          const bonded = new Set(s.bonds.filter((b) => (b.frames[f] ?? 0) > 0).map((b) => `${Math.min(b.a, b.b)}-${Math.max(b.a, b.b)}`));
          for (let i = 0; i < s.atoms.length; i++)
            for (let j = i + 1; j < s.atoms.length; j++) {
              if (bonded.has(`${i}-${j}`)) continue;
              const d = dist(s.atoms[i]!.frames[f]!, s.atoms[j]!.frames[f]!);
              const heavy = s.atoms[i]!.el !== "H" && s.atoms[j]!.el !== "H";
              if (d < (heavy ? 1.3 : 0.9)) problems.push(`${r.slug} f${f} clash ${s.atoms[i]!.el}${i}/${s.atoms[j]!.el}${j} at ${d.toFixed(2)}`);
            }
        }
        expect(problems, problems.join("\n")).toEqual([]);
      });
    });
  }
});
