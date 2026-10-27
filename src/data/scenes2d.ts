/*
 * 2D mechanism scenes (400 × 240 viewBox). Each atom has one frame per keyframe
 * (steps + 1); bonds carry a style per keyframe; curly arrows belong to the step
 * during which they are drawn and use that step's starting coordinates.
 */
import type { AtomFrame, Scene2D } from "./reactions";

const f = (x: number, y: number, label?: string, charge?: string): AtomFrame => ({ x, y, label, charge });
const hid = (x: number, y: number): AtomFrame => ({ x, y, hidden: true });
/** skeletal vertex (no label) */
const k = (x: number, y: number, charge?: string): AtomFrame => ({ x, y, label: "", charge });
const rep = <T,>(n: number, v: T): T[] => Array<T>(n).fill(v);

/* ---------- SN2: hydroxide + bromomethane ---------- */
export const sn2Scene: Scene2D = {
  atoms: [
    { id: "O", frames: [f(60, 120, "HO", "−"), f(110, 120, "HO", "−"), f(118, 120, "HO", "δ−"), f(122, 120, "HO")] },
    { id: "C", frames: [f(200, 120, "C"), f(200, 120, "C"), f(200, 120, "C"), f(200, 120, "C")] },
    { id: "H1", frames: [f(182, 66, "H"), f(182, 66, "H"), f(200, 60, "H"), f(218, 66, "H")] },
    { id: "H2", frames: [f(164, 156, "H"), f(164, 156, "H"), f(176, 172, "H"), f(236, 156, "H")] },
    { id: "H3", frames: [f(208, 176, "H"), f(208, 176, "H"), f(224, 172, "H"), f(192, 176, "H")] },
    { id: "Br", frames: [f(285, 120, "Br"), f(288, 120, "Br"), f(286, 120, "Br", "δ−"), f(345, 120, "Br", "−")] },
  ],
  bonds: [
    { a: "O", b: "C", frames: ["none", "none", "partial", "single"] },
    { a: "C", b: "Br", frames: ["single", "single", "partial", "none"] },
    { a: "C", b: "H1", frames: ["single", "single", "single", "single"] },
    { a: "C", b: "H2", frames: ["wedge", "wedge", "single", "wedge"] },
    { a: "C", b: "H3", frames: ["dash", "dash", "single", "dash"] },
  ],
  arrows: [
    { step: 0, d: "M 72 104 Q 130 70 186 108" },
    { step: 0, d: "M 244 128 Q 268 156 290 134" },
  ],
  annotations: [{ frame: 2, x: 330, y: 60, text: "‡" }],
};

/* ---------- SN1: tert-butyl bromide + water ---------- */
export const sn1Scene: Scene2D = {
  atoms: [
    { id: "C", frames: [f(190, 120, "C"), f(190, 120, "C", "+"), f(190, 120, "C"), f(190, 120, "C")] },
    { id: "M1", frames: [f(190, 60, "CH₃"), f(190, 58, "CH₃"), f(196, 60, "CH₃"), f(196, 60, "CH₃")] },
    { id: "M2", frames: [f(140, 152, "H₃C"), f(134, 150, "H₃C"), f(150, 168, "H₃C"), f(150, 168, "H₃C")] },
    { id: "M3", frames: [f(236, 160, "CH₃"), f(246, 150, "CH₃"), f(240, 168, "CH₃"), f(240, 168, "CH₃")] },
    { id: "Br", frames: [f(268, 100, "Br"), f(340, 70, "Br", "−"), f(345, 66, "Br", "−"), f(345, 66, "Br", "−")] },
    { id: "O", frames: [f(50, 120, "H₂O"), f(55, 120, "H₂O"), f(112, 112, "H₂O", "+"), f(112, 112, "HO")] },
    { id: "W", frames: [f(330, 200, "H₂O"), f(330, 200, "H₂O"), f(300, 196, "H₂O"), f(320, 200, "H₃O", "+")] },
  ],
  bonds: [
    { a: "C", b: "M1", frames: ["single", "single", "single", "single"] },
    { a: "C", b: "M2", frames: ["wedge", "single", "wedge", "wedge"] },
    { a: "C", b: "M3", frames: ["dash", "single", "dash", "dash"] },
    { a: "C", b: "Br", frames: ["single", "none", "none", "none"] },
    { a: "C", b: "O", frames: ["none", "none", "single", "single"] },
  ],
  arrows: [
    { step: 0, d: "M 226 104 Q 250 78 272 88" },
    { step: 1, d: "M 70 106 Q 120 84 176 112" },
    { step: 2, d: "M 288 188 Q 210 200 132 128" },
  ],
};

