/* All reaction content lives here. Add a reaction by appending to `reactions`. */

export type Category = "Substitution" | "Elimination" | "Addition" | "Carbonyl" | "Pericyclic" | "Organometallic";
export const categories: Category[] = ["Substitution", "Elimination", "Addition", "Carbonyl", "Pericyclic", "Organometallic"];

/* ---------- 2D scene model ---------- */
export type AtomFrame = { x: number; y: number; label?: string | undefined; charge?: string | undefined; hidden?: boolean | undefined };
export type BondStyle = "none" | "single" | "partial" | "double" | "wedge" | "dash";
export type Scene2D = {
  /** Each atom has one frame per keyframe (steps + 1). */
  atoms: { id: string; frames: AtomFrame[] }[];
  bonds: { a: string; b: string; frames: BondStyle[] }[];
  /** Curly arrows drawn at the start of a step, in that step's starting coordinates. */
  arrows: { step: number; d: string }[];
  annotations?: { frame: number; x: number; y: number; text: string }[];
};
export type Step = { title: string; text: string };

/* ---------- 3D keyframe model ---------- */
export type Element = "C" | "Cc" | "H" | "O" | "Br" | "N";
export type Vec3 = [number, number, number];
export type Scene3D = {
  atoms: { el: Element; frames: Vec3[] }[];
  /** bond order per frame: 0 = none, 0.5 = partial, 1 = full */
  bonds: { a: number; b: number; frames: number[] }[];
  frameLabels: string[];
};

export type ChatEntry = { keywords: string[]; answer: string };

export type Reaction = {
  slug: string;
  name: string;
  short: string;
  category: Category;
  difficulty: 1 | 2 | 3;
  pro: boolean;
  summary: string;
  steps: Step[];
  scene: Scene2D;
  scene3d: Scene3D;
  why3d: string;
  chat: ChatEntry[];
  suggestions: string[];
};

const f = (x: number, y: number, label?: string, charge?: string): AtomFrame => ({ x, y, label, charge });
const hid = (x: number, y: number): AtomFrame => ({ x, y, hidden: true });

