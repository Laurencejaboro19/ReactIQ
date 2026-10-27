/*
 * 3D keyframe scenes for every reaction.
 *
 * Each scene is authored as named atoms with one position per keyframe. A small
 * vector/geometry helper library places substituents with proper tetrahedral,
 * trigonal and bent geometry so the animations are chemically sensible
 * (bond lengths in ångström; the viewer interpolates between keyframes).
 */
import type { Element, Scene3D, Vec3 } from "./reactions";

/* ---------- vector helpers ---------- */
type V = Vec3;
const v = (x: number, y: number, z: number): V => [x, y, z];
const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: V, s: number): V => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a: V) => Math.hypot(a[0], a[1], a[2]);
const norm = (a: V): V => {
  const l = len(a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const mix = (a: V, b: V, t: number): V => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
/** point at distance r from base along dir */
const at = (base: V, dir: V, r: number): V => add(base, mul(norm(dir), r));
/** orthonormal basis (u, w) perpendicular to axis a */
function basis(a: V): [V, V] {
  const n = norm(a);
  const h: V = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  const u = norm(cross(n, h));
  const w = cross(n, u);
  return [u, w];
}
const deg = (d: number) => (d * Math.PI) / 180;

/**
 * Three substituent directions around `axis` (the direction from the centre to
 * the 4th/unique substituent). `cosT` is the cosine of the angle from the axis:
 * -1/3 for sp³ (109.5°), 0 for a flat sp² centre. `phase` rotates the trio.
 */
function trio(axis: V, cosT = -1 / 3, phase = 0): [V, V, V] {
  const a = norm(axis);
  const [u, w] = basis(a);
  const s = Math.sqrt(1 - cosT * cosT);
  const out = [0, 1, 2].map((i) => {
    const p = deg(phase + i * 120);
    return norm(add(mul(a, cosT), mul(add(mul(u, Math.cos(p)), mul(w, Math.sin(p))), s)));
  });
  return [out[0] ?? a, out[1] ?? a, out[2] ?? a];
}
/** Two sp³ directions on centre c that already has neighbours n1 and n2. */
function sp3pair(c: V, n1: V, n2: V): [V, V] {
  const d1 = norm(sub(n1, c));
  const d2 = norm(sub(n2, c));
  const b = norm(mul(add(d1, d2), -1)); // outward bisector
  const p = norm(cross(d1, d2));
  const ca = Math.cos(deg(54.75));
  const sa = Math.sin(deg(54.75));
  return [norm(add(mul(b, ca), mul(p, sa))), norm(add(mul(b, ca), mul(p, -sa)))];
}
/** The single in-plane sp² direction on centre c with neighbours n1 and n2. */
function sp2third(c: V, n1: V, n2: V): V {
  return norm(mul(add(norm(sub(n1, c)), norm(sub(n2, c))), -1));
}
/** Two sp² directions on centre c with one neighbour n, lying in the plane with the given `normal`. */
function sp2pair(c: V, n: V, normal: V): [V, V] {
  const a = norm(sub(n, c));
  const u = norm(cross(normal, a));
  return [norm(add(mul(a, -0.5), mul(u, 0.866))), norm(add(mul(a, -0.5), mul(u, -0.866)))];
}
/** Normal of the plane that contains direction `a` and direction `inPlane`. */
const planeWith = (a: V, inPlane: V): V => norm(cross(a, inPlane));
/** Sort directions so the one pointing most towards `target` (from `from`) comes first. */
function pointing(dirs: V[], from: V, target: V): V[] {
  const t = norm(sub(target, from));
  return [...dirs].sort((p, q) => dot(q, t) - dot(p, t));
}
/** Bent (water-like) pair of H directions on O whose lone pairs face `toward`; H's lie in the plane containing `inPlane`. */
function bentPair(o: V, toward: V, inPlane: V): [V, V] {
  const a = norm(sub(toward, o));
  const nrm = norm(cross(a, inPlane));
  const u = norm(cross(nrm, a));
  return [norm(add(mul(a, -0.6), mul(u, 0.8))), norm(add(mul(a, -0.6), mul(u, -0.8)))];
}

/* ---------- bond lengths ---------- */
const CC = 1.54, CCd = 1.34, CH = 1.09, CO = 1.43, COd = 1.22, OHl = 0.96, CBr = 1.94, CMg = 2.1, MgBr = 2.45;
const CP = 1.8, PO = 1.5, CCl = 1.78, AlCl = 2.13, OO = 1.45, SO = 1.5, CS = 1.81;

/* ---------- scene assembly ---------- */
type Frame = Record<string, V>;
type BondSpec = [string, string, number[]];
function build(els: Record<string, Element>, frames: Frame[], bonds: BondSpec[], frameLabels: string[]): Scene3D {
  const names = Object.keys(els);
  const index = new Map(names.map((n, i) => [n, i]));
  const missing = frames.flatMap((f, i) => names.filter((n) => !(n in f)).map((n) => `${n}@${i}`));
  if (missing.length) throw new Error(`3D scene missing positions: ${missing.join(", ")}`);
  if (frames.length !== frameLabels.length) throw new Error("frame/label count mismatch");
  return {
    frameLabels,
    atoms: names.map((n) => ({ el: els[n] as Element, frames: frames.map((f) => f[n] as V) })),
    bonds: bonds.map(([a, b, fr]) => {
      const ia = index.get(a);
      const ib = index.get(b);
      if (ia === undefined || ib === undefined) throw new Error(`unknown atom in bond ${a}-${b}`);
      if (fr.length !== frames.length) throw new Error(`bond ${a}-${b} has ${fr.length} orders for ${frames.length} frames`);
      return { a: ia, b: ib, frames: fr };
    }),
  };
}
const same = (n: number, order: number) => Array<number>(n).fill(order);
/** Rotate a finished scene about the x axis (degrees) so its most informative face meets the default camera. */
function rotX(scene: Scene3D, degrees: number): Scene3D {
  const c = Math.cos(deg(degrees));
  const sn = Math.sin(deg(degrees));
  return {
    ...scene,
    atoms: scene.atoms.map((a) => ({ ...a, frames: a.frames.map(([x, y, z]): V => [x, y * c - z * sn, y * sn + z * c]) })),
  };
}

/* =====================================================================
 * SN2 — hydroxide + bromomethane (backside attack, Walden inversion)
 * ===================================================================== */
function sn2(): Scene3D {
  const els: Record<string, Element> = { C: "Cc", Br: "Br", O: "O", Ho: "H", H1: "H", H2: "H", H3: "H" };
  const X: V = [1, 0, 0];
  const mk = (brX: number, oX: number, cosT: number, tilt: number): Frame => {
    const C: V = [0, 0, 0];
    const [h1, h2, h3] = trio(X, cosT, 90);
    const O: V = [oX, 0, 0];
    return {
      C,
      Br: [brX, 0, 0],
      O,
      Ho: at(O, [-0.55, 0.83, 0], OHl),
      H1: at(C, h1, CH),
      H2: at(C, h2, CH),
      H3: at(C, h3, CH),
      ...(tilt ? {} : {}),
    };
  };
  return build(
    els,
    [mk(CBr, -5.2, -1 / 3, 0), mk(1.98, -3.1, -0.28, 0), mk(2.4, -2.05, 0, 0), mk(5.2, -CO, 1 / 3, 0)],
    [
      ["C", "Br", [1, 1, 0.5, 0]],
      ["C", "O", [0, 0, 0.5, 1]],
      ["O", "Ho", same(4, 1)],
      ["C", "H1", same(4, 1)],
      ["C", "H2", same(4, 1)],
      ["C", "H3", same(4, 1)],
    ],
    ["Reactants", "Backside approach", "Trigonal bipyramidal transition state", "Inverted product (methanol + Br⁻)"],
  );
}

/* =====================================================================
 * SN1 — tert-butyl bromide + water
 * ===================================================================== */
function sn1(): Scene3D {
  const els: Record<string, Element> = { C: "Cc", Br: "Br", M1: "C", M2: "C", M3: "C", O: "O", Hw1: "H", Hw2: "H", O2: "O", Hx1: "H", Hx2: "H" };
  const X: V = [1, 0, 0];
  const mk = (brX: number, cosT: number, O: V, transfer: boolean, O2: V): Frame => {
    const C: V = [0, 0, 0];
    const [m1, m2, m3] = trio(X, cosT, 30);
    const [hw1Dir, hw2Dir] = bentPair(O, C, [0, 1, 0]);
    const Hw1 = transfer ? at(O2, sub(O, O2), OHl) : at(O, hw1Dir, OHl);
    const [hx1, hx2] = bentPair(O2, O, [0, 0, 1]);
    return {
      C,
      Br: [brX, 0, 0],
      M1: at(C, m1, cosT === 0 ? 1.48 : CC),
      M2: at(C, m2, cosT === 0 ? 1.48 : CC),
      M3: at(C, m3, cosT === 0 ? 1.48 : CC),
      O,
      Hw1,
      Hw2: at(O, hw2Dir, OHl),
      O2,
      Hx1: at(O2, hx1, OHl),
      Hx2: at(O2, hx2, OHl),
    };
  };
  const o2far: V = [-4.2, 3.2, 0.6];
  return build(
    els,
    [
      mk(CBr, -1 / 3, [-4.6, 0.2, 0], false, o2far),
      mk(2.7, -0.2, [-3.8, 0.2, 0], false, o2far),
      mk(4.6, 0, [-2.7, 0.1, 0], false, o2far),
      mk(5.4, -0.28, [-1.5, 0, 0], false, [-2.9, 2.4, 0.4]),
      mk(5.6, -1 / 3, [-1.43, 0, 0], true, [-2.75, 2.25, 0.4]),
    ],
    [
      ["C", "Br", [1, 0.5, 0, 0, 0]],
      ["C", "M1", same(5, 1)],
      ["C", "M2", same(5, 1)],
      ["C", "M3", same(5, 1)],
      ["C", "O", [0, 0, 0, 1, 1]],
      ["O", "Hw1", [1, 1, 1, 1, 0]],
      ["O", "Hw2", same(5, 1)],
      ["O2", "Hw1", [0, 0, 0, 0, 1]],
      ["O2", "Hx1", same(5, 1)],
      ["O2", "Hx2", same(5, 1)],
    ],
    ["tert-Butyl bromide + water", "C–Br bond stretches (slow step)", "Planar tert-butyl cation", "Water attacks the empty p orbital", "Deprotonation → tert-butanol + H₃O⁺"],
  );
}

/* =====================================================================
 * E1 — tert-butyl bromide → 2-methylpropene (via carbocation)
 * ===================================================================== */
function e1(): Scene3D {
  const els: Record<string, Element> = { Ca: "Cc", Br: "Br", M1: "C", M2: "C", Cb: "C", Hb1: "H", Hb2: "H", Hb3: "H", O: "O", Hw1: "H", Hw2: "H" };
  const X: V = [1, 0, 0];
  const Ca: V = [0, 0, 0];
  const geom = (cosT: number, cbLen: number) => {
    const [cb, m1, m2] = trio(X, cosT, 90);
    const Cb = at(Ca, cb, cbLen);
    const [h1, h2, h3] = trio(sub(Ca, Cb), -1 / 3, 180);
    return { Cb, m1, m2, h1, h2, h3, cb };
  };
  const mk = (brX: number, cosT: number, cbLen: number, oGap: number | null, alkene: boolean, O?: V): Frame => {
    const g = geom(cosT, cbLen);
    const Cb = g.Cb;
    const rC = cosT === 0 ? 1.48 : CC;
    const Opos: V = O ?? at(Cb, g.h1, CH + (oGap ?? 3));
    let Hb1: V, Hb2: V, Hb3: V;
    if (alkene) {
      const [p1, p2] = sp2pair(Cb, Ca, planeWith(sub(Cb, Ca), X));
      Hb2 = at(Cb, p1, CH);
      Hb3 = at(Cb, p2, CH);
      Hb1 = at(Opos, sub(Cb, Opos), OHl);
    } else {
      Hb1 = at(Cb, g.h1, CH);
      Hb2 = at(Cb, g.h2, CH);
      Hb3 = at(Cb, g.h3, CH);
    }
    const [w1, w2] = bentPair(Opos, Cb, X);
    return { Ca, Br: [brX, 0, 0], M1: at(Ca, g.m1, rC), M2: at(Ca, g.m2, rC), Cb, Hb1, Hb2, Hb3, O: Opos, Hw1: at(Opos, w1, OHl), Hw2: at(Opos, w2, OHl) };
  };
  const f2 = mk(5.4, 0, 1.48, 1.9, false);
  return build(
    els,
    [mk(CBr, -1 / 3, CC, 3.4, false), mk(4.8, 0, 1.48, 3.0, false), f2, mk(5.8, 0, CCd, null, true, f2["O"])],
    [
      ["Ca", "Br", [1, 0, 0, 0]],
      ["Ca", "M1", same(4, 1)],
      ["Ca", "M2", same(4, 1)],
      ["Ca", "Cb", [1, 1, 1, 2]],
      ["Cb", "Hb1", [1, 1, 1, 0]],
      ["Cb", "Hb2", same(4, 1)],
      ["Cb", "Hb3", same(4, 1)],
      ["O", "Hb1", [0, 0, 0, 1]],
      ["O", "Hw1", same(4, 1)],
      ["O", "Hw2", same(4, 1)],
    ],
    ["tert-Butyl bromide", "Ionisation → planar carbocation", "Water approaches a β-hydrogen", "C=C forms: 2-methylpropene + H₃O⁺"],
  );
}

/* =====================================================================
 * E2 — hydroxide + 2-bromopropane (anti-periplanar)
 * ===================================================================== */
function e2(): Scene3D {
  const els: Record<string, Element> = { Ca: "Cc", Cb: "C", Me: "C", Br: "Br", Ha: "H", Hb1: "H", Hb2: "H", Hb3: "H", O: "O", Ho: "H" };
  const X: V = [1, 0, 0];
  const mk = (half: number, cosT: number, brR: number, hbR: number, oGap: number, alkene: boolean): Frame => {
    const Ca: V = [half, 0, 0];
    const Cb: V = [-half, 0, 0];
    const [brd, med, had] = trio([-1, 0, 0], cosT, 90); // on Ca; axis points to Cb
    const [hb1d, hb2d, hb3d] = trio(X, cosT, 270); // on Cb; Hb1 anti to Br
    let Br: V, Me: V, Ha: V, Hb1: V, Hb2: V, Hb3: V, O: V;
    if (alkene) {
      const nrm = planeWith(X, brd); // alkene plane ⟂ to the Br/H departure plane
      const [a1, a2] = sp2pair(Ca, Cb, nrm);
      const [b1, b2] = sp2pair(Cb, Ca, nrm);
      Me = at(Ca, a1, 1.5);
      Ha = at(Ca, a2, CH);
      Hb2 = at(Cb, b1, CH);
      Hb3 = at(Cb, b2, CH);
      Br = at(Ca, brd, 4.8);
      O = at(Cb, hb1d, oGap);
      Hb1 = at(O, sub(Cb, O), OHl);
    } else {
      Br = at(Ca, brd, brR);
      Me = at(Ca, med, 1.52);
      Ha = at(Ca, had, CH);
      Hb1 = at(Cb, hb1d, hbR);
      Hb2 = at(Cb, hb2d, CH);
      Hb3 = at(Cb, hb3d, CH);
      O = at(Cb, hb1d, hbR + oGap);
    }
    const Ho = at(O, bentPair(O, Hb1, X)[0], OHl);
    return { Ca, Cb, Me, Br, Ha, Hb1, Hb2, Hb3, O, Ho };
  };
  return build(
    els,
    [mk(0.77, -1 / 3, CBr, CH, 3.4, false), mk(0.77, -1 / 3, CBr, CH, 2.2, false), mk(0.72, -0.15, 2.45, 1.35, 1.3, false), mk(0.67, 0, CBr, CH, 3.3, true)],
    [
      ["Ca", "Cb", [1, 1, 1.5, 2]],
      ["Ca", "Me", same(4, 1)],
      ["Ca", "Ha", same(4, 1)],
      ["Ca", "Br", [1, 1, 0.5, 0]],
      ["Cb", "Hb1", [1, 1, 0.5, 0]],
      ["Cb", "Hb2", same(4, 1)],
      ["Cb", "Hb3", same(4, 1)],
      ["O", "Hb1", [0, 0, 0.5, 1]],
      ["O", "Ho", same(4, 1)],
    ],
    ["2-Bromopropane + hydroxide", "Base lines up with the anti-periplanar H", "Concerted transition state", "Propene + water + Br⁻"],
  );
}

/* =====================================================================
 * Aldol condensation — two acetaldehydes, hydroxide catalyst
 * ===================================================================== */
function aldol(): Scene3D {
  const els: Record<string, Element> = {
    C1: "Cc", O1: "O", H1: "H", C2: "Cc", Ha: "H", Hb: "H", Hc: "H",
    C3: "Cc", O3: "O", H3: "H", C4: "C",
    Ob: "O", Hob: "H",
  };
  const X: V = [1, 0, 0];
  // molecule A (acetaldehyde #1) in the x-y plane, C1 at origin, C2 at -x
  const C1: V = [0, 0, 0];
  const H1 = at(C1, [0.5, -0.866, 0], CH);
  const mkO1 = (r: number) => at(C1, [0.5, 0.866, 0], r);

  const [haDir] = trio(X, -1 / 3, 90);
  const [c3Dir] = trio(X, -1 / 3, 270);
  // second acetaldehyde, its plane perpendicular to the attack direction (Bürgi–Dunitz-ish)
  const moleculeB = (C2: V, dist: number) => {
    const C3 = at(C2, c3Dir, dist);
    const [o3, h3, c4] = trio(c3Dir, 0, 0);
    return { C3, O3: at(C3, o3, COd), H3: at(C3, h3, CH), C4: at(C3, c4, 1.5) };
  };
  // frame 0: reactants
  const f0 = (): Frame => {
    const C2: V = [-CC, 0, 0];
    const [ha, hb, hc] = trio(X, -1 / 3, 90);
    const Ha = at(C2, ha, CH);
    const Ob = at(Ha, ha, 1.9);
    return {
      C1, O1: mkO1(COd), H1, C2, Ha, Hb: at(C2, hb, CH), Hc: at(C2, hc, CH),
      ...moleculeB(C2, 4.3),
      Ob, Hob: at(Ob, bentPair(Ob, Ha, X)[0], OHl),
    };
  };
  // frame 1: enolate + water
  const f1 = (): Frame => {
    const C2: V = [-CCd, 0, 0];
    const Ob = at(C2, haDir, 3.1);
    const Ha = at(Ob, sub(C2, Ob), OHl);
    const [p1, p2] = sp2pair(C2, C1, [0, 0, 1]);
    return {
      C1, O1: mkO1(1.3), H1, C2, Ha, Hb: at(C2, p1, CH), Hc: at(C2, p2, CH),
      ...moleculeB(C2, 3.4),
      Ob, Hob: at(Ob, bentPair(Ob, Ha, X)[0], OHl),
    };
  };
  // frames 2/3: C–C bond formed (alkoxide → aldol). `protonated` moves Ha onto O3.
  const f23 = (protonated: boolean): Frame => {
    const C2: V = [-CC, 0, 0];
    const [c3d, hb, hc] = trio(X, -1 / 3, 270);
    const C3 = at(C2, c3d, CC);
    const [o3d, h3d, c4d] = trio(sub(C2, C3), -1 / 3, 60);
    const O3 = at(C3, o3d, protonated ? CO : 1.38);
    const Ob = at(O3, o3d, 2.7);
    const Ha = protonated ? at(O3, sub(Ob, O3), OHl) : at(Ob, sub(O3, Ob), OHl);
    return {
      C1, O1: mkO1(COd), H1, C2, Ha, Hb: at(C2, hb, CH), Hc: at(C2, hc, CH),
      C3, O3, H3: at(C3, h3d, CH), C4: at(C3, c4d, 1.52),
      Ob, Hob: at(Ob, bentPair(Ob, O3, [0, 1, 0])[0], OHl),
    };
  };
  // frame 4: dehydration → crotonaldehyde; hydroxide takes Hb, O3H leaves
  const f4 = (): Frame => {
    const C2: V = [-1.46, 0, 0];
    const [c3d] = trio(X, -1 / 3, 270);
    const C3 = at(C2, c3d, CCd);
    const Hc = at(C2, sp2third(C2, C1, C3), CH);
    const [p1, p2] = sp2pair(C3, C2, planeWith(sub(C1, C2), sub(C3, C2)));
    const H3 = at(C3, p1, CH);
    const C4 = at(C3, p2, 1.5);
    const [o3d] = trio(sub(C2, C3), -1 / 3, 60);
    const O3 = at(C3, o3d, 3.4);
    const Ha = at(O3, [0.3, 0.9, 0.3], OHl);
    const [, hbd] = trio(X, -1 / 3, 270);
    const HbStart = at(C2, hbd, CH);
    const Ob = at(HbStart, hbd, 1.9);
    const Hb = at(Ob, sub(C2, Ob), OHl);
    return { C1, O1: mkO1(COd), H1, C2, Ha, Hb, Hc, C3, O3, H3, C4, Ob, Hob: at(Ob, bentPair(Ob, Hb, X)[0], OHl) };
  };
  return build(
    els,
    [f0(), f1(), f23(false), f23(true), f4()],
    [
      ["C1", "O1", [2, 1, 2, 2, 2]],
      ["C1", "C2", [1, 2, 1, 1, 1]],
      ["C1", "H1", same(5, 1)],
      ["C2", "Ha", [1, 0, 0, 0, 0]],
      ["Ob", "Ha", [0, 1, 1, 0, 0]],
      ["O3", "Ha", [0, 0, 0, 1, 1]],
      ["C2", "Hb", [1, 1, 1, 1, 0]],
      ["Ob", "Hb", [0, 0, 0, 0, 1]],
      ["C2", "Hc", same(5, 1)],
      ["Ob", "Hob", same(5, 1)],
      ["C2", "C3", [0, 0, 1, 1, 2]],
      ["C3", "O3", [2, 2, 1, 1, 0]],
      ["C3", "H3", same(5, 1)],
      ["C3", "C4", same(5, 1)],
    ],
    ["Acetaldehyde + hydroxide", "Enolate + water", "Enolate carbon attacks the second C=O", "Aldol: 3-hydroxybutanal", "Dehydration → crotonaldehyde (enal)"],
  );
}

/* =====================================================================
 * Grignard — CH₃MgBr + formaldehyde → ethanol
 * ===================================================================== */
function grignard(): Scene3D {
  const els: Record<string, Element> = { Cn: "Cc", Hn1: "H", Hn2: "H", Hn3: "H", Mg: "Mg", Br: "Br", Cc: "Cc", O: "O", Hc1: "H", Hc2: "H", Ow: "O", Hw1: "H", Hw2: "H", Hw3: "H" };
  const Cc: V = [0, 0, 0];
  const f0 = (): Frame => {
    const O = at(Cc, [0, 1, 0], COd);
    const Cn: V = [0.3, -0.5, 3.4];
    const Mg = at(Cn, [0.25, 1, 0.15], CMg);
    const [h1, h2, h3] = trio(sub(Mg, Cn), -1 / 3, 0);
    const Ow: V = [-3.2, 3.2, 1.6];
    const [w1, w2, w3] = pointing(trio(sub(Ow, O), -1 / 3, 0), Ow, O) as [V, V, V];
    return {
      Cn, Hn1: at(Cn, h1, CH), Hn2: at(Cn, h2, CH), Hn3: at(Cn, h3, CH), Mg, Br: at(Mg, [0.4, 1, 0.3], MgBr),
      Cc, O, Hc1: at(Cc, [0.866, -0.5, 0], CH), Hc2: at(Cc, [-0.866, -0.5, 0], CH),
      Ow, Hw1: at(Ow, w1, OHl), Hw2: at(Ow, w2, OHl), Hw3: at(Ow, w3, OHl),
    };
  };
  const fAdd = (Ow: V, protonated: boolean, mgOff: number): Frame => {
    const cnDir: V = [0, -0.333, 0.943];
    const Cn = at(Cc, cnDir, CC);
    const [od, h1d, h2d] = trio(cnDir, -1 / 3, 90);
    const O = at(Cc, od, CO);
    const Mg = at(O, od, 2.0 + mgOff);
    const [n1, n2, n3] = trio(sub(Cc, Cn), -1 / 3, 0);
    const [w1, w2, w3] = pointing(trio(sub(Ow, O), -1 / 3, 0), Ow, O) as [V, V, V];
    const Hw1 = protonated ? at(O, sub(Ow, O), OHl) : at(Ow, w1, OHl);
    return {
      Cn, Hn1: at(Cn, n1, CH), Hn2: at(Cn, n2, CH), Hn3: at(Cn, n3, CH), Mg, Br: at(Mg, od, MgBr),
      Cc, O, Hc1: at(Cc, h1d, CH), Hc2: at(Cc, h2d, CH),
      Ow, Hw1, Hw2: at(Ow, w2, OHl), Hw3: at(Ow, w3, OHl),
    };
  };
  return build(
    els,
    [f0(), fAdd([-3.4, 3.4, 1.4], false, 0), fAdd([-2.4, 2.9, 0.4], false, 0), fAdd([-2.0, 2.6, 0.2], true, 1.6)],
    [
      ["Cn", "Mg", [1, 0, 0, 0]],
      ["Cn", "Hn1", same(4, 1)],
      ["Cn", "Hn2", same(4, 1)],
      ["Cn", "Hn3", same(4, 1)],
      ["Mg", "Br", same(4, 1)],
      ["Cn", "Cc", [0, 1, 1, 1]],
      ["Cc", "O", [2, 1, 1, 1]],
      ["Cc", "Hc1", same(4, 1)],
      ["Cc", "Hc2", same(4, 1)],
      ["O", "Mg", [0, 1, 1, 0]],
      ["Ow", "Hw1", [1, 1, 1, 0]],
      ["O", "Hw1", [0, 0, 0, 1]],
      ["Ow", "Hw2", same(4, 1)],
      ["Ow", "Hw3", same(4, 1)],
    ],
    ["CH₃MgBr + formaldehyde", "Carbanion-like C adds to C=O", "Magnesium alkoxide; H₃O⁺ arrives", "Protonation → ethanol + MgBr⁺"],
  );
}

/* =====================================================================
 * Ozonolysis — ethene + O₃, then Me₂S work-up
 * ===================================================================== */
function ozonolysis(): Scene3D {
  const els: Record<string, Element> = { C1: "Cc", C2: "Cc", H1a: "H", H1b: "H", H2a: "H", H2b: "H", Oa: "O", Ob: "O", Oc: "O", S: "S", Ms1: "C", Ms2: "C" };
  const dms = (S: V, toward: V): Pick<Frame, "S" | "Ms1" | "Ms2"> => {
    const [m1, m2] = bentPair(S, toward, [0, 1, 0]);
    return { S, Ms1: at(S, m1, CS), Ms2: at(S, m2, CS) };
  };
  const f0 = (): Frame => {
    const C1: V = [-0.67, 0, 0];
    const C2: V = [0.67, 0, 0];
    return {
      C1, C2,
      H1a: at(C1, [-0.5, 0.866, 0], CH), H1b: at(C1, [-0.5, -0.866, 0], CH),
      H2a: at(C2, [0.5, 0.866, 0], CH), H2b: at(C2, [0.5, -0.866, 0], CH),
      Oa: [-1.09, 0, 3.1], Ob: [0, 0, 3.75], Oc: [1.09, 0, 3.1],
      ...dms([4.3, 0, -1.4], [0, 0, 0]),
    };
  };
  const f1 = (): Frame => {
    const C1: V = [-0.77, 0, 0];
    const C2: V = [0.77, 0, 0];
    const Oa: V = [-1.2, 0, 1.35];
    const Oc: V = [1.2, 0, 1.35];
    const [a1, a2] = sp3pair(C1, C2, Oa);
    const [b1, b2] = sp3pair(C2, C1, Oc);
    return {
      C1, C2, H1a: at(C1, a1, CH), H1b: at(C1, a2, CH), H2a: at(C2, b1, CH), H2b: at(C2, b2, CH),
      Oa, Ob: [0, 0, 2.15], Oc, ...dms([4.3, 0, -1.4], [0, 0, 0]),
    };
  };
  const f2 = (): Frame => {
    const C1: V = [-2.1, 0, 0.3];
    const C2: V = [2.0, 0, 0.3];
    const Oa = at(C1, [0, 0, 1], COd);
    const Oc = at(C2, [0, 0, 1], 1.28);
    const Ob = at(Oc, [-0.85, 0, 0.53], 1.35);
    return {
      C1, C2,
      H1a: at(C1, [0, 0.866, -0.5], CH), H1b: at(C1, [0, -0.866, -0.5], CH),
      H2a: at(C2, [0, 0.866, -0.5], CH), H2b: at(C2, [0, -0.866, -0.5], CH),
      Oa, Ob, Oc, ...dms([4.5, 0, -1.6], [0, 0, 0]),
    };
  };
  const f3 = (): Frame => {
    const C1: V = [-1.15, 0, 0.2];
    const C2: V = [1.15, 0, 0.2];
    const Oa: V = [0, 0, -0.55];
    const Ob: V = [-0.75, 0, 1.55];
    const Oc: V = [0.75, 0, 1.55];
    const [a1, a2] = sp3pair(C1, Oa, Ob);
    const [b1, b2] = sp3pair(C2, Oa, Oc);
    return { C1, C2, H1a: at(C1, a1, CH), H1b: at(C1, a2, CH), H2a: at(C2, b1, CH), H2b: at(C2, b2, CH), Oa, Ob, Oc, ...dms([-2.4, 0, 3.6], Ob) };
  };
  const f4 = (): Frame => {
    const C1: V = [-2.4, 0, -0.2];
    const C2: V = [2.4, 0, 0.2];
    const Oa = at(C1, [-0.5, 0, -0.866], COd);
    const Oc = at(C2, [0.5, 0, 0.866], COd);
    const [a1, a2] = sp2pair(C1, Oa, planeWith(sub(Oa, C1), [0, 1, 0]));
    const [b1, b2] = sp2pair(C2, Oc, planeWith(sub(Oc, C2), [0, 1, 0]));
    const Ob: V = [-0.6, 0, 2.4];
    const S = at(Ob, [0.35, 0, 1], SO);
    return { C1, C2, H1a: at(C1, a1, CH), H1b: at(C1, a2, CH), H2a: at(C2, b1, CH), H2b: at(C2, b2, CH), Oa, Ob, Oc, ...dms(S, Ob) };
  };
  return build(
    els,
    [f0(), f1(), f2(), f3(), f4()],
    [
      ["C1", "C2", [2, 1, 0, 0, 0]],
      ["C1", "Oa", [0, 1, 2, 1, 2]],
      ["C2", "Oc", [0, 1, 2, 1, 2]],
      ["Oa", "Ob", [1, 1, 0, 0, 0]],
      ["Ob", "Oc", [1, 1, 1, 1, 0]],
      ["C1", "Ob", [0, 0, 0, 1, 0]],
      ["C2", "Oa", [0, 0, 0, 1, 0]],
      ["S", "Ob", [0, 0, 0, 0, 2]],
      ["S", "Ms1", same(5, 1)],
      ["S", "Ms2", same(5, 1)],
      ["C1", "H1a", same(5, 1)],
      ["C1", "H1b", same(5, 1)],
      ["C2", "H2a", same(5, 1)],
      ["C2", "H2b", same(5, 1)],
    ],
    ["Alkene + ozone", "Molozonide (1,2,3-trioxolane)", "Fragmentation: carbonyl + carbonyl oxide", "Secondary ozonide (1,2,4-trioxolane)", "Me₂S work-up → two carbonyls + DMSO"],
  );
}

/* =====================================================================
 * Diels–Alder — s-cis butadiene + ethene → cyclohexene
 * ===================================================================== */
function dielsAlder(): Scene3D {
  const els: Record<string, Element> = {
    C1: "Cc", C2: "C", C3: "C", C4: "Cc", C5: "Cc", C6: "Cc",
    H1a: "H", H1b: "H", H2: "H", H3: "H", H4a: "H", H4b: "H", H5a: "H", H5b: "H", H6a: "H", H6b: "H",
  };
  const Z: V = [0, 0, 1];
  const diene = (zTerm: number) => {
    const C2: V = [-0.735, 0, 0];
    const C3: V = [0.735, 0, 0];
    const C1: V = [-1.405, 1.16, zTerm];
    const C4: V = [1.405, 1.16, zTerm];
    return { C1, C2, C3, C4 };
  };
  const ethene = (z: number) => ({ C5: [0.67, 1.3, z] as V, C6: [-0.67, 1.3, z] as V });
  const planarH = (C1: V, C2: V, C3: V, C4: V, C5: V, C6: V) => {
    const [a1, a2] = sp2pair(C1, C2, Z);
    const [d1, d2] = sp2pair(C4, C3, Z);
    const [e1, e2] = sp2pair(C5, C6, Z);
    const [f1, f2] = sp2pair(C6, C5, Z);
    return {
      H1a: at(C1, a1, CH), H1b: at(C1, a2, CH), H2: at(C2, sp2third(C2, C1, C3), CH), H3: at(C3, sp2third(C3, C2, C4), CH),
      H4a: at(C4, d1, CH), H4b: at(C4, d2, CH), H5a: at(C5, e1, CH), H5b: at(C5, e2, CH), H6a: at(C6, f1, CH), H6b: at(C6, f2, CH),
    };
  };
  const open = (zE: number, zTerm: number): Frame => {
    const d = diene(zTerm);
    const e = ethene(zE);
    return { ...d, ...e, ...planarH(d.C1, d.C2, d.C3, d.C4, e.C5, e.C6) };
  };
  const product = (): Frame => {
    const C2: V = [-0.67, 0, 0];
    const C3: V = [0.67, 0, 0];
    const C1: V = [-1.45, 1.25, 0];
    const C4: V = [1.45, 1.25, 0];
    const C6: V = [-0.77, 2.45, -0.4];
    const C5: V = [0.77, 2.45, 0.4];
    const [a1, a2] = sp3pair(C1, C2, C6);
    const [d1, d2] = sp3pair(C4, C3, C5);
    const [e1, e2] = sp3pair(C5, C4, C6);
    const [f1, f2] = sp3pair(C6, C1, C5);
    return {
      C1, C2, C3, C4, C5, C6,
      H1a: at(C1, a1, CH), H1b: at(C1, a2, CH), H2: at(C2, sp2third(C2, C1, C3), CH), H3: at(C3, sp2third(C3, C2, C4), CH),
      H4a: at(C4, d1, CH), H4b: at(C4, d2, CH), H5a: at(C5, e1, CH), H5b: at(C5, e2, CH), H6a: at(C6, f1, CH), H6b: at(C6, f2, CH),
    };
  };
  const f0 = open(-3.8, 0);
  const f1 = open(-2.7, 0);
  const prod = product();
  // transition state: heavy atoms blended between approach and product; each H re-attached
  // to its (blended) carbon along the blended C–H direction so bond lengths stay 1.09 Å.
  const near = open(-2.1, -0.15);
  const hostOf: Record<string, string> = { H1a: "C1", H1b: "C1", H2: "C2", H3: "C3", H4a: "C4", H4b: "C4", H5a: "C5", H5b: "C5", H6a: "C6", H6b: "C6" };
  const ts: Frame = {};
  for (const k of Object.keys(prod)) if (!(k in hostOf)) ts[k] = mix(near[k] as V, prod[k] as V, 0.35);
  for (const [h, c] of Object.entries(hostOf)) {
    const dNear = norm(sub(near[h] as V, near[c] as V));
    const dProd = norm(sub(prod[h] as V, prod[c] as V));
    ts[h] = at(ts[c] as V, mix(dNear, dProd, 0.35), CH);
  }
  return build(
    els,
    [f0, f1, ts, prod],
    [
      ["C1", "C2", [2, 2, 1.5, 1]],
      ["C2", "C3", [1, 1, 1.5, 2]],
      ["C3", "C4", [2, 2, 1.5, 1]],
      ["C5", "C6", [2, 2, 1.5, 1]],
      ["C1", "C6", [0, 0, 0.5, 1]],
      ["C4", "C5", [0, 0, 0.5, 1]],
      ...(["H1a:C1", "H1b:C1", "H2:C2", "H3:C3", "H4a:C4", "H4b:C4", "H5a:C5", "H5b:C5", "H6a:C6", "H6b:C6"].map((s) => {
        const [h, c] = s.split(":") as [string, string];
        return [c, h, same(4, 1)] as BondSpec;
      })),
    ],
    ["s-cis Butadiene + ethene", "Suprafacial approach", "Aromatic-like cyclic transition state", "Cyclohexene"],
  );
}

/* =====================================================================
 * Fischer esterification — acetic acid + methanol, H⁺ catalyst
 * ===================================================================== */
function fischer(): Scene3D {
  const els: Record<string, Element> = { Cm: "C", C: "Cc", O1: "O", O2: "O", H2: "H", Hcat: "H", Om: "O", Hm: "H", Cm2: "C" };
  const C: V = [0, 0, 0];
  const planar = (hcatBonded: boolean, hcatFar: number, Om: V): Frame => {
    const Cm: V = [-1.5, 0, 0];
    const O1 = at(C, [0.5, 0.866, 0], hcatBonded ? 1.28 : COd);
    const O2 = at(C, [0.5, -0.866, 0], 1.34);
    const Hcat = hcatBonded ? at(O1, [-0.5, 0.866, 0], OHl) : at(O1, [-0.5, 0.866, 0], hcatFar);
    const [hmd, cmd] = bentPair(Om, C, [1, 0, 0]);
    return { Cm, C, O1, O2, H2: at(O2, [1, 0, 0], OHl), Hcat, Om, Hm: at(Om, hmd, OHl), Cm2: at(Om, cmd, CO) };
  };
  const tetra = (transferred: boolean): Frame => {
    const Z: V = [0, 0, 1];
    const Om = at(C, Z, 1.45);
    const [cmd, o2d, o1d] = trio(Z, -1 / 3, 90);
    const Cm = at(C, cmd, 1.52);
    const O1 = at(C, o1d, 1.4);
    const O2 = at(C, o2d, 1.43);
    const Hcat = at(O1, o1d, OHl);
    const [h2d, hm2d] = trio(sub(C, O2), -1 / 3, 60);
    const H2 = at(O2, h2d, OHl);
    const [hmd, cmd2] = bentPair(Om, C, [1, 0, 0]);
    const Hm = transferred ? at(O2, hm2d, OHl) : at(Om, hmd, OHl);
    return { Cm, C, O1, O2, H2, Hcat, Om, Hm, Cm2: at(Om, cmd2, CO) };
  };
  const leave = (hcatGone: boolean): Frame => {
    const Z: V = [0, 0, 1];
    const Om = at(C, Z, 1.33);
    const O1 = at(C, [0.866, 0, -0.5], hcatGone ? COd : 1.28);
    const Cm = at(C, [-0.866, 0, -0.5], 1.5);
    const Hcat = at(O1, [0.866, 0, 0.5], hcatGone ? 2.6 : OHl);
    const [, o2d] = trio(Z, -1 / 3, 90);
    const O2 = at(C, o2d, 4.0);
    const [w1, w2] = bentPair(O2, C, [0, 0, 1]);
    const [, cmd2] = bentPair(Om, C, [1, 0, 0]);
    return { Cm, C, O1, O2, H2: at(O2, w1, OHl), Hm: at(O2, w2, OHl), Hcat, Om, Cm2: at(Om, cmd2, CO) };
  };
  return build(
    els,
    [planar(false, 2.2, [0.3, 0, 3.3]), planar(true, 0, [0.2, 0, 2.7]), tetra(false), tetra(true), leave(false), leave(true)],
    [
      ["C", "Cm", same(6, 1)],
      ["C", "O1", [2, 2, 1, 1, 2, 2]],
      ["O1", "Hcat", [0, 1, 1, 1, 1, 0]],
      ["C", "O2", [1, 1, 1, 1, 0, 0]],
      ["O2", "H2", same(6, 1)],
      ["O2", "Hm", [0, 0, 0, 1, 1, 1]],
      ["Om", "Hm", [1, 1, 1, 0, 0, 0]],
      ["C", "Om", [0, 0, 1, 1, 1, 1]],
      ["Om", "Cm2", same(6, 1)],
    ],
    ["Acetic acid + methanol + H⁺", "Protonated carbonyl (more electrophilic)", "Tetrahedral intermediate", "Proton transfer makes –OH₂⁺", "Water leaves, C=O re-forms", "Methyl acetate + H⁺ regenerated"],
  );
}

/* =====================================================================
 * Claisen condensation — two methyl acetates, methoxide base
 * ===================================================================== */
function claisen(): Scene3D {
  const els: Record<string, Element> = {
    Ca: "Cc", Ha1: "H", Ha2: "H", Ha3: "H", C1: "Cc", O1: "O", O2: "O", Me1: "C",
    Cb: "C", C3: "Cc", O3: "O", O4: "O", Me3: "C", Ob: "O", Mb: "C",
  };
  const X: V = [1, 0, 0];
  const C1: V = [0, 0, 0];
  const O2 = at(C1, [0.5, -0.866, 0], 1.34);
  const Me1 = at(O2, [1, 0, 0], CO);
  const [c3Dir] = trio(X, -1 / 3, 270);
  // second ester, its plane perpendicular to the attack direction
  const esterB = (Ca: V, dist: number) => {
    const C3 = at(Ca, c3Dir, dist);
    const [o3, o4, cb] = trio(c3Dir, 0, 0);
    const O4 = at(C3, o4, 1.34);
    return { C3, O3: at(C3, o3, COd), O4, Me3: at(O4, add(o4, mul(c3Dir, 0.4)), CO), Cb: at(C3, cb, 1.5) };
  };
  const f0 = (): Frame => {
    const Ca: V = [-CC, 0, 0];
    const [h1, h2, h3] = trio(X, -1 / 3, 90);
    const Ha1 = at(Ca, h1, CH);
    const Ob = at(Ha1, h1, 1.9);
    return { Ca, Ha1, Ha2: at(Ca, h2, CH), Ha3: at(Ca, h3, CH), C1, O1: at(C1, [0.5, 0.866, 0], COd), O2, Me1, ...esterB(Ca, 4.4), Ob, Mb: at(Ob, [-0.9, 0.1, 0.4], CO) };
  };
  const f1 = (): Frame => {
    const Ca: V = [-CCd, 0, 0];
    const Ob: V = [-2.4, 0.1, 3.2];
    return {
      Ca, Ha1: at(Ob, sub(Ca, Ob), OHl), Ha2: at(Ca, [-0.5, 0.866, 0], CH), Ha3: at(Ca, [-0.5, -0.866, 0], CH),
      C1, O1: at(C1, [0.5, 0.866, 0], 1.3), O2, Me1, ...esterB(Ca, 3.5), Ob, Mb: at(Ob, [-0.9, 0.1, 0.4], CO),
    };
  };
  const tetra = (): Frame => {
    const Ca: V = [-CC, 0, 0];
    const [c3d, h2d, h3d] = trio(X, -1 / 3, 270);
    const C3 = at(Ca, c3d, CC);
    const [o3d, cbd, o4d] = trio(sub(Ca, C3), -1 / 3, 0);
    const O4 = at(C3, o4d, CO);
    const Ob: V = [-2.4, 0.1, 3.2];
    return {
      Ca, Ha1: at(Ob, sub(Ca, Ob), OHl), Ha2: at(Ca, h2d, CH), Ha3: at(Ca, h3d, CH),
      C1, O1: at(C1, [0.5, 0.866, 0], COd), O2, Me1,
      C3, O3: at(C3, o3d, 1.38), Cb: at(C3, cbd, 1.52), O4, Me3: at(O4, o4d, CO), Ob, Mb: at(Ob, [-0.9, 0.1, 0.4], CO),
    };
  };
  const ketoEster = (deprotonated: boolean): Frame => {
    const Ca: V = [-CC, 0, 0];
    const [c3d, h2d, h3d] = trio(X, -1 / 3, 270);
    const C3 = at(Ca, c3d, deprotonated ? 1.42 : CC);
    const [p1, p2] = sp2pair(C3, Ca, [0, 0, 1]);
    const O3 = at(C3, p1, COd);
    const Cb = at(C3, p2, 1.5);
    const Ha2start = at(Ca, h2d, CH);
    const O4 = at(Ha2start, h2d, deprotonated ? 1.9 : 2.3);
    const Ha2 = deprotonated ? at(O4, sub(Ca, O4), OHl) : Ha2start;
    const Ob: V = [-2.4, 0.1, 3.2];
    const Ha3 = deprotonated ? at(Ca, sp2third(Ca, C1, C3), CH) : at(Ca, h3d, CH);
    return {
      Ca, Ha1: at(Ob, sub(Ca, Ob), OHl), Ha2, Ha3, C1, O1: at(C1, [0.5, 0.866, 0], deprotonated ? 1.27 : COd), O2, Me1,
      C3, O3, Cb, O4, Me3: at(O4, h2d, CO), Ob, Mb: at(Ob, [-0.9, 0.1, 0.4], CO),
    };
  };
  return build(
    els,
    [f0(), f1(), tetra(), ketoEster(false), ketoEster(true)],
    [
      ["C1", "O1", [2, 1, 2, 2, 1.5]],
      ["C1", "Ca", [1, 2, 1, 1, 1.5]],
      ["Ca", "Ha1", [1, 0, 0, 0, 0]],
      ["Ob", "Ha1", [0, 1, 1, 1, 1]],
      ["Ca", "Ha2", [1, 1, 1, 1, 0]],
      ["O4", "Ha2", [0, 0, 0, 0, 1]],
      ["Ca", "Ha3", same(5, 1)],
      ["C1", "O2", same(5, 1)],
      ["O2", "Me1", same(5, 1)],
      ["Ob", "Mb", same(5, 1)],
      ["Ca", "C3", [0, 0, 1, 1, 1.5]],
      ["C3", "O3", [2, 2, 1, 2, 1.5]],
      ["C3", "O4", [1, 1, 1, 0, 0]],
      ["O4", "Me3", same(5, 1)],
      ["C3", "Cb", same(5, 1)],
    ],
    ["Methyl acetate + methoxide", "Ester enolate + methanol", "Enolate adds to the second ester", "Methoxide expelled → β-keto ester", "Deprotonation drives the equilibrium"],
  );
}

/* =====================================================================
 * Wittig — Ph₃P=CH₂ + acetaldehyde → propene + Ph₃P=O
 * ===================================================================== */
function wittig(): Scene3D {
  const els: Record<string, Element> = { P: "P", Ph1: "C", Ph2: "C", Ph3: "C", Cy: "Cc", Hy1: "H", Hy2: "H", Cc: "Cc", O: "O", Hc: "H", Me: "C" };
  const phenyls = (P: V, axis: V, phase: number) => {
    const [a, b, c] = trio(axis, -1 / 3, phase);
    return { Ph1: at(P, a, CP), Ph2: at(P, b, CP), Ph3: at(P, c, CP) };
  };
  const apart = (z: number): Frame => {
    const Cy: V = [-0.77, 0, z];
    const P = at(Cy, [0, 1, 0], 1.72);
    const Cc: V = [0.77, 0, -z];
    const O = at(Cc, [0, 1, 0], COd);
    return {
      P, ...phenyls(P, [0, -1, 0], 90), Cy, Hy1: at(Cy, [-0.866, -0.5, 0], CH), Hy2: at(Cy, [0.866, -0.5, 0], CH),
      Cc, O, Hc: at(Cc, [-0.866, -0.5, 0], CH), Me: at(Cc, [0.866, -0.5, 0], 1.5),
    };
  };
  const ring = (): Frame => {
    const Cy: V = [-0.77, 0, 0];
    const Cc: V = [0.77, 0, 0];
    const O: V = [0.77, 1.5, 0];
    const P: V = [-0.77, 1.8, 0];
    const [y1, y2] = sp3pair(Cy, P, Cc);
    const [c1, c2] = sp3pair(Cc, Cy, O);
    const ringCentre: V = [0, 0.85, 0];
    return {
      P, ...phenyls(P, sub(ringCentre, P), 30), Cy, Hy1: at(Cy, y1, CH), Hy2: at(Cy, y2, CH),
      Cc, O, Hc: at(Cc, c1, CH), Me: at(Cc, c2, 1.5),
    };
  };
  const products = (): Frame => {
    const Cy: V = [-0.67, -1.1, 0.3];
    const Cc: V = [0.67, -1.1, 0.3];
    const P: V = [-0.7, 2.5, -0.4];
    const O = at(P, [0.55, 0.8, 0.2], PO);
    return {
      P, O, ...phenyls(P, sub(O, P), 0), Cy, Hy1: at(Cy, [-0.5, 0.866, 0], CH), Hy2: at(Cy, [-0.5, -0.866, 0], CH),
      Cc, Hc: at(Cc, [0.5, -0.866, 0], CH), Me: at(Cc, [0.5, 0.866, 0], 1.5),
    };
  };
  return build(
    els,
    [apart(2.3), apart(1.0), ring(), products()],
    [
      ["P", "Cy", [2, 1.5, 1, 0]],
      ["Cy", "Cc", [0, 0.5, 1, 2]],
      ["Cc", "O", [2, 1.5, 1, 0]],
      ["O", "P", [0, 0.5, 1, 2]],
      ["P", "Ph1", same(4, 1)],
      ["P", "Ph2", same(4, 1)],
      ["P", "Ph3", same(4, 1)],
      ["Cy", "Hy1", same(4, 1)],
      ["Cy", "Hy2", same(4, 1)],
      ["Cc", "Hc", same(4, 1)],
      ["Cc", "Me", same(4, 1)],
    ],
    ["Ylide + acetaldehyde", "[2+2] approach", "Oxaphosphetane", "Propene + Ph₃P=O"],
  );
}

/* =====================================================================
 * Friedel–Crafts acylation — benzene + CH₃COCl / AlCl₃
 * ===================================================================== */
function friedelCrafts(): Scene3D {
  const els: Record<string, Element> = {
    R1: "Cc", R2: "C", R3: "C", R4: "C", R5: "C", R6: "C", H1: "H", H2: "H", H3: "H", H4: "H", H5: "H", H6: "H",
    Cac: "Cc", Oac: "O", Mac: "C", Cl1: "Cl", Al: "Al", Cl2: "Cl", Cl3: "Cl", Cl4: "Cl",
  };
  const ringR = 1.39;
  const ring = (): Record<string, V> => {
    const out: Record<string, V> = {};
    for (let i = 0; i < 6; i++) {
      const a = deg(60 * i);
      out[`R${i + 1}`] = [ringR * Math.cos(a), ringR * Math.sin(a), 0];
      out[`H${i + 1}`] = [(ringR + CH) * Math.cos(a), (ringR + CH) * Math.sin(a), 0];
    }
    return out;
  };
  const alcl = (Al: V, toward: V, planar: boolean) => {
    const [c1, c2, c3] = trio(sub(toward, Al), planar ? 0 : -1 / 3, 0);
    return { Al, Cl2: at(Al, c1, AlCl), Cl3: at(Al, c2, AlCl), Cl4: at(Al, c3, AlCl) };
  };
  const f0 = (): Frame => {
    const Cac: V = [4.5, 0.6, 1.4];
    const Oac = at(Cac, [0.3, 0.9, 0.3], COd);
    const Mac = at(Cac, [0.95, -0.3, 0.1], 1.5);
    const Cl1 = at(Cac, [-0.35, -0.55, -0.76], CCl);
    const Al = at(Cl1, [0.1, -0.5, -0.86], 2.8);
    return { ...ring(), Cac, Oac, Mac, Cl1, ...alcl(Al, Cl1, true) };
  };
  const f1 = (): Frame => {
    const Cac: V = [1.5, 0.3, 2.5];
    const d: V = norm([0.3, 0.95, 0]);
    const Oac = at(Cac, d, 1.12);
    const Mac = at(Cac, mul(d, -1), 1.45);
    const Al: V = [4.9, -2.2, -2.0];
    const Cl1 = at(Al, [-0.3, 0.45, 0.84], AlCl);
    return { ...ring(), Cac, Oac, Mac, Cl1, ...alcl(Al, Cl1, false) };
  };
  const f2 = (): Frame => {
    const r = ring();
    const R1 = r["R1"] as V;
    const out = norm([0.577, 0, 0.816]);
    const Cac = at(R1, out, 1.52);
    const H1 = at(R1, [0.577, 0, -0.816], CH);
    const [up, side] = sp2pair(Cac, R1, [0, 1, 0]);
    const Oac = at(Cac, up, COd);
    const Mac = at(Cac, side, 1.5);
    const Al: V = [4.9, -2.0, -3.1];
    const Cl1 = at(Al, sub(H1, Al), AlCl);
    return { ...r, H1, Cac, Oac, Mac, Cl1, ...alcl(Al, Cl1, false) };
  };
  const f3 = (): Frame => {
    const r = ring();
    const R1 = r["R1"] as V;
    const Cac = at(R1, [1, 0, 0], 1.5);
    const Oac = at(Cac, [0.5, 0.866, 0], COd);
    const Mac = at(Cac, [0.5, -0.866, 0], 1.5);
    const Al: V = [4.8, -1.7, -2.8];
    const Cl1: V = [3.3, -0.9, -2.2];
    const H1 = at(Cl1, [-0.45, 0.4, 0.8], 1.28);
    return { ...r, H1, Cac, Oac, Mac, Cl1, ...alcl(Al, Cl1, true) };
  };
  const ringBonds: BondSpec[] = [
    ["R1", "R2", [2, 2, 1, 1]],
    ["R2", "R3", [1, 1, 2, 2]],
    ["R3", "R4", [2, 2, 1, 1]],
    ["R4", "R5", [1, 1, 2, 2]],
    ["R5", "R6", [2, 2, 1, 1]],
    ["R6", "R1", [1, 1, 1, 2]],
  ];
  return build(
    els,
    [f0(), f1(), f2(), f3()],
    [
      ...ringBonds,
      ...[2, 3, 4, 5, 6].map((i) => [`R${i}`, `H${i}`, same(4, 1)] as BondSpec),
      ["R1", "H1", [1, 1, 1, 0]],
      ["Cl1", "H1", [0, 0, 0, 1]],
      ["R1", "Cac", [0, 0, 1, 1]],
      ["Cac", "Oac", [2, 3, 2, 2]],
      ["Cac", "Mac", same(4, 1)],
      ["Cac", "Cl1", [1, 0, 0, 0]],
      ["Al", "Cl1", [0, 1, 1, 0]],
      ["Al", "Cl2", same(4, 1)],
      ["Al", "Cl3", same(4, 1)],
      ["Al", "Cl4", same(4, 1)],
    ],
    ["Benzene + acetyl chloride + AlCl₃", "Acylium ion CH₃C≡O⁺ + AlCl₄⁻", "σ-complex (arenium ion)", "Acetophenone + HCl + AlCl₃"],
  );
}

export const scenes3d = {
  sn2: sn2(),
  sn1: sn1(),
  e1: e1(),
  e2: e2(),
  aldol: aldol(),
  grignard: rotX(grignard(), -25),
  ozonolysis: rotX(ozonolysis(), -90),
  "diels-alder": rotX(dielsAlder(), -62),
  "fischer-esterification": rotX(fischer(), -50),
  claisen: claisen(),
  wittig: rotX(wittig(), -40),
  "friedel-crafts-acylation": rotX(friedelCrafts(), -62),
} satisfies Record<string, Scene3D>;

export type Scene3DSlug = keyof typeof scenes3d;
// keep the helper exported for tests / future scenes
export const geometry = { v, add, sub, mul, dot, cross, len, norm, mix, at, trio, sp3pair, sp2third, sp2pair, bentPair };