/* ---------- E1: tert-butyl bromide → 2-methylpropene ---------- */
export const e1Scene: Scene2D = {
  atoms: [
    { id: "C", frames: [f(200, 120, "C"), f(200, 120, "C", "+"), f(200, 120, "C")] },
    { id: "M1", frames: [f(200, 60, "CH₃"), f(200, 58, "CH₃"), f(200, 60, "CH₃")] },
    { id: "M2", frames: [f(146, 150, "H₃C"), f(142, 150, "H₃C"), f(146, 152, "H₃C")] },
    { id: "Cb", frames: [f(248, 154, "CH₂"), f(254, 152, "CH₂"), f(254, 154, "CH₂")] },
    { id: "Hb", frames: [f(296, 150, "H"), f(300, 150, "H"), hid(332, 176)] },
    { id: "Br", frames: [f(262, 92, "Br"), f(345, 50, "Br", "−"), f(350, 46, "Br", "−")] },
    { id: "O", frames: [f(340, 206, "H₂O"), f(336, 190, "H₂O"), f(336, 182, "H₃O", "+")] },
  ],
  bonds: [
    { a: "C", b: "M1", frames: ["single", "single", "single"] },
    { a: "C", b: "M2", frames: ["wedge", "single", "single"] },
    { a: "C", b: "Cb", frames: ["dash", "single", "double"] },
    { a: "C", b: "Br", frames: ["single", "none", "none"] },
    { a: "Cb", b: "Hb", frames: ["single", "single", "none"] },
  ],
  arrows: [
    { step: 0, d: "M 232 104 Q 260 72 284 82" },
    { step: 1, d: "M 320 182 Q 296 172 304 160" },
    { step: 1, d: "M 276 150 Q 262 170 232 142" },
  ],
};

/* ---------- E2: hydroxide + 2-bromopropane ---------- */
export const e2Scene: Scene2D = {
  atoms: [
    { id: "O", frames: [f(48, 50, "HO", "−"), f(78, 52, "HO", "−"), f(70, 50, "HO", "δ−"), f(66, 50, "H₂O")] },
    { id: "Hb", frames: [f(118, 72, "H"), f(118, 72, "H"), f(98, 60, "H"), hid(80, 52)] },
    { id: "Cb", frames: [f(150, 115, "C"), f(150, 115, "C"), f(150, 115, "C"), f(150, 115, "C")] },
    { id: "Ca", frames: [f(240, 115, "C"), f(240, 115, "C"), f(240, 115, "C"), f(240, 115, "C")] },
    { id: "R1", frames: [f(104, 150, "H"), f(104, 150, "H"), f(110, 150, "H"), f(112, 150, "H")] },
    { id: "R2", frames: [f(150, 172, "H"), f(150, 172, "H"), f(112, 84, "H"), f(112, 80, "H")] },
    { id: "R3", frames: [f(286, 72, "CH₃"), f(286, 72, "CH₃"), f(282, 80, "CH₃"), f(280, 80, "CH₃")] },
    { id: "R4", frames: [f(240, 58, "H"), f(240, 58, "H"), f(276, 152, "H"), f(280, 150, "H")] },
    { id: "Br", frames: [f(270, 172, "Br"), f(270, 172, "Br"), f(278, 182, "Br", "δ−"), f(330, 205, "Br", "−")] },
  ],
  bonds: [
    { a: "O", b: "Hb", frames: ["none", "partial", "single", "none"] },
    { a: "Hb", b: "Cb", frames: ["single", "single", "partial", "none"] },
    { a: "Cb", b: "Ca", frames: ["single", "single", "double", "double"] },
    { a: "Ca", b: "Br", frames: ["single", "single", "partial", "none"] },
    { a: "Cb", b: "R1", frames: ["single", "single", "single", "single"] },
    { a: "Cb", b: "R2", frames: ["single", "single", "single", "single"] },
    { a: "Ca", b: "R3", frames: ["single", "single", "single", "single"] },
    { a: "Ca", b: "R4", frames: ["single", "single", "single", "single"] },
  ],
  arrows: [
    { step: 0, d: "M 64 40 Q 92 30 112 62" },
    { step: 1, d: "M 130 86 Q 180 64 198 108" },
    { step: 2, d: "M 258 140 Q 300 140 284 166" },
  ],
};