/* ---------- SN2: hydroxide + bromomethane ---------- */
const sn2Scene: Scene2D = {
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
const sn1Scene: Scene2D = {
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

/* ---------- E2: hydroxide + 2-bromopropane ---------- */
const e2Scene: Scene2D = {
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

/* ---------- Generic placeholder scene ---------- */
function genericScene(nu: string, center: string, lg: string, product: string): Scene2D {
  return {
    atoms: [
      { id: "Nu", frames: [f(70, 120, nu), f(140, 120, nu), f(150, 120, nu)] },
      { id: "E", frames: [f(220, 120, center), f(220, 120, center), f(220, 120, product)] },
      { id: "LG", frames: [f(310, 120, lg), f(312, 120, lg), f(350, 180, lg)] },
    ],
    bonds: [
      { a: "Nu", b: "E", frames: ["none", "partial", "single"] },
      { a: "E", b: "LG", frames: ["single", "single", "none"] },
    ],
    arrows: [
      { step: 0, d: "M 88 104 Q 150 74 204 106" },
      { step: 1, d: "M 262 132 Q 290 160 316 136" },
    ],
  };
}

/* ---------- 3D keyframes ---------- */
const T = 1.03; // C-H radial distance
const hRing = (x: number, r = T): Vec3[] =>
  [0, 1, 2].map((i) => {
    const a = (i * 2 * Math.PI) / 3 + Math.PI / 2;
    return [x, r * Math.sin(a), r * Math.cos(a)] as Vec3;
  });
const ringAt = (xs: number[]) => xs.map((x) => hRing(x));
const pick = (rings: Vec3[][], i: number): Vec3[] => rings.map((r) => r[i] ?? [0, 0, 0]);

const sn2Rings = ringAt([-0.36, -0.36, 0, 0.36]);
const sn2_3d: Scene3D = {
  frameLabels: ["Reactants", "Backside approach", "Transition state", "Inverted product"],
  atoms: [
    { el: "Cc", frames: [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]] },
    { el: "Br", frames: [[1.94, 0, 0], [1.98, 0, 0], [2.4, 0, 0], [4.8, 0, 0]] },
    { el: "O", frames: [[-5, 0, 0], [-3.1, 0, 0], [-2.0, 0, 0], [-1.43, 0, 0]] },
    { el: "H", frames: [[-5.6, 0.7, 0], [-3.7, 0.7, 0], [-2.6, 0.7, 0], [-2.0, 0.75, 0]] },
    { el: "H", frames: pick(sn2Rings, 0) },
    { el: "H", frames: pick(sn2Rings, 1) },
    { el: "H", frames: pick(sn2Rings, 2) },
  ],
  bonds: [
    { a: 0, b: 1, frames: [1, 1, 0.5, 0] },
    { a: 0, b: 2, frames: [0, 0, 0.5, 1] },
    { a: 2, b: 3, frames: [1, 1, 1, 1] },
    { a: 0, b: 4, frames: [1, 1, 1, 1] },
    { a: 0, b: 5, frames: [1, 1, 1, 1] },
    { a: 0, b: 6, frames: [1, 1, 1, 1] },
  ],
};

const sn1Rings = [hRing(-0.5, 1.45), hRing(-0.5, 1.45), hRing(0, 1.5), hRing(-0.5, 1.45)];
const sn1_3d: Scene3D = {
  frameLabels: ["tert-Butyl bromide", "C–Br lengthens", "Planar carbocation", "Water attacks"],
  atoms: [
    { el: "Cc", frames: [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]] },
    { el: "Br", frames: [[1.95, 0, 0], [2.7, 0, 0], [4.6, 0, 0], [5, 0, 0]] },
    { el: "C", frames: pick(sn1Rings, 0) },
    { el: "C", frames: pick(sn1Rings, 1) },
    { el: "C", frames: pick(sn1Rings, 2) },
    { el: "O", frames: [[-4.5, 0, 0], [-4.2, 0, 0], [-3.2, 0, 0], [1.45, 0, 0]] },
  ],
  bonds: [
    { a: 0, b: 1, frames: [1, 0.5, 0, 0] },
    { a: 0, b: 2, frames: [1, 1, 1, 1] },
    { a: 0, b: 3, frames: [1, 1, 1, 1] },
    { a: 0, b: 4, frames: [1, 1, 1, 1] },
    { a: 0, b: 5, frames: [0, 0, 0, 1] },
  ],
};

const generic3d: Scene3D = {
  frameLabels: ["Reactants", "Approach", "Bond formed"],
  atoms: [
    { el: "Cc", frames: [[0, 0, 0], [0, 0, 0], [0, 0, 0]] },
    { el: "O", frames: [[0, 1.22, 0], [0, 1.28, 0], [0, 1.4, 0.3]] },
    { el: "C", frames: [[-1.3, -0.7, 0], [-1.3, -0.7, -0.2], [-1.25, -0.6, -0.5]] },
    { el: "C", frames: [[1.3, -0.7, 0], [1.3, -0.7, -0.2], [1.25, -0.6, -0.5]] },
    { el: "N", frames: [[0, -0.4, 4], [0, -0.2, 2.6], [0, -0.3, 1.5]] },
  ],
  bonds: [
    { a: 0, b: 1, frames: [1, 1, 1] },
    { a: 0, b: 2, frames: [1, 1, 1] },
    { a: 0, b: 3, frames: [1, 1, 1] },
    { a: 0, b: 4, frames: [0, 0.5, 1] },
  ],
};

/* ---------- Shared tutor knowledge ---------- */
export const generalKnowledge: ChatEntry[] = [
  {
    keywords: ["leaving group", "good leaving"],
    answer:
      "A good leaving group is a weak base that is stable on its own once it leaves with the bonding electrons. Iodide, bromide, tosylate and water (after protonation) are great; hydroxide and alkoxides are poor because they are strong bases.",
  },
  {
    keywords: ["nucleophile", "nucleophilic"],
    answer:
      "A nucleophile is an electron-rich species that donates a lone pair (or π electrons) to an electron-poor atom. In the curly-arrow picture, arrows always start from the nucleophile's electrons and point towards the electrophile.",
  },
  {
    keywords: ["curly arrow", "arrow", "electron pushing"],
    answer:
      "A curly arrow shows the movement of a pair of electrons. The tail starts where the electrons are (a lone pair or a bond) and the head points to where they end up (a new bond or a lone pair on an atom).",
  },
  {
    keywords: ["carbocation", "stability"],
    answer:
      "Carbocation stability increases methyl < primary < secondary < tertiary, because alkyl groups donate electron density by hyperconjugation and induction. Resonance (allylic, benzylic) stabilises them even more.",
  },
  {
    keywords: ["solvent", "protic", "aprotic"],
    answer:
      "Polar protic solvents (water, alcohols) stabilise ions and favour SN1/E1. Polar aprotic solvents (DMSO, acetone, DMF) leave anions 'naked' and reactive, which speeds up SN2.",
  },
];

/* ---------- Reactions ---------- */
type Base = Omit<Reaction, "scene3d" | "why3d" | "chat" | "suggestions"> &
  Partial<Pick<Reaction, "scene3d" | "why3d" | "chat" | "suggestions">>;

const defaultWhy3d =
  "Seeing the molecule in three dimensions makes it clear which face of the molecule is attacked and how the geometry of each atom changes — something flat diagrams hide.";

const raw: Base[] = [
  {
    slug: "sn2",
    name: "SN2",
    short: "Bimolecular nucleophilic substitution",
    category: "Substitution",
    difficulty: 1,
    pro: false,
    summary: "Hydroxide attacks bromomethane from the back in one concerted step, inverting the carbon.",
    steps: [
      {
        title: "Backside attack",
        text: "The hydroxide ion uses a lone pair to attack the δ+ carbon from the side directly opposite the bromine (180°). At the same moment, the C–Br bond begins to break, with its electrons moving towards bromine.",
      },
      {
        title: "Transition state",
        text: "A single trigonal bipyramidal transition state forms: the O···C and C···Br bonds are both partial, and the three hydrogens lie flat in one plane. Because both the nucleophile and substrate are involved, the rate depends on both concentrations.",
      },
      {
        title: "Inversion & bromide leaves",
        text: "The new C–O bond completes as bromide departs with the bonding pair. The three hydrogens flip like an umbrella in the wind — Walden inversion — giving methanol with inverted configuration.",
      },
    ],
    scene: sn2Scene,
    scene3d: sn2_3d,
    why3d:
      "In 3D you can see the hydroxide approach from exactly opposite the bromine and watch the hydrogens pass through a flat, trigonal bipyramidal transition state before flipping. That umbrella flip is why an SN2 reaction at a chiral centre turns R into S (or vice versa) — Walden inversion.",
    chat: [
      {
        keywords: ["invert", "inversion", "stereochemistry", "walden"],
        answer:
          "SN2 inverts stereochemistry because the nucleophile must attack the σ* orbital of the C–Br bond, which points out of the back of the carbon. As the new bond forms on that face and bromide leaves from the other, the three substituents are pushed through a planar arrangement and flip over — like an umbrella turning inside out.",
      },
      {
        keywords: ["rate", "kinetic", "second order", "bimolecular"],
        answer: "SN2 is second order: rate = k[CH₃Br][OH⁻]. Both species are in the single rate-determining transition state.",
      },
      {
        keywords: ["steric", "tertiary", "hindrance", "primary"],
        answer:
          "SN2 is fastest for methyl and primary substrates. Bulky groups block the back face, so tertiary substrates essentially don't react by SN2 — they go SN1 or E2 instead.",
      },
    ],
    suggestions: ["Why does SN2 invert stereochemistry?", "What makes a good leaving group?", "Why are tertiary substrates slow?"],
  },
  {
    slug: "sn1",
    name: "SN1",
    short: "Unimolecular nucleophilic substitution",
    category: "Substitution",
    difficulty: 2,
    pro: false,
    summary: "tert-Butyl bromide ionises to a planar carbocation that water captures.",
    steps: [
      {
        title: "Ionisation to a carbocation",
        text: "The C–Br bond breaks heterolytically and both electrons leave with bromine. This slow, rate-determining step forms a planar, sp² tertiary carbocation stabilised by its three methyl groups.",
      },
      {
        title: "Nucleophile attacks",
        text: "Water donates a lone pair to the empty p orbital of the carbocation. Because the cation is flat, attack can occur from either face — so a chiral starting material would give a racemic mixture.",
      },
      {
        title: "Deprotonation",
        text: "The oxonium ion is acidic. A second water molecule removes a proton, giving tert-butanol and H₃O⁺.",
      },
    ],
    scene: sn1Scene,
    scene3d: sn1_3d,
    why3d:
      "In 3D the carbocation is visibly flat. Water can approach from above or below the plane with equal ease — which is exactly why SN1 at a stereocentre leads to racemisation rather than inversion.",
    chat: [
      {
        keywords: ["racem", "stereochemistry", "both faces", "planar"],
        answer: "The carbocation is planar (sp²), so the nucleophile can attack either face equally, giving a ~50:50 mixture of enantiomers — racemisation.",
      },
      {
        keywords: ["rate", "first order", "unimolecular"],
        answer: "SN1 is first order: rate = k[R–Br]. Only the substrate is involved in the slow ionisation step.",
      },
      {
        keywords: ["rearrange", "shift"],
        answer: "Because a free carbocation forms, hydride or alkyl shifts can occur to give a more stable cation before the nucleophile attacks.",
      },
    ],
    suggestions: ["Why does SN1 racemise?", "What is the rate law for SN1?", "Can carbocations rearrange?"],
  },
  {
    slug: "e1",
    name: "E1",
    short: "Unimolecular elimination",
    category: "Elimination",
    difficulty: 2,
    pro: false,
    summary: "Ionisation to a carbocation, then loss of a β-proton gives an alkene.",
    steps: [
      { title: "Ionisation", text: "The leaving group departs to give a carbocation in the slow, rate-determining step — the same first step as SN1." },
      { title: "Loss of a β-proton", text: "A weak base removes a proton from a carbon next to the cation; the C–H electrons form the new π bond, usually giving the more substituted (Zaitsev) alkene." },
    ],
    scene: genericScene("B:", "C⁺", "LG", "C=C"),
  },
  {
    slug: "e2",
    name: "E2",
    short: "Bimolecular elimination",
    category: "Elimination",
    difficulty: 2,
    pro: false,
    summary: "A base removes a β-hydrogen as the C=C forms and bromide leaves — all at once.",
    steps: [
      {
        title: "Base removes the β-H",
        text: "Hydroxide uses a lone pair to pull off a hydrogen on the carbon next to the C–Br carbon (the β-carbon). For E2 this H and the Br must be anti-periplanar — on opposite sides, in the same plane.",
      },
      {
        title: "π bond forms",
        text: "The electrons from the breaking C–H bond swing in between the two carbons to build the new C=C π bond, while the C–Br bond weakens. All of this happens in one concerted transition state.",
      },
      {
        title: "Leaving group departs",
        text: "Bromide leaves with the C–Br bonding pair, giving propene, water and Br⁻. Rate = k[substrate][base].",
      },
    ],
    scene: e2Scene,
    chat: [
      {
        keywords: ["anti", "periplanar", "geometry"],
        answer:
          "E2 needs the β-H and leaving group anti-periplanar (dihedral 180°) so the C–H σ orbital lines up with the C–Br σ* orbital, letting the new π bond form smoothly as the leaving group departs.",
      },
      {
        keywords: ["zaitsev", "hofmann", "bulky"],
        answer: "Small bases give mainly the more substituted Zaitsev alkene. Bulky bases like tert-butoxide favour the less substituted Hofmann alkene because they reach the more accessible hydrogens.",
      },
    ],
    suggestions: ["Why must E2 be anti-periplanar?", "Zaitsev vs Hofmann?", "What makes a good leaving group?"],
  },
  {
    slug: "aldol",
    name: "Aldol condensation",
    short: "Enolate addition then dehydration",
    category: "Carbonyl",
    difficulty: 2,
    pro: false,
    summary: "An enolate adds to a carbonyl to give a β-hydroxy carbonyl, which dehydrates to an enone.",
    steps: [
      { title: "Enolate formation", text: "Base removes an acidic α-hydrogen to give a resonance-stabilised enolate." },
      { title: "Addition to C=O", text: "The enolate carbon attacks a second carbonyl; protonation gives the β-hydroxy aldehyde or ketone (the aldol)." },
      { title: "Dehydration", text: "On heating, E1cB elimination of water gives the conjugated α,β-unsaturated carbonyl." },
    ],
    scene: genericScene("Enolate", "C=O", "OH⁻", "C–C"),
  },
  {
    slug: "grignard",
    name: "Grignard reaction",
    short: "Organomagnesium addition to carbonyls",
    category: "Organometallic",
    difficulty: 2,
    pro: false,
    summary: "A carbon nucleophile (R–MgBr) adds to a carbonyl to make a new C–C bond and an alcohol.",
    steps: [
      { title: "Nucleophilic addition", text: "The polarised C–Mg bond makes the carbon strongly nucleophilic; it attacks the carbonyl carbon, pushing the π electrons onto oxygen." },
      { title: "Acidic work-up", text: "The magnesium alkoxide is protonated by dilute acid to give the alcohol." },
    ],
    scene: genericScene("R⁻", "C=O", "MgBr⁺", "R–C–OH"),
  },
  {
    slug: "ozonolysis",
    name: "Ozonolysis",
    short: "Oxidative cleavage of alkenes",
    category: "Addition",
    difficulty: 3,
    pro: true,
    summary: "Ozone cleaves a C=C bond into two carbonyls via ozonide intermediates.",
    steps: [
      { title: "1,3-dipolar cycloaddition", text: "Ozone adds across the C=C to form an unstable primary ozonide (molozonide)." },
      { title: "Fragmentation & recombination", text: "The molozonide splits into a carbonyl and a carbonyl oxide, which recombine to the secondary ozonide." },
      { title: "Reductive work-up", text: "Dimethyl sulfide or Zn/AcOH reduces the ozonide to two carbonyl compounds." },
    ],
    scene: genericScene("O₃", "C=C", "—", "C=O"),
  },
  {
    slug: "diels-alder",
    name: "Diels–Alder",
    short: "[4+2] cycloaddition",
    category: "Pericyclic",
    difficulty: 3,
    pro: true,
    summary: "A diene and a dienophile form a six-membered ring in one concerted step.",
    steps: [
      { title: "s-cis diene meets dienophile", text: "The diene must adopt the s-cis conformation so its termini can reach both carbons of the dienophile." },
      { title: "Concerted cycloaddition", text: "Three π bonds become two new σ bonds and one new π bond in a single cyclic transition state, forming cyclohexene with retained stereochemistry." },
    ],
    scene: genericScene("Diene", "C=C", "—", "Ring"),
  },
  {
    slug: "fischer-esterification",
    name: "Fischer esterification",
    short: "Acid-catalysed ester formation",
    category: "Carbonyl",
    difficulty: 2,
    pro: false,
    summary: "A carboxylic acid and alcohol give an ester and water under acid catalysis.",
    steps: [
      { title: "Protonate the carbonyl", text: "Acid protonates the C=O oxygen, making the carbonyl carbon much more electrophilic." },
      { title: "Alcohol attacks", text: "The alcohol adds to give a tetrahedral intermediate; proton transfer turns an OH into a good leaving group (water)." },
      { title: "Lose water, deprotonate", text: "Water leaves, the C=O reforms, and loss of H⁺ regenerates the catalyst and gives the ester." },
    ],
    scene: genericScene("R'OH", "C=O", "H₂O", "Ester"),
  },
  {
    slug: "claisen",
    name: "Claisen condensation",
    short: "Ester enolate acylation",
    category: "Carbonyl",
    difficulty: 3,
    pro: true,
    summary: "Two esters combine to a β-keto ester via an enolate.",
    steps: [
      { title: "Enolate formation", text: "Alkoxide base removes an α-H of an ester, forming an ester enolate." },
      { title: "Addition–elimination", text: "The enolate attacks a second ester; the tetrahedral intermediate expels alkoxide to give the β-keto ester." },
      { title: "Driving deprotonation", text: "The acidic β-keto ester is deprotonated by alkoxide, pulling the equilibrium forward; acid work-up returns the product." },
    ],
    scene: genericScene("Enolate", "C=O", "RO⁻", "β-keto"),
  },
  {
    slug: "wittig",
    name: "Wittig reaction",
    short: "Phosphorus ylide olefination",
    category: "Carbonyl",
    difficulty: 3,
    pro: true,
    summary: "A phosphorus ylide converts a carbonyl into an alkene.",
    steps: [
      { title: "Ylide adds to C=O", text: "The nucleophilic ylide carbon attacks the carbonyl, forming a four-membered oxaphosphetane." },
      { title: "Collapse to alkene", text: "The oxaphosphetane fragments to the alkene and triphenylphosphine oxide, driven by the very strong P=O bond." },
    ],
    scene: genericScene("Ph₃P=CR₂", "C=O", "Ph₃P=O", "C=C"),
  },
  {
    slug: "friedel-crafts-acylation",
    name: "Friedel–Crafts acylation",
    short: "Electrophilic aromatic substitution",
    category: "Substitution",
    difficulty: 3,
    pro: true,
    summary: "An acylium ion acylates benzene with AlCl₃ catalysis.",
    steps: [
      { title: "Generate the acylium ion", text: "AlCl₃ abstracts chloride from the acyl chloride, giving a resonance-stabilised acylium ion R–C≡O⁺." },
      { title: "Attack by benzene", text: "The aromatic π system attacks the acylium ion to form a non-aromatic arenium (σ-complex) intermediate." },
      { title: "Restore aromaticity", text: "AlCl₄⁻ removes the proton on the sp³ carbon, regenerating aromaticity, HCl and the catalyst." },
    ],
    scene: genericScene("Ar–H", "RC≡O⁺", "H⁺", "Ar–COR"),
  },
];

export const reactions: Reaction[] = raw.map((r) => ({
  scene3d: generic3d,
  why3d: defaultWhy3d,
  chat: [],
  suggestions: [`Explain the ${r.name} in one sentence`, "What makes a good leaving group?", "What does a curly arrow mean?"],
  ...r,
}));

export const proSlugs = reactions.filter((r) => r.pro).map((r) => r.slug);

export function getReaction(slug: string) {
  return reactions.find((r) => r.slug === slug);
}

export function tutorAnswer(reaction: Reaction, question: string): string {
  const q = question.toLowerCase();
  if (/one sentence|explain|summar/.test(q)) return `${reaction.name}: ${reaction.summary}`;
  for (const entry of [...reaction.chat, ...generalKnowledge]) {
    if (entry.keywords.some((k) => q.includes(k))) return entry.answer;
  }
  const step = reaction.steps.find((s) => q.includes(s.title.toLowerCase().split(" ")[0] ?? ""));
  if (step) return `${step.title}: ${step.text}`;
  return `Good question! I don't have a specific note on that yet. Here's the core idea of the ${reaction.name}: ${reaction.summary} Try asking about the leaving group, the nucleophile, stereochemistry or a specific step.`;
}
