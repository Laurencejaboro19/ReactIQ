/* All reaction content lives here. Add a reaction by appending to `reactions`
 * and giving it a 2D scene (scenes2d.ts) and a 3D scene (scenes3d.ts). */

export type Category = "Substitution" | "Elimination" | "Addition" | "Carbonyl" | "Pericyclic" | "Organometallic";
export const categories: Category[] = ["Substitution", "Elimination", "Addition", "Carbonyl", "Pericyclic", "Organometallic"];

/* ---------- 2D scene model ---------- */
export type AtomFrame = { x: number; y: number; label?: string | undefined; charge?: string | undefined; hidden?: boolean | undefined };
export type BondStyle = "none" | "single" | "partial" | "double" | "triple" | "wedge" | "dash";
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
export type Element = "C" | "Cc" | "H" | "O" | "N" | "Br" | "Cl" | "Mg" | "P" | "Al" | "S";
export type Vec3 = [number, number, number];
export type Scene3D = {
  atoms: { el: Element; frames: Vec3[] }[];
  /** bond order per frame: 0 = none, 0.5 = partial, 1 = single, 2 = double, 3 = triple */
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
  summary: string;
  steps: Step[];
  scene: Scene2D;
  scene3d: Scene3D;
  why3d: string;
  chat: ChatEntry[];
  suggestions: string[];
};

import {
  aldolScene,
  claisenScene,
  dielsAlderScene,
  e1Scene,
  e2Scene,
  fischerScene,
  friedelCraftsScene,
  grignardScene,
  ozonolysisScene,
  sn1Scene,
  sn2Scene,
  wittigScene,
} from "./scenes2d";
import { scenes3d } from "./scenes3d";

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
    keywords: ["electrophile", "electrophilic"],
    answer:
      "An electrophile is electron-poor: a carbocation, a carbonyl carbon, an acylium ion, a proton. Curly arrows always end on the electrophile (or on an atom that can accept the pair as a lone pair).",
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
  {
    keywords: ["transition state", "intermediate"],
    answer:
      "An intermediate is a real species that sits in an energy well (a carbocation, an enolate, a tetrahedral intermediate). A transition state is the energy maximum between two states — it has partial bonds, exists for a single vibration, and is marked ‡.",
  },
  {
    keywords: ["enolate", "alpha hydrogen", "α-h", "acidic"],
    answer:
      "α-Hydrogens (on the carbon next to a C=O) are acidic (pKa ≈ 17–20 for aldehydes/ketones, ≈ 25 for esters) because the resulting enolate is stabilised by resonance: the negative charge is shared between carbon and oxygen.",
  },
  {
    keywords: ["tetrahedral"],
    answer:
      "When a nucleophile adds to a trigonal carbonyl carbon, the carbon becomes sp³ — a tetrahedral intermediate. With acyl compounds (esters, acyl chlorides) it then collapses, expelling the best leaving group to re-form the C=O.",
  },
  {
    keywords: ["stereochem", "chiral", "enantiomer", "3d"],
    answer:
      "Switch to 3D mode for this one: rotating the molecule shows which face is attacked and how the geometry at each carbon changes — the thing flat drawings hide.",
  },
];