/* ---------- Aldol condensation: two acetaldehydes ---------- */
export const aldolScene: Scene2D = {
  atoms: [
    { id: "B", frames: [f(40, 196, "HO", "−"), f(44, 206, "H₂O"), f(44, 206, "H₂O"), f(44, 206, "HO", "−")] },
    { id: "Ha", frames: [f(90, 178, "H"), hid(60, 200), hid(60, 200), hid(60, 200)] },
    { id: "Ca", frames: [f(118, 150, "H₂C"), f(118, 150, "HC", "−"), f(118, 150, "CH₂"), f(118, 150, "CH")] },
    { id: "C1", frames: [f(162, 120, "CH"), f(162, 120, "CH"), f(162, 120, "CH"), f(162, 120, "CH")] },
    { id: "O1", frames: [f(162, 68, "O"), f(162, 68, "O", "−"), f(162, 68, "O"), f(162, 68, "O")] },
    { id: "C2", frames: [f(300, 120, "CH"), f(262, 150, "CH"), f(170, 186, "CH"), f(170, 186, "CH")] },
    { id: "O2", frames: [f(300, 68, "O"), f(262, 98, "O"), f(216, 212, "O", "−"), f(300, 226, "H₂O")] },
    { id: "Me", frames: [f(346, 146, "CH₃"), f(308, 176, "CH₃"), f(120, 214, "H₃C"), f(120, 214, "H₃C")] },
  ],
  bonds: [
    { a: "Ca", b: "Ha", frames: ["single", "none", "none", "none"] },
    { a: "Ca", b: "C1", frames: ["single", "double", "single", "single"] },
    { a: "C1", b: "O1", frames: ["double", "single", "double", "double"] },
    { a: "C2", b: "O2", frames: ["double", "double", "single", "none"] },
    { a: "C2", b: "Me", frames: ["single", "single", "single", "single"] },
    { a: "Ca", b: "C2", frames: ["none", "none", "single", "double"] },
  ],
  arrows: [
    { step: 0, d: "M 56 186 Q 70 170 82 176" },
    { step: 0, d: "M 102 166 Q 128 158 140 140" },
    { step: 0, d: "M 172 96 Q 188 84 178 76" },
    { step: 1, d: "M 136 140 Q 170 150 248 150" },
    { step: 1, d: "M 272 124 Q 286 110 274 104" },
    { step: 2, d: "M 60 196 Q 90 180 104 164" },
    { step: 2, d: "M 128 164 Q 144 184 156 182" },
    { step: 2, d: "M 190 198 Q 210 220 214 226" },
  ],
};

/* ---------- Grignard: CH₃MgBr + formaldehyde ---------- */
export const grignardScene: Scene2D = {
  atoms: [
    { id: "Mg", frames: [f(66, 120, "BrMg"), f(236, 36, "BrMg", "+"), f(330, 196, "MgBr", "+")] },
    { id: "Cn", frames: [f(122, 120, "CH₃"), f(170, 152, "H₃C"), f(170, 152, "H₃C")] },
    { id: "C", frames: [f(222, 120, "C"), f(222, 120, "C"), f(222, 120, "C")] },
    { id: "O", frames: [f(222, 66, "O"), f(222, 66, "O", "−"), f(222, 66, "OH")] },
    { id: "H1", frames: [f(256, 150, "H"), f(260, 150, "H"), f(260, 150, "H")] },
    { id: "H2", frames: [f(188, 150, "H"), f(216, 172, "H"), f(216, 172, "H")] },
    { id: "W", frames: [f(330, 60, "H₃O", "+"), f(330, 60, "H₃O", "+"), f(336, 44, "H₂O")] },
  ],
  bonds: [
    { a: "Mg", b: "Cn", frames: ["single", "none", "none"] },
    { a: "Cn", b: "C", frames: ["none", "single", "single"] },
    { a: "C", b: "O", frames: ["double", "single", "single"] },
    { a: "C", b: "H1", frames: ["single", "single", "single"] },
    { a: "C", b: "H2", frames: ["single", "wedge", "wedge"] },
    { a: "O", b: "Mg", frames: ["none", "partial", "none"] },
  ],
  arrows: [
    { step: 0, d: "M 96 108 Q 150 70 206 108" },
    { step: 0, d: "M 232 92 Q 248 80 234 72" },
    { step: 1, d: "M 240 60 Q 276 36 312 56" },
  ],
};

/* ---------- Ozonolysis: 2-butene + O₃ ---------- */
export const ozonolysisScene: Scene2D = {
  atoms: [
    { id: "C1", frames: [f(160, 140, "CH"), f(160, 140, "CH"), f(112, 140, "CH"), f(160, 140, "CH"), f(100, 140, "CH")] },
    { id: "C2", frames: [f(240, 140, "CH"), f(240, 140, "CH"), f(272, 140, "CH"), f(240, 140, "CH"), f(300, 140, "CH")] },
    { id: "M1", frames: [f(112, 170, "H₃C"), f(112, 172, "H₃C"), f(64, 170, "H₃C"), f(112, 172, "H₃C"), f(52, 170, "H₃C")] },
    { id: "M2", frames: [f(288, 170, "CH₃"), f(288, 172, "CH₃"), f(320, 170, "CH₃"), f(288, 172, "CH₃"), f(348, 170, "CH₃")] },
    { id: "Oa", frames: [f(158, 60, "O", "−"), f(160, 84, "O"), f(112, 86, "O"), f(200, 182, "O"), f(100, 86, "O")] },
    { id: "Ob", frames: [f(200, 36, "O", "+"), f(200, 58, "O"), f(316, 70, "O", "−"), f(170, 82, "O"), f(336, 72, "O")] },
    { id: "Oc", frames: [f(242, 60, "O"), f(240, 84, "O"), f(272, 86, "O", "+"), f(230, 82, "O"), f(300, 86, "O")] },
    { id: "S", frames: [f(340, 210, "Me₂S"), f(340, 210, "Me₂S"), f(340, 210, "Me₂S"), f(200, 28, "Me₂S"), f(336, 30, "Me₂S")] },
  ],
  bonds: [
    { a: "C1", b: "C2", frames: ["double", "single", "none", "none", "none"] },
    { a: "C1", b: "M1", frames: rep(5, "single") },
    { a: "C2", b: "M2", frames: rep(5, "single") },
    { a: "Oa", b: "Ob", frames: ["single", "single", "none", "none", "none"] },
    { a: "Ob", b: "Oc", frames: ["double", "single", "single", "single", "none"] },
    { a: "C1", b: "Oa", frames: ["none", "single", "double", "single", "double"] },
    { a: "C2", b: "Oc", frames: ["none", "single", "double", "single", "double"] },
    { a: "C1", b: "Ob", frames: ["none", "none", "none", "single", "none"] },
    { a: "C2", b: "Oa", frames: ["none", "none", "none", "single", "none"] },
    { a: "S", b: "Ob", frames: ["none", "none", "none", "none", "double"] },
  ],
  arrows: [
    { step: 0, d: "M 196 128 Q 176 120 164 82" },
    { step: 0, d: "M 150 54 Q 170 30 194 36" },
    { step: 0, d: "M 232 50 Q 238 90 238 118" },
    { step: 1, d: "M 182 72 Q 174 100 170 118" },
    { step: 1, d: "M 200 140 Q 220 112 238 100" },
    { step: 1, d: "M 222 72 Q 252 68 260 100" },
    { step: 2, d: "M 300 60 Q 240 24 180 120" },
    { step: 2, d: "M 124 112 Q 130 124 160 132" },
    { step: 2, d: "M 270 112 Q 262 128 250 134" },
    { step: 3, d: "M 190 42 Q 176 58 176 70" },
    { step: 3, d: "M 184 96 Q 170 110 166 128" },
    { step: 3, d: "M 206 166 Q 190 160 182 148" },
    { step: 3, d: "M 234 158 Q 236 140 236 128" },
  ],
};