/* ---------- Reactions ---------- */
export const reactions: Reaction[] = [
  {
    slug: "sn2",
    name: "SN2",
    short: "Bimolecular nucleophilic substitution",
    category: "Substitution",
    difficulty: 1,
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
    scene3d: scenes3d.sn2,
    why3d:
      "In 3D you can see the hydroxide approach from exactly opposite the bromine and watch the hydrogens pass through a flat, trigonal bipyramidal transition state before flipping. That umbrella flip is why an SN2 reaction at a chiral centre turns R into S (or vice versa) — Walden inversion.",
    chat: [
      {
        keywords: ["invert", "inversion", "stereochemistry", "walden"],
        answer:
          "SN2 inverts stereochemistry because the nucleophile must attack the σ* orbital of the C–Br bond, which points out of the back of the carbon. As the new bond forms on that face and bromide leaves from the other, the three substituents are pushed through a planar arrangement and flip over — like an umbrella turning inside out.",
      },
      { keywords: ["rate", "kinetic", "second order", "bimolecular"], answer: "SN2 is second order: rate = k[CH₃Br][OH⁻]. Both species are in the single rate-determining transition state." },
      {
        keywords: ["steric", "tertiary", "hindrance", "primary"],
        answer: "SN2 is fastest for methyl and primary substrates. Bulky groups block the back face, so tertiary substrates essentially don't react by SN2 — they go SN1 or E2 instead.",
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
      { title: "Deprotonation", text: "The oxonium ion is acidic. A second water molecule removes a proton, giving tert-butanol and H₃O⁺." },
    ],
    scene: sn1Scene,
    scene3d: scenes3d.sn1,
    why3d:
      "In 3D the carbocation is visibly flat. Water can approach from above or below the plane with equal ease — which is exactly why SN1 at a stereocentre leads to racemisation rather than inversion.",
    chat: [
      { keywords: ["racem", "stereochemistry", "both faces", "planar"], answer: "The carbocation is planar (sp²), so the nucleophile can attack either face equally, giving a ~50:50 mixture of enantiomers — racemisation." },
      { keywords: ["rate", "first order", "unimolecular"], answer: "SN1 is first order: rate = k[R–Br]. Only the substrate is involved in the slow ionisation step." },
      { keywords: ["rearrange", "shift"], answer: "Because a free carbocation forms, hydride or alkyl shifts can occur to give a more stable cation before the nucleophile attacks." },
    ],
    suggestions: ["Why does SN1 racemise?", "What is the rate law for SN1?", "Can carbocations rearrange?"],
  },
  {
    slug: "e1",
    name: "E1",
    short: "Unimolecular elimination",
    category: "Elimination",
    difficulty: 2,
    summary: "tert-Butyl bromide ionises to a carbocation; loss of a β-proton then gives 2-methylpropene.",
    steps: [
      {
        title: "Ionisation",
        text: "The C–Br bond breaks heterolytically and bromide leaves with the bonding pair. This slow, rate-determining step gives a planar tertiary carbocation — exactly the same first step as SN1, which is why E1 and SN1 always compete.",
      },
      {
        title: "Loss of a β-proton",
        text: "A weak base (here water) removes a hydrogen from a carbon next to the cation. The electrons of that C–H bond swing in to form the new π bond, giving the alkene and H₃O⁺. Where there is a choice, the more substituted (Zaitsev) alkene dominates.",
      },
    ],
    scene: e1Scene,
    scene3d: scenes3d.e1,
    why3d:
      "Watch the carbocation flatten after bromide leaves, then see how the β C–H bond must line up parallel to the empty p orbital before it can become the new π bond. In 3D it is obvious why any of the nine β-hydrogens can be removed — heat and a weak base favour E1 over SN1.",
    chat: [
      { keywords: ["sn1", "compete", "versus", "vs"], answer: "E1 and SN1 share the same carbocation intermediate. Heat, a weak base and a poor nucleophile push towards elimination (E1); a good nucleophile at low temperature favours substitution (SN1)." },
      { keywords: ["zaitsev", "more substituted", "regio"], answer: "E1 gives mainly the Zaitsev (more substituted, more stable) alkene because the proton is removed from the carbocation in a product-like transition state." },
      { keywords: ["rate", "first order"], answer: "E1 is first order: rate = k[R–X]. The base is not involved in the slow ionisation step." },
    ],
    suggestions: ["How does E1 compete with SN1?", "Why does E1 give the Zaitsev product?", "What is the rate law for E1?"],
  },
  {
    slug: "e2",
    name: "E2",
    short: "Bimolecular elimination",
    category: "Elimination",
    difficulty: 2,
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
      { title: "Leaving group departs", text: "Bromide leaves with the C–Br bonding pair, giving propene, water and Br⁻. Rate = k[substrate][base]." },
    ],
    scene: e2Scene,
    scene3d: scenes3d.e2,
    why3d:
      "Rotate the molecule until you look straight down the C–C bond: the β-H and the Br sit exactly opposite each other (anti-periplanar). That alignment lets the C–H σ bond feed straight into the C–Br σ* orbital, so the π bond forms as the leaving group departs in one step.",
    chat: [
      {
        keywords: ["anti", "periplanar", "geometry"],
        answer: "E2 needs the β-H and leaving group anti-periplanar (dihedral 180°) so the C–H σ orbital lines up with the C–Br σ* orbital, letting the new π bond form smoothly as the leaving group departs.",
      },
      { keywords: ["zaitsev", "hofmann", "bulky"], answer: "Small bases give mainly the more substituted Zaitsev alkene. Bulky bases like tert-butoxide favour the less substituted Hofmann alkene because they reach the more accessible hydrogens." },
      { keywords: ["rate", "second order"], answer: "E2 is second order: rate = k[R–X][base]. Both are present in the single transition state." },
    ],
    suggestions: ["Why must E2 be anti-periplanar?", "Zaitsev vs Hofmann?", "What makes a good leaving group?"],
  },
  {
    slug: "aldol",
    name: "Aldol condensation",
    short: "Enolate addition then dehydration",
    category: "Carbonyl",
    difficulty: 2,
    summary: "An enolate adds to a second carbonyl to give a β-hydroxy aldehyde, which dehydrates to the conjugated enal.",
    steps: [
      {
        title: "Enolate formation",
        text: "Hydroxide removes an acidic α-hydrogen from acetaldehyde. The C–H electrons move into the C–C bond and the C=O π electrons move onto oxygen, giving a resonance-stabilised enolate.",
      },
      {
        title: "Addition to C=O",
        text: "The nucleophilic α-carbon of the enolate attacks the carbonyl carbon of a second acetaldehyde, pushing the π electrons onto that oxygen. Protonation by water gives 3-hydroxybutanal — the 'aldol'.",
      },
      {
        title: "Dehydration",
        text: "On heating, base removes the remaining α-hydrogen and the resulting enolate expels hydroxide (E1cB), giving crotonaldehyde — the conjugated α,β-unsaturated aldehyde.",
      },
    ],
    scene: aldolScene,
    scene3d: scenes3d.aldol,
    why3d:
      "The enolate carbon must approach the second carbonyl roughly perpendicular to its plane (the Bürgi–Dunitz angle, ~107°). In 3D you can see that approach, the carbonyl carbon pyramidalising into a tetrahedral alkoxide, and finally the new C=C becoming coplanar with the C=O when the product conjugates.",
    chat: [
      { keywords: ["cross", "mixed", "which enolate"], answer: "A crossed aldol works cleanly when one partner cannot form an enolate (e.g. benzaldehyde, formaldehyde) or when a pre-formed lithium enolate is used; otherwise you get a mixture of four products." },
      { keywords: ["e1cb", "dehydrat", "conjugat"], answer: "Dehydration goes by E1cB: hydroxide removes an α-H to form an enolate, which then expels OH⁻. It is favourable because the product is a conjugated enal/enone." },
      { keywords: ["retro", "reversible", "equilibrium"], answer: "The addition step is reversible (retro-aldol). Dehydration to the conjugated product is what pulls the equilibrium forward." },
    ],
    suggestions: ["Why is the α-hydrogen acidic?", "How does the dehydration step work?", "What is a crossed aldol?"],
  },
  {
    slug: "grignard",
    name: "Grignard reaction",
    short: "Organomagnesium addition to carbonyls",
    category: "Organometallic",
    difficulty: 2,
    summary: "A carbon nucleophile (CH₃–MgBr) adds to formaldehyde to make a new C–C bond; work-up gives ethanol.",
    steps: [
      {
        title: "Nucleophilic addition",
        text: "The C–Mg bond is strongly polarised towards carbon, so the methyl group behaves like a carbanion. It attacks the carbonyl carbon while the C=O π electrons move onto oxygen, which coordinates to Mg²⁺.",
      },
      { title: "Acidic work-up", text: "The magnesium alkoxide is protonated by dilute aqueous acid (H₃O⁺) to give the primary alcohol, ethanol, plus magnesium salts." },
    ],
    scene: grignardScene,
    scene3d: scenes3d.grignard,
    why3d:
      "The methyl carbon attacks perpendicular to the carbonyl plane and the planar formaldehyde carbon becomes tetrahedral — in 3D you can see the two hydrogens bend away as the new C–C bond forms, and the magnesium holding on to the oxygen until water arrives.",
    chat: [
      { keywords: ["water", "dry", "anhydrous", "moisture"], answer: "Grignard reagents are strong bases: any water or alcohol protonates them (R–MgBr + H₂O → R–H), destroying the reagent. That's why the reaction is run in dry ether." },
      { keywords: ["primary", "secondary", "tertiary", "formaldehyde", "ketone"], answer: "Formaldehyde gives a primary alcohol, other aldehydes give secondary alcohols, and ketones give tertiary alcohols. Esters react twice to give tertiary alcohols with two identical groups." },
      { keywords: ["ether", "thf", "solvent"], answer: "Ethers (Et₂O, THF) coordinate to magnesium through their lone pairs, stabilising the reagent and keeping it in solution." },
    ],
    suggestions: ["Why must the reaction be dry?", "What alcohol do ketones give?", "Why is ether the solvent?"],
  },
  {
    slug: "ozonolysis",
    name: "Ozonolysis",
    short: "Oxidative cleavage of alkenes",
    category: "Addition",
    difficulty: 3,
    summary: "Ozone cleaves a C=C bond into two carbonyls via a molozonide and a secondary ozonide.",
    steps: [
      { title: "1,3-dipolar cycloaddition", text: "Ozone, a 1,3-dipole, adds across the C=C in one concerted step to form the unstable primary ozonide (molozonide, a 1,2,3-trioxolane)." },
      { title: "Fragmentation", text: "The weak O–O bond breaks and the ring falls apart by a retro-[3+2] into a carbonyl compound and a carbonyl oxide (Criegee intermediate)." },
      { title: "Recombination", text: "The carbonyl oxide and the carbonyl re-add — now with the oxygens the other way round — to form the more stable secondary ozonide (1,2,4-trioxolane)." },
      { title: "Reductive work-up", text: "Dimethyl sulfide attacks the peroxide O–O bond. The ozonide unzips into two carbonyl compounds and DMSO. (Zn/AcOH does the same; H₂O₂ instead gives acids.)" },
    ],
    scene: ozonolysisScene,
    scene3d: scenes3d.ozonolysis,
    why3d:
      "The two trioxolane rings look identical on paper. In 3D you can see that the primary ozonide has both carbons bonded to each other, while the secondary ozonide has them separated by an oxygen bridge — which is why the C=C bond is already gone before the work-up step.",
    chat: [
      { keywords: ["reductive", "oxidative", "dms", "zinc", "peroxide", "work"], answer: "Reductive work-up (Me₂S, Zn/AcOH) gives aldehydes and ketones. Oxidative work-up (H₂O₂) converts any aldehyde to a carboxylic acid. NaBH₄ reduces straight through to alcohols." },
      { keywords: ["criegee", "carbonyl oxide"], answer: "The carbonyl oxide (Criegee intermediate) is a 1,3-dipole, R₂C=O⁺–O⁻. It recombines with the aldehyde in a second 1,3-dipolar cycloaddition to give the secondary ozonide." },
      { keywords: ["use", "why", "structure", "determine"], answer: "Ozonolysis is used to cut molecules at their C=C bonds — classically to work out where the double bond was by identifying the two carbonyl fragments." },
    ],
    suggestions: ["Reductive vs oxidative work-up?", "What is the Criegee intermediate?", "Why does ozone do a cycloaddition?"],
  },
  {
    slug: "diels-alder",
    name: "Diels–Alder",
    short: "[4+2] cycloaddition",
    category: "Pericyclic",
    difficulty: 3,
    summary: "A conjugated diene and a dienophile form a six-membered ring in one concerted, stereospecific step.",
    steps: [
      { title: "s-cis diene meets dienophile", text: "The diene must adopt the s-cis conformation so its two terminal carbons can reach both carbons of the dienophile at once. The dienophile approaches face-on, below the diene's plane." },
      {
        title: "Concerted cycloaddition",
        text: "Three π bonds rearrange in a single aromatic-like cyclic transition state: two new σ bonds form at the termini and the remaining π bond moves to the middle of the diene. Cyclohexene forms with the stereochemistry of both partners retained.",
      },
    ],
    scene: dielsAlderScene,
    scene3d: scenes3d["diels-alder"],
    why3d:
      "The Diels–Alder is suprafacial on both components: the dienophile bonds to the same face of the diene at both ends. In 3D you can see the two molecules stacking in parallel planes, the termini bending towards each other, and the product ring puckering into a half-chair.",
    chat: [
      { keywords: ["endo", "exo", "rule"], answer: "The endo product is usually favoured kinetically: secondary orbital overlap between the dienophile's electron-withdrawing group and the diene's developing π bond stabilises the endo transition state." },
      { keywords: ["s-cis", "s-trans", "conformation", "cyclopentadiene"], answer: "Only the s-cis conformer can react — the termini of s-trans butadiene are too far apart. Cyclopentadiene is locked s-cis, which is why it reacts so fast (even with itself)." },
      { keywords: ["homo", "lumo", "orbital", "electron withdrawing", "demand"], answer: "Normal-demand Diels–Alder: the diene HOMO reacts with the dienophile LUMO. Electron-donating groups on the diene and electron-withdrawing groups on the dienophile close the gap and speed it up." },
      { keywords: ["stereo", "cis", "trans", "retain"], answer: "The reaction is stereospecific: cis substituents on the dienophile end up cis on the ring, because both new σ bonds form on the same face at the same time." },
    ],
    suggestions: ["What is the endo rule?", "Why must the diene be s-cis?", "Which orbitals interact?"],
  },
  {
    slug: "fischer-esterification",
    name: "Fischer esterification",
    short: "Acid-catalysed ester formation",
    category: "Carbonyl",
    difficulty: 2,
    summary: "Acetic acid and methanol give methyl acetate and water under acid catalysis — every step is reversible.",
    steps: [
      { title: "Protonate the carbonyl", text: "The acid catalyst protonates the carbonyl oxygen. The resulting oxocarbenium ion is far more electrophilic at carbon than the neutral acid." },
      { title: "Alcohol attacks", text: "Methanol adds to the activated carbonyl, giving a tetrahedral intermediate. A proton then hops from the new oxonium oxygen onto one of the OH groups, turning it into a good leaving group: water." },
      { title: "Lose water, deprotonate", text: "The lone pair on the remaining OH pushes down to re-form the C=O as water leaves. Loss of H⁺ from that oxygen regenerates the catalyst and gives the ester." },
    ],
    scene: fischerScene,
    scene3d: scenes3d["fischer-esterification"],
    why3d:
      "The carbonyl carbon changes from flat to tetrahedral and back again. In 3D you can watch methanol add perpendicular to the plane, the three oxygens become equivalent in the tetrahedral intermediate, and then a different oxygen leave as water — the key to why the ester oxygen comes from the alcohol, not the acid.",
    chat: [
      { keywords: ["equilibrium", "le chatelier", "drive", "yield"], answer: "Every step is reversible, so the ester yield is pushed up by using excess alcohol or by removing water as it forms (Dean–Stark trap)." },
      { keywords: ["label", "18o", "oxygen", "which oxygen", "comes from"], answer: "Isotope labelling (¹⁸O in the alcohol) shows the ester's alkoxy oxygen comes from the alcohol; the water contains the oxygen from the acid's OH group." },
      { keywords: ["catalyst", "h2so4", "sulfuric", "acid"], answer: "A strong acid (H₂SO₄, TsOH, HCl) is needed only in catalytic amounts: it is consumed in step 1 and regenerated in the last step." },
      { keywords: ["reverse", "hydrolysis"], answer: "Run the same mechanism backwards with excess water and acid and you hydrolyse the ester — acid-catalysed ester hydrolysis is the exact microscopic reverse." },
    ],
    suggestions: ["How do you push the equilibrium?", "Which oxygen ends up in the water?", "Why only catalytic acid?"],
  },
  {
    slug: "claisen",
    name: "Claisen condensation",
    short: "Ester enolate acylation",
    category: "Carbonyl",
    difficulty: 3,
    summary: "Two esters combine to a β-keto ester via an enolate; a final deprotonation drives the equilibrium.",
    steps: [
      { title: "Enolate formation", text: "Methoxide removes an α-hydrogen from methyl acetate, giving an ester enolate. Use the alkoxide matching the ester's alkoxy group so transesterification can't scramble the product." },
      { title: "Addition to the second ester", text: "The enolate carbon attacks the carbonyl carbon of a second ester molecule, pushing the π electrons onto oxygen and forming a tetrahedral alkoxide intermediate." },
      { title: "Ethoxide leaves", text: "The alkoxide collapses: the C=O re-forms and methoxide is expelled as the leaving group. The product is the β-keto ester, methyl acetoacetate." },
      { title: "Driving deprotonation", text: "The CH₂ between the two carbonyls is unusually acidic (pKa ≈ 11), so methoxide deprotonates it to a doubly stabilised enolate. This irreversible step pulls the whole equilibrium forward; acid work-up returns the neutral β-keto ester." },
    ],
    scene: claisenScene,
    scene3d: scenes3d.claisen,
    why3d:
      "Compare the two carbonyl carbons in 3D: the one being attacked goes trigonal → tetrahedral → trigonal again, while the enolate carbon goes flat → tetrahedral → flat again in the final deprotonation. Seeing that last enolate planar and conjugated with both C=O groups explains why it is so stable.",
    chat: [
      { keywords: ["aldol", "difference", "compare"], answer: "Aldol: enolate adds to an aldehyde/ketone and stays added (β-hydroxy carbonyl). Claisen: enolate adds to an ester and the tetrahedral intermediate expels alkoxide, so you get a β-keto ester." },
      { keywords: ["stoichiometric", "equivalent", "catalytic", "drive", "equilibrium"], answer: "Unlike the aldol, the Claisen needs a full equivalent of base because the final deprotonation of the β-keto ester consumes it — that deprotonation is what makes the overall reaction favourable." },
      { keywords: ["dieckmann", "intramolecular", "ring"], answer: "An intramolecular Claisen between two ester groups in the same molecule is a Dieckmann condensation; it works best for five- and six-membered rings." },
      { keywords: ["why methoxide", "which base", "transester"], answer: "Match the base to the ester: methoxide for methyl esters, ethoxide for ethyl esters. A mismatched alkoxide would swap the ester's alkoxy group (transesterification)." },
    ],
    suggestions: ["How is Claisen different from aldol?", "Why is a full equivalent of base needed?", "What is a Dieckmann condensation?"],
  },
  {
    slug: "wittig",
    name: "Wittig reaction",
    short: "Phosphorus ylide olefination",
    category: "Carbonyl",
    difficulty: 3,
    summary: "A phosphorus ylide converts a C=O into a C=C, driven by formation of the very strong P=O bond.",
    steps: [
      { title: "Ylide adds to C=O", text: "The nucleophilic carbanion end of the ylide attacks the carbonyl carbon while the oxygen bonds to phosphorus — effectively a [2+2] cycloaddition that gives a four-membered oxaphosphetane." },
      { title: "Collapse to alkene", text: "The oxaphosphetane fragments: the P–C bond electrons become the new C=C π bond and the C–O bond electrons go to form P=O. Triphenylphosphine oxide (very strong P=O bond, ~540 kJ/mol) is the thermodynamic driving force." },
    ],
    scene: wittigScene,
    scene3d: scenes3d.wittig,
    why3d:
      "The oxaphosphetane is a flat four-membered ring. In 3D you can see the two reacting planes stack on top of each other, close into the square ring, and then split apart the other way — which is why the C=C geometry (Z or E) is set at the moment the ring forms.",
    chat: [
      { keywords: ["z", "e", "geometry", "stabilised", "stabilized", "selectiv"], answer: "Unstabilised ylides (R = alkyl) give mainly Z-alkenes under kinetic control. Stabilised ylides (R = ester, ketone) give E-alkenes because the oxaphosphetane formation becomes reversible." },
      { keywords: ["make", "prepare", "ylide", "butyllithium", "phosphonium"], answer: "Ylides are made by SN2 of Ph₃P on an alkyl halide to give a phosphonium salt, then deprotonation with a strong base such as n-BuLi." },
      { keywords: ["driving force", "why", "p=o", "phosphine oxide"], answer: "The P=O bond in Ph₃P=O is exceptionally strong, so the fragmentation of the oxaphosphetane is highly exothermic — that is what drives the whole reaction." },
      { keywords: ["hwe", "horner", "wadsworth"], answer: "The Horner–Wadsworth–Emmons variant uses a phosphonate carbanion instead; it gives E-alkenes and a water-soluble phosphate by-product that is easier to remove than Ph₃P=O." },
    ],
    suggestions: ["How do you control Z vs E?", "How is the ylide made?", "What drives the Wittig reaction?"],
  },
  {
    slug: "friedel-crafts-acylation",
    name: "Friedel–Crafts acylation",
    short: "Electrophilic aromatic substitution",
    category: "Substitution",
    difficulty: 3,
    summary: "AlCl₃ generates an acylium ion that benzene attacks; loss of H⁺ restores aromaticity to give acetophenone.",
    steps: [
      { title: "Generate the acylium ion", text: "The Lewis acid AlCl₃ abstracts chloride from acetyl chloride, giving AlCl₄⁻ and a linear, resonance-stabilised acylium ion CH₃–C≡O⁺." },
      { title: "Attack by benzene", text: "The aromatic π system attacks the acylium carbon. This breaks aromaticity and gives the arenium (σ-complex) intermediate, whose positive charge is delocalised over the ortho and para positions." },
      { title: "Restore aromaticity", text: "AlCl₄⁻ removes the proton from the sp³ ring carbon. The C–H electrons return to the ring, regenerating aromaticity, HCl and the AlCl₃ catalyst." },
    ],
    scene: friedelCraftsScene,
    scene3d: scenes3d["friedel-crafts-acylation"],
    why3d:
      "Benzene is perfectly flat — until it isn't. In 3D you can see the acylium approach perpendicular to the ring, one carbon pyramidalise (its H bent out of the plane) in the σ-complex, and then snap back flat when the proton is removed. That visible loss and recovery of planarity is aromaticity being broken and restored.",
    chat: [
      { keywords: ["alkylation", "rearrang", "polyalkylation", "why acyl"], answer: "Acylation beats alkylation because the acylium ion can't rearrange (unlike carbocations) and the product ketone is deactivated, so it doesn't react again — no polyacylation." },
      { keywords: ["stoichiometric", "equivalent", "catalyst", "complex"], answer: "In practice more than one equivalent of AlCl₃ is needed: the product ketone's oxygen coordinates strongly to AlCl₃, tying up the 'catalyst' until aqueous work-up." },
      { keywords: ["deactivated", "nitro", "fail", "doesn't work", "limitation"], answer: "Friedel–Crafts reactions fail on strongly deactivated rings (nitrobenzene) and on anilines/pyridines, whose nitrogen lone pair complexes the Lewis acid." },
      { keywords: ["sigma", "arenium", "wheland", "resonance"], answer: "The σ-complex (arenium or Wheland intermediate) has its positive charge spread over three ring carbons — ortho and para to the point of attack — by resonance." },
    ],
    suggestions: ["Why is acylation better than alkylation?", "What is the σ-complex?", "When does Friedel–Crafts fail?"],
  },
];

export function getReaction(slug: string) {
  return reactions.find((r) => r.slug === slug);
}