/* ---------- Diels–Alder: butadiene + ethene (skeletal) ---------- */
const hex = { C1: [157, 95], C2: [157, 145], C3: [200, 170], C4: [243, 145], C5: [243, 95], C6: [200, 70] } as const;
const sh = (p: readonly [number, number], dx: number, dy: number, charge?: string) => k(p[0] + dx, p[1] + dy, charge);
export const dielsAlderScene: Scene2D = {
  atoms: [
    { id: "C1", frames: [sh(hex.C1, -44, 22), sh(hex.C1, -20, 10), sh(hex.C1, 0, 0)] },
    { id: "C2", frames: [sh(hex.C2, -44, 22), sh(hex.C2, -20, 10), sh(hex.C2, 0, 0)] },
    { id: "C3", frames: [sh(hex.C3, -44, 22), sh(hex.C3, -20, 10), sh(hex.C3, 0, 0)] },
    { id: "C4", frames: [sh(hex.C4, -44, 22), sh(hex.C4, -20, 10), sh(hex.C4, 0, 0)] },
    { id: "C5", frames: [sh(hex.C5, 54, -32), sh(hex.C5, 25, -16), sh(hex.C5, 0, 0)] },
    { id: "C6", frames: [sh(hex.C6, 54, -32), sh(hex.C6, 25, -16), sh(hex.C6, 0, 0)] },
  ],
  bonds: [
    { a: "C1", b: "C2", frames: ["double", "double", "single"] },
    { a: "C2", b: "C3", frames: ["single", "single", "double"] },
    { a: "C3", b: "C4", frames: ["double", "double", "single"] },
    { a: "C5", b: "C6", frames: ["double", "double", "single"] },
    { a: "C1", b: "C6", frames: ["none", "none", "single"] },
    { a: "C4", b: "C5", frames: ["none", "none", "single"] },
  ],
  arrows: [
    { step: 1, d: "M 128 128 Q 112 66 206 48" },
    { step: 1, d: "M 196 184 Q 176 196 150 176" },
    { step: 1, d: "M 262 84 Q 276 118 246 130" },
  ],
  annotations: [{ frame: 1, x: 300, y: 196, text: "‡" }],
};

/* ---------- Fischer esterification: acetic acid + methanol ---------- */
export const fischerScene: Scene2D = {
  atoms: [
    { id: "Me", frames: [f(110, 120, "H₃C"), f(110, 120, "H₃C"), f(104, 96, "H₃C"), f(104, 96, "H₃C")] },
    { id: "C", frames: [f(160, 120, "C"), f(160, 120, "C"), f(160, 120, "C"), f(160, 120, "C")] },
    { id: "Ot", frames: [f(160, 66, "O"), f(160, 66, "O", "+"), f(160, 62, "OH"), f(160, 66, "O")] },
    { id: "Hc", frames: [f(192, 30, "H", "+"), f(190, 44, "H"), hid(160, 40), f(196, 30, "H", "+")] },
    { id: "Oh", frames: [f(200, 152, "OH"), f(200, 152, "OH"), f(122, 158, "OH"), f(70, 212, "H₂O")] },
    { id: "Om", frames: [f(300, 160, "O"), f(262, 160, "O"), f(212, 156, "O", "+"), f(210, 154, "O")] },
    { id: "Hm", frames: [f(282, 190, "H"), f(244, 190, "H"), f(200, 194, "H"), hid(70, 212)] },
    { id: "Mm", frames: [f(338, 180, "CH₃"), f(300, 180, "CH₃"), f(252, 188, "CH₃"), f(252, 186, "CH₃")] },
  ],
  bonds: [
    { a: "Me", b: "C", frames: rep(4, "single") },
    { a: "C", b: "Ot", frames: ["double", "double", "single", "double"] },
    { a: "Ot", b: "Hc", frames: ["none", "single", "none", "none"] },
    { a: "C", b: "Oh", frames: ["single", "single", "wedge", "none"] },
    { a: "C", b: "Om", frames: ["none", "none", "dash", "single"] },
    { a: "Om", b: "Hm", frames: ["single", "single", "single", "none"] },
    { a: "Om", b: "Mm", frames: rep(4, "single") },
  ],
  arrows: [
    { step: 0, d: "M 172 58 Q 184 44 186 38" },
    { step: 1, d: "M 262 148 Q 230 112 178 126" },
    { step: 1, d: "M 170 94 Q 186 82 172 72" },
    { step: 2, d: "M 196 184 Q 150 196 134 170" },
    { step: 2, d: "M 148 70 Q 134 84 148 102" },
    { step: 2, d: "M 142 142 Q 126 136 130 150" },
  ],
};

/* ---------- Claisen condensation: two methyl acetates ---------- */
export const claisenScene: Scene2D = {
  atoms: [
    { id: "B", frames: [f(40, 184, "MeO", "−"), f(44, 200, "MeOH"), f(44, 200, "MeOH"), f(44, 200, "MeOH"), f(44, 200, "MeOH")] },
    { id: "Ha", frames: [f(74, 148, "H"), hid(56, 196), hid(56, 196), hid(56, 196), hid(56, 196)] },
    { id: "Ca", frames: [f(102, 120, "H₂C"), f(102, 120, "HC", "−"), f(102, 120, "CH₂"), f(102, 120, "CH₂"), f(102, 120, "CH", "−")] },
    { id: "C1", frames: [f(144, 90, "C"), f(144, 90, "C"), f(144, 90, "C"), f(144, 90, "C"), f(144, 90, "C")] },
    { id: "O1", frames: [f(144, 40, "O"), f(144, 40, "O", "−"), f(144, 40, "O"), f(144, 40, "O"), f(144, 40, "O")] },
    { id: "OMe1", frames: [f(192, 116, "OMe"), f(192, 116, "OMe"), f(192, 116, "OMe"), f(192, 116, "OMe"), f(192, 116, "OMe")] },
    { id: "C2", frames: [f(284, 120, "C"), f(230, 166, "C"), f(150, 164, "C"), f(150, 164, "C"), f(150, 164, "C")] },
    { id: "O2", frames: [f(284, 68, "O"), f(230, 116, "O"), f(150, 214, "O", "−"), f(150, 214, "O"), f(150, 214, "O")] },
    { id: "OMe2", frames: [f(330, 146, "OMe"), f(276, 192, "OMe"), f(200, 190, "OMe"), f(300, 196, "MeO", "−"), f(300, 196, "MeOH")] },
    { id: "Me2", frames: [f(238, 146, "H₃C"), f(184, 192, "H₃C"), f(100, 190, "H₃C"), f(100, 190, "H₃C"), f(100, 190, "H₃C")] },
    { id: "Hx", frames: [hid(72, 104), hid(72, 104), hid(72, 104), f(70, 142, "H"), hid(290, 180)] },
  ],
  bonds: [
    { a: "Ca", b: "Ha", frames: ["single", "none", "none", "none", "none"] },
    { a: "Ca", b: "C1", frames: ["single", "double", "single", "single", "single"] },
    { a: "C1", b: "O1", frames: ["double", "single", "double", "double", "double"] },
    { a: "C1", b: "OMe1", frames: rep(5, "single") },
    { a: "C2", b: "O2", frames: ["double", "double", "single", "double", "double"] },
    { a: "C2", b: "OMe2", frames: ["single", "single", "single", "none", "none"] },
    { a: "C2", b: "Me2", frames: rep(5, "single") },
    { a: "Ca", b: "C2", frames: ["none", "none", "single", "single", "single"] },
    { a: "Ca", b: "Hx", frames: ["none", "none", "none", "single", "none"] },
  ],
  arrows: [
    { step: 0, d: "M 54 172 Q 62 156 68 154" },
    { step: 0, d: "M 86 138 Q 110 128 124 106" },
    { step: 0, d: "M 154 66 Q 168 54 156 46" },
    { step: 1, d: "M 118 108 Q 150 130 214 160" },
    { step: 1, d: "M 240 140 Q 254 128 242 122" },
    { step: 2, d: "M 142 206 Q 128 190 140 180" },
    { step: 2, d: "M 170 176 Q 186 196 192 184" },
    { step: 3, d: "M 286 190 Q 180 200 84 148" },
  ],
};

/* ---------- Wittig: Ph₃P=CH₂ + benzaldehyde ---------- */
export const wittigScene: Scene2D = {
  atoms: [
    { id: "P", frames: [f(96, 120, "Ph₃P"), f(140, 150, "Ph₃P"), f(112, 160, "Ph₃P")] },
    { id: "Cy", frames: [f(164, 120, "CH₂"), f(200, 150, "CH₂"), f(200, 150, "CH")] },
    { id: "C", frames: [f(270, 120, "C"), f(200, 90, "C"), f(248, 120, "C")] },
    { id: "O", frames: [f(270, 66, "O"), f(140, 90, "O"), f(84, 108, "O")] },
    { id: "Ph", frames: [f(312, 150, "Ph"), f(246, 72, "Ph"), f(292, 140, "Ph")] },
    { id: "H", frames: [f(304, 88, "H"), f(238, 112, "H"), f(258, 80, "H")] },
  ],
  bonds: [
    { a: "P", b: "Cy", frames: ["double", "single", "none"] },
    { a: "Cy", b: "C", frames: ["none", "single", "double"] },
    { a: "C", b: "O", frames: ["double", "single", "none"] },
    { a: "O", b: "P", frames: ["none", "single", "double"] },
    { a: "C", b: "Ph", frames: rep(3, "single") },
    { a: "C", b: "H", frames: rep(3, "single") },
  ],
  arrows: [
    { step: 0, d: "M 136 104 Q 196 60 254 108" },
    { step: 0, d: "M 280 92 Q 294 80 282 72" },
    { step: 1, d: "M 168 142 Q 190 136 200 122" },
    { step: 1, d: "M 176 90 Q 164 76 152 84" },
  ],
};

/* ---------- Friedel–Crafts acylation: benzene + CH₃COCl / AlCl₃ ---------- */
const ring = [
  [130, 88],
  [166, 109],
  [166, 151],
  [130, 172],
  [94, 151],
  [94, 109],
] as const;
export const friedelCraftsScene: Scene2D = {
  atoms: [
    ...ring.map((p, i) => ({
      id: `R${i}`,
      frames: [k(p[0], p[1]), k(p[0], p[1]), k(p[0], p[1], i === 4 ? "+" : undefined), k(p[0], p[1])],
    })),
    { id: "Hr", frames: [hid(190, 128), hid(190, 128), f(194, 130, "H"), hid(240, 206)] },
    { id: "Cac", frames: [f(270, 120, "C"), f(242, 120, "C"), f(208, 84, "C"), f(212, 82, "C")] },
    { id: "Oac", frames: [f(270, 66, "O"), f(242, 66, "O", "+"), f(226, 42, "O"), f(236, 44, "O")] },
    { id: "Mac", frames: [f(316, 146, "CH₃"), f(290, 146, "CH₃"), f(252, 100, "CH₃"), f(258, 100, "CH₃")] },
    { id: "Cl", frames: [f(226, 150, "Cl"), hid(218, 200), hid(218, 200), hid(218, 200)] },
    { id: "Al", frames: [f(240, 210, "AlCl₃"), f(228, 206, "AlCl₄", "−"), f(232, 200, "AlCl₄", "−"), f(300, 200, "HCl + AlCl₃")] },
  ],
  bonds: [
    { a: "R0", b: "R1", frames: ["double", "double", "single", "single"] },
    { a: "R1", b: "R2", frames: ["single", "single", "single", "double"] },
    { a: "R2", b: "R3", frames: ["double", "double", "double", "single"] },
    { a: "R3", b: "R4", frames: ["single", "single", "single", "double"] },
    { a: "R4", b: "R5", frames: ["double", "double", "single", "single"] },
    { a: "R5", b: "R0", frames: ["single", "single", "double", "double"] },
    { a: "R1", b: "Hr", frames: ["none", "none", "single", "none"] },
    { a: "R1", b: "Cac", frames: ["none", "none", "single", "single"] },
    { a: "Cac", b: "Oac", frames: ["double", "triple", "double", "double"] },
    { a: "Cac", b: "Mac", frames: rep(4, "single") },
    { a: "Cac", b: "Cl", frames: ["single", "none", "none", "none"] },
  ],
  arrows: [
    { step: 0, d: "M 224 164 Q 222 184 228 196" },
    { step: 0, d: "M 254 138 Q 246 150 236 144" },
    { step: 1, d: "M 150 92 Q 190 56 228 108" },
    { step: 1, d: "M 252 92 Q 266 80 254 70" },
    { step: 2, d: "M 214 190 Q 208 160 200 138" },
    { step: 2, d: "M 182 124 Q 170 132 160 118" },
  ],
};
