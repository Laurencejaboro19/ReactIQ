/* Long-form study notes for each reaction, shown under the players on the detail page
 * and used by the tutor. Keep each entry self-contained. */

export type Course = "Chemistry" | "Pharmacy" | "Pharmacology" | "Biochemistry";

export type ReactionNotes = {
  /** 2–3 short paragraphs */
  overview: string[];
  conditions: { label: string; value: string }[];
  relevance: { course: Course; text: string }[];
  examTips: string[];
  mistakes: string[];
  keyTerms: { term: string; def: string }[];
};

export const notes: Record<string, ReactionNotes> = {
  sn2: {
    overview: [
      "SN2 stands for substitution, nucleophilic, bimolecular. A nucleophile attacks a carbon bearing a leaving group and the leaving group departs in the same instant — there is no intermediate, only a single transition state in which the carbon is briefly bonded to five groups.",
      "Because the nucleophile must approach the σ* antibonding orbital of the C–X bond, it comes in from directly behind the leaving group. The three other groups on carbon are pushed from one side to the other, like an umbrella blowing inside out. If the carbon is a stereocentre, its configuration is inverted (Walden inversion).",
      "The rate depends on both the substrate and the nucleophile (rate = k[RX][Nu]). Anything that crowds the back of the carbon slows the reaction dramatically: methyl > primary > secondary ≫ tertiary (tertiary essentially never reacts by SN2).",
    ],
    conditions: [
      { label: "Substrate", value: "Methyl or primary (sometimes secondary) alkyl halide, tosylate or mesylate" },
      { label: "Nucleophile", value: "Strong, often anionic: HO⁻, RO⁻, CN⁻, N₃⁻, I⁻, RS⁻" },
      { label: "Solvent", value: "Polar aprotic (DMSO, DMF, acetone, MeCN) — leaves the anion 'naked' and reactive" },
      { label: "Kinetics", value: "Second order; one step; rate = k[RX][Nu⁻]" },
      { label: "Stereochemistry", value: "Complete inversion of configuration at the reacting carbon" },
      { label: "Leaving group", value: "I⁻ > Br⁻ > Cl⁻ ≫ F⁻; TsO⁻ and MsO⁻ are excellent" },
    ],
    relevance: [
      { course: "Pharmacy", text: "Alkylating anticancer drugs (nitrogen mustards, busulfan) and many drug syntheses rely on SN2; N-alkylation of amines builds countless drug molecules." },
      { course: "Pharmacology", text: "DNA alkylation by chemotherapeutics is an SN2 attack of guanine N7 on the drug's electrophilic carbon — the mechanism behind both efficacy and toxicity." },
      { course: "Biochemistry", text: "Methyltransferases use SN2: a nucleophile on the substrate attacks the methyl group of S-adenosylmethionine (SAM) with inversion." },
      { course: "Chemistry", text: "The textbook case for stereospecific reactions and the foundation for understanding Williamson ether synthesis and Finkelstein reactions." },
    ],
    examTips: [
      "If a question gives a chiral secondary halide and a strong nucleophile in DMSO, draw the product with inverted configuration — and say the word 'inversion'.",
      "Rate doubles if you double either [RX] or [Nu⁻]; it quadruples if you double both.",
      "Always draw the nucleophile arriving at 180° to the leaving group and show the trigonal bipyramidal transition state with dashed partial bonds and the ‡ symbol.",
    ],
    mistakes: [
      "Drawing the nucleophile attacking from the same side as the leaving group (that would give retention — wrong).",
      "Proposing SN2 on a tertiary centre; sterics forbid it. Tertiary halides go SN1 or E2.",
      "Forgetting that polar protic solvents (water, alcohols) hydrogen-bond the nucleophile and slow SN2 down.",
    ],
    keyTerms: [
      { term: "Walden inversion", def: "The flip of configuration at a stereocentre during SN2." },
      { term: "σ* orbital", def: "The empty antibonding orbital of the C–X bond that the nucleophile donates into; it points out of the back of the carbon." },
      { term: "Bimolecular", def: "Two species take part in the rate-determining step." },
    ],
  },
  sn1: {
    overview: [
      "SN1 is a two-step substitution. First the leaving group departs on its own, taking the bonding electrons and leaving a carbocation. Then a nucleophile — usually the solvent — captures the cation, and a proton is lost to give the neutral product.",
      "Only the substrate is involved in the slow ionisation, so rate = k[RX]; the nucleophile's concentration does not matter. Anything that stabilises the carbocation speeds the reaction: tertiary > secondary ≫ primary, with allylic and benzylic cations also fast.",
      "Because the carbocation is planar, the nucleophile attacks either face with equal probability. A single enantiomer of starting material gives a racemic (or nearly racemic) product.",
    ],
    conditions: [
      { label: "Substrate", value: "Tertiary, allylic or benzylic halides and sulfonates; secondary under forcing conditions" },
      { label: "Nucleophile", value: "Weak and neutral — water, alcohols, carboxylic acids (solvolysis)" },
      { label: "Solvent", value: "Polar protic (H₂O, EtOH, AcOH) to stabilise the ions" },
      { label: "Kinetics", value: "First order; rate = k[RX]; ionisation is rate-determining" },
      { label: "Stereochemistry", value: "Racemisation (often with slight excess of inversion due to ion pairing)" },
      { label: "Watch for", value: "Carbocation rearrangements (hydride and methyl shifts) and E1 side products" },
    ],
    relevance: [
      { course: "Pharmacy", text: "Hydrolysis of tertiary ester prodrugs and the aqueous instability of some tertiary alkyl halides follow SN1; the mechanism explains shelf-life problems in formulation." },
      { course: "Biochemistry", text: "Glycosidic bond cleavage by many glycosidases proceeds through oxocarbenium-ion-like transition states — SN1-like chemistry at the anomeric carbon." },
      { course: "Pharmacology", text: "Nitrosoureas and triazenes (e.g. temozolomide) release methyl diazonium ions that alkylate DNA via SN1-type pathways." },
      { course: "Chemistry", text: "The classic example for carbocation stability, Hammond's postulate and kinetic order arguments." },
    ],
    examTips: [
      "Say 'planar sp² carbocation' and draw it flat with the empty p orbital — this is what earns the racemisation mark.",
      "If the cation can rearrange to a more stable one (secondary → tertiary), the examiner expects you to show the shift before the nucleophile attacks.",
      "Rate is independent of [Nu]: doubling the nucleophile changes nothing.",
    ],
    mistakes: [
      "Drawing a concerted attack with a strong nucleophile and calling it SN1.",
      "Forgetting the final deprotonation step when the nucleophile is water or an alcohol — the oxonium ion is not the product.",
      "Assuming inversion only; SN1 gives both enantiomers.",
    ],
    keyTerms: [
      { term: "Carbocation", def: "A trivalent carbon with six valence electrons and a positive charge; planar, sp² hybridised." },
      { term: "Solvolysis", def: "A substitution in which the solvent is the nucleophile." },
      { term: "Hammond postulate", def: "The transition state resembles the species closest to it in energy — here the carbocation — so cation stability controls rate." },
    ],
  },
  e1: {
    overview: [
      "E1 is unimolecular elimination. Like SN1 it begins with slow loss of the leaving group to give a carbocation. Instead of being captured by a nucleophile, the cation then loses a proton from an adjacent (β) carbon; the C–H electrons become the new π bond.",
      "E1 and SN1 always compete because they share the same intermediate. Heat and the absence of a good nucleophile favour elimination; good nucleophiles at low temperature favour substitution.",
      "Where more than one β-hydrogen can be lost, the more substituted (Zaitsev) alkene is the major product because it is the more stable alkene and the transition state resembles it.",
    ],
    conditions: [
      { label: "Substrate", value: "Tertiary (or secondary) halides and alcohols" },
      { label: "Reagent", value: "Weak base / poor nucleophile; acid-catalysed dehydration of alcohols (H₂SO₄, H₃PO₄, heat) is E1" },
      { label: "Solvent", value: "Polar protic" },
      { label: "Kinetics", value: "First order; rate = k[substrate]" },
      { label: "Regiochemistry", value: "Zaitsev (more substituted alkene) major" },
      { label: "Stereochemistry", value: "Not stereospecific; the trans (E) alkene usually dominates" },
    ],
    relevance: [
      { course: "Pharmacy", text: "Acid-catalysed dehydration of tertiary alcohols is a common degradation route for drugs containing tertiary alcohol groups; it is also how many alkene intermediates are made industrially." },
      { course: "Biochemistry", text: "Enzymatic dehydrations (e.g. in the citric acid cycle and fatty-acid synthesis) are often E1cB rather than E1 — comparing them is a favourite exam question." },
      { course: "Chemistry", text: "Illustrates competition between pathways and the thermodynamic control of regiochemistry." },
      { course: "Pharmacology", text: "Metabolic dehydration products of drugs can be the pharmacologically active (or toxic) species." },
    ],
    examTips: [
      "Mention that the first step is identical to SN1 — examiners look for the link.",
      "For alcohol dehydration, draw protonation of OH first; water is the leaving group, not hydroxide.",
      "Predict the Zaitsev product and, if asked, comment that rearrangement to a more stable carbocation may occur first.",
    ],
    mistakes: [
      "Removing the β-hydrogen with a strong base in one step — that is E2, not E1.",
      "Losing a proton from the α-carbon (the one bearing the positive charge); the proton must come from the β-carbon.",
      "Expecting anti-periplanar geometry — E1 does not require it because the C–X bond is already gone.",
    ],
    keyTerms: [
      { term: "β-carbon", def: "The carbon adjacent to the one bearing the leaving group; its hydrogen is removed." },
      { term: "Zaitsev's rule", def: "Elimination gives mainly the more substituted (more stable) alkene." },
      { term: "E1cB", def: "An elimination where the proton leaves first (forming a carbanion/enolate) and the leaving group departs second." },
    ],
  },
  e2: {
    overview: [
      "E2 is bimolecular elimination: a strong base removes a β-hydrogen, the C–H electrons form the new C=C π bond, and the leaving group departs — all in one concerted step with a single transition state.",
      "Geometry is everything. The C–H σ bond must line up with the C–X σ* orbital so the electrons can flow smoothly; that happens when the H and the leaving group are anti-periplanar (dihedral angle 180°). In cyclohexanes this means both must be axial.",
      "Small, strong bases (HO⁻, EtO⁻) give the Zaitsev alkene; very bulky bases (tBuO⁻, LDA) reach only the exposed hydrogens and give the less substituted Hofmann alkene.",
    ],
    conditions: [
      { label: "Substrate", value: "Any alkyl halide with a β-H; tertiary > secondary > primary" },
      { label: "Base", value: "Strong: HO⁻, RO⁻, NH₂⁻, tBuO⁻ (bulky → Hofmann)" },
      { label: "Solvent", value: "The base's conjugate acid (EtO⁻ in EtOH) or polar aprotic" },
      { label: "Kinetics", value: "Second order; rate = k[RX][base]" },
      { label: "Stereochemistry", value: "Stereospecific anti elimination; diastereomeric substrates give different alkene geometries" },
      { label: "Temperature", value: "Heat favours elimination over substitution" },
    ],
    relevance: [
      { course: "Biochemistry", text: "Many enzyme-catalysed eliminations (enolase, fumarase) exploit anti-periplanar geometry enforced by the active site." },
      { course: "Pharmacy", text: "Base-mediated degradation of drugs with β-halo or β-sulfonyloxy groups, and the synthesis of alkene-containing APIs." },
      { course: "Chemistry", text: "The best example of a stereospecific reaction controlled by conformation; the cyclohexane trans-diaxial requirement appears in almost every exam." },
      { course: "Pharmacology", text: "Explains why some prodrugs activate by elimination under physiological base." },
    ],
    examTips: [
      "Draw the Newman projection or chair showing H and X anti; label it 'anti-periplanar'.",
      "For substituted cyclohexanes, flip the chair until the leaving group is axial and look for an axial β-H — if none, no E2.",
      "Strong + bulky base = Hofmann product; strong + small base = Zaitsev.",
    ],
    mistakes: [
      "Showing a carbocation — E2 has none.",
      "Removing a hydrogen that is gauche (60°) rather than anti (180°) to the leaving group.",
      "Forgetting that the base appears in the rate equation.",
    ],
    keyTerms: [
      { term: "Anti-periplanar", def: "H and leaving group in the same plane on opposite sides (dihedral 180°)." },
      { term: "Hofmann product", def: "The less substituted alkene, favoured by bulky bases." },
      { term: "Concerted", def: "All bond-making and bond-breaking happens in a single step." },
    ],
  },
  aldol: {
    overview: [
      "The aldol reaction joins two carbonyl compounds through a new carbon–carbon bond. Under basic conditions an α-hydrogen is removed to make an enolate, a carbon nucleophile. The enolate attacks the C=O of a second molecule, giving a β-hydroxy carbonyl compound — the 'aldol' (ald-ehyde + alcoh-ol).",
      "On heating the aldol dehydrates. Base removes another α-hydrogen, and the resulting enolate expels hydroxide (E1cB) to give an α,β-unsaturated carbonyl compound whose conjugation makes the dehydration favourable. The whole sequence is the aldol condensation.",
      "The reaction is reversible up to the dehydration step (retro-aldol), and crossed aldols between two different enolisable partners give messy mixtures unless one partner cannot enolise.",
    ],
    conditions: [
      { label: "Reagents", value: "Aldehyde or ketone with an α-H; catalytic NaOH or KOH (base-catalysed) or acid" },
      { label: "Solvent / temperature", value: "Water or ethanol; 0–25 °C for the aldol, heat for condensation" },
      { label: "Intermediate", value: "Enolate (resonance stabilised, charge on C and O)" },
      { label: "Product", value: "β-hydroxy carbonyl → α,β-unsaturated carbonyl (enal / enone) after dehydration" },
      { label: "Kinetics", value: "Addition step reversible; dehydration is the thermodynamic sink" },
      { label: "Control", value: "Pre-formed lithium enolates (LDA, –78 °C) give directed, crossed aldols" },
    ],
    relevance: [
      { course: "Biochemistry", text: "Aldolase in glycolysis performs a retro-aldol on fructose-1,6-bisphosphate; in gluconeogenesis the same enzyme runs forward. Class I aldolases go through an enamine instead of an enolate." },
      { course: "Pharmacy", text: "Aldol-type C–C bond formation builds polyketide antibiotics and statin side chains; the enolate chemistry is central to drug synthesis." },
      { course: "Pharmacology", text: "Many enone-containing drugs and natural products (e.g. curcumin, chalcones) are aldol condensation products and act as Michael acceptors in cells." },
      { course: "Chemistry", text: "The archetype of enolate chemistry; understanding it unlocks Claisen, Michael, Robinson annulation and Mannich reactions." },
    ],
    examTips: [
      "Always start by identifying the α-hydrogens; a carbonyl with none (benzaldehyde, formaldehyde) can only be the electrophile.",
      "Draw both resonance forms of the enolate, then attack with the carbon form.",
      "Number the product: the new C–C bond joins the α-carbon of one molecule to the carbonyl carbon of the other; the OH ends up β to the carbonyl.",
    ],
    mistakes: [
      "Attacking with the oxygen of the enolate (that gives an enol ether, not an aldol).",
      "Forgetting the protonation step after addition — the alkoxide must be protonated by solvent.",
      "Drawing dehydration as E1 with a carbocation; under base it is E1cB.",
    ],
    keyTerms: [
      { term: "Enolate", def: "The conjugate base of a carbonyl compound; nucleophilic at the α-carbon." },
      { term: "β-hydroxy carbonyl", def: "The aldol addition product: OH two carbons from the C=O." },
      { term: "E1cB", def: "Elimination via a conjugate base; the enolate expels the leaving group." },
    ],
  },
  grignard: {
    overview: [
      "A Grignard reagent, R–MgX, is made by stirring an alkyl or aryl halide with magnesium metal in dry ether. The carbon–magnesium bond is so polarised that the carbon behaves like a carbanion — a powerful nucleophile and a very strong base.",
      "Added to a carbonyl compound, the R group attacks the carbonyl carbon and the π electrons move onto oxygen, giving a magnesium alkoxide. Aqueous acid work-up protonates it to the alcohol. Formaldehyde gives a primary alcohol, other aldehydes secondary alcohols, and ketones tertiary alcohols.",
      "Because the reagent is such a strong base, any acidic hydrogen (water, alcohols, amines, terminal alkynes, carboxylic acids) destroys it by simple protonation. Everything must be dry and protected.",
    ],
    conditions: [
      { label: "Reagent formation", value: "R–X + Mg turnings in dry Et₂O or THF, often with a crystal of I₂ to start" },
      { label: "Electrophile", value: "Aldehydes, ketones, esters (react twice), CO₂ (gives carboxylic acids), epoxides, nitriles" },
      { label: "Work-up", value: "Dilute aqueous acid (H₃O⁺ or NH₄Cl) to protonate the alkoxide" },
      { label: "Incompatible groups", value: "OH, NH, SH, CO₂H, terminal C≡CH — all protonate the reagent" },
      { label: "Product", value: "New C–C bond + alcohol (1°, 2° or 3° depending on the carbonyl)" },
      { label: "Temperature", value: "0 °C to reflux in ether; exothermic" },
    ],
    relevance: [
      { course: "Pharmacy", text: "Grignard additions build tertiary-alcohol drug cores (e.g. in antihistamines and some opioids) and are used at scale in API manufacture." },
      { course: "Chemistry", text: "The fundamental C–C bond-forming reaction of organometallic chemistry; the basis for later organolithium and cuprate chemistry." },
      { course: "Pharmacology", text: "Understanding the alcohol products helps rationalise structure–activity relationships of tertiary alcohol pharmacophores." },
      { course: "Biochemistry", text: "A useful contrast: biology has no free carbanions and uses enolates, thiamine ylides and carbanion equivalents instead." },
    ],
    examTips: [
      "State the solvent is dry ether and explain why (coordination to Mg, no acidic protons).",
      "Count how many equivalents of Grignard an ester consumes — two — and draw the tertiary alcohol with two identical R groups.",
      "Draw the work-up as a separate step; the alkoxide is not the final product.",
    ],
    mistakes: [
      "Running the reaction in water or ethanol.",
      "Attacking the carbonyl oxygen instead of the carbon.",
      "Using a Grignard on a molecule that also contains an OH group without protecting it.",
    ],
    keyTerms: [
      { term: "Carbanion character", def: "The C–Mg bond polarisation that makes the carbon nucleophilic." },
      { term: "Magnesium alkoxide", def: "The initial adduct, R₂C(O⁻MgBr⁺)R'." },
      { term: "Schlenk equilibrium", def: "R–MgX ⇌ R₂Mg + MgX₂ — the real composition of a Grignard solution." },
    ],
  },
  ozonolysis: {
    overview: [
      "Ozonolysis cuts a carbon–carbon double bond completely, turning each alkene carbon into a carbonyl group. It is the most reliable way to cleave alkenes and historically the main method for locating double bonds in unknown molecules.",
      "Ozone first adds across the C=C in a 1,3-dipolar cycloaddition to give the primary ozonide (molozonide), a 1,2,3-trioxolane. This ring is unstable: it fragments by a retro-cycloaddition into a carbonyl compound and a carbonyl oxide (Criegee intermediate), which recombine with the oxygens swapped to form the secondary ozonide (1,2,4-trioxolane).",
      "The ozonide is never isolated. Reductive work-up with dimethyl sulfide or zinc gives aldehydes and ketones; oxidative work-up with H₂O₂ pushes aldehydes on to carboxylic acids; NaBH₄ reduces straight through to alcohols.",
    ],
    conditions: [
      { label: "Reagent", value: "O₃ bubbled through a solution at –78 °C in CH₂Cl₂ or MeOH" },
      { label: "Reductive work-up", value: "Me₂S or Zn/AcOH → aldehydes and ketones" },
      { label: "Oxidative work-up", value: "H₂O₂ → carboxylic acids (and ketones)" },
      { label: "Reductive to alcohols", value: "NaBH₄ or LiAlH₄" },
      { label: "Intermediates", value: "Molozonide → carbonyl + carbonyl oxide → ozonide" },
      { label: "Selectivity", value: "Each C=C gives two C=O; alkynes give carboxylic acids" },
    ],
    relevance: [
      { course: "Pharmacy", text: "Used to make aldehyde and ketone building blocks for synthesis; ozone degradation also matters for the stability of unsaturated lipids in formulations." },
      { course: "Biochemistry", text: "Ozone and other reactive oxygen species attack unsaturated membrane lipids by closely related mechanisms — the chemistry of lipid peroxidation and lung damage." },
      { course: "Pharmacology", text: "The antimalarial artemisinin and synthetic ozonides (arterolane) contain 1,2,4-trioxolane rings; their mechanism depends on peroxide bond cleavage by iron." },
      { course: "Chemistry", text: "A classic structure-determination tool and the standard example of a 1,3-dipolar cycloaddition." },
    ],
    examTips: [
      "To predict products: break the C=C, put an =O on each carbon, then decide aldehyde vs acid from the work-up.",
      "Terminal alkenes give formaldehyde (reductive) or CO₂ (oxidative) from the CH₂ end.",
      "Name both ozonides correctly: primary = 1,2,3-trioxolane, secondary = 1,2,4-trioxolane.",
    ],
    mistakes: [
      "Giving carboxylic acids after a Me₂S work-up.",
      "Forgetting that a ketone carbon cannot be oxidised further even with H₂O₂.",
      "Drawing the secondary ozonide with the two carbons still bonded.",
    ],
    keyTerms: [
      { term: "1,3-Dipole", def: "A three-atom species with a delocalised four-electron π system (ozone, carbonyl oxides) that adds across a π bond." },
      { term: "Criegee intermediate", def: "The carbonyl oxide R₂C=O⁺–O⁻ formed when the molozonide fragments." },
      { term: "Work-up", def: "The second reagent that converts the ozonide into isolable products." },
    ],
  },
  "diels-alder": {
    overview: [
      "The Diels–Alder reaction joins a conjugated diene (4 π electrons) to an alkene or alkyne 'dienophile' (2 π electrons) to make a six-membered ring. Two new σ bonds and one new π bond form in a single concerted step through a cyclic, aromatic-like transition state.",
      "The diene must be s-cis so that its ends can reach both dienophile carbons at once. Electron-withdrawing groups on the dienophile and electron-donating groups on the diene lower the HOMO–LUMO gap and speed the reaction up.",
      "Because both new bonds form on the same face of each component, the reaction is stereospecific: the geometry of the dienophile is preserved in the product. With cyclic dienes the endo adduct usually forms faster thanks to secondary orbital overlap.",
    ],
    conditions: [
      { label: "Diene", value: "Conjugated, able to adopt s-cis (cyclopentadiene is locked s-cis and very reactive)" },
      { label: "Dienophile", value: "Alkene or alkyne bearing EWG: maleic anhydride, acrolein, acrylates, quinones" },
      { label: "Conditions", value: "Often just heat in toluene or neat; Lewis acids (AlCl₃, Et₂AlCl) accelerate and improve selectivity" },
      { label: "Kinetics", value: "Second order; concerted; negative activation volume (pressure accelerates)" },
      { label: "Stereochemistry", value: "Suprafacial on both components; cis stays cis; endo usually kinetic product" },
      { label: "Reversibility", value: "Retro-Diels–Alder on strong heating (cracking of dicyclopentadiene)" },
    ],
    relevance: [
      { course: "Pharmacy", text: "Builds the six-membered rings of steroids, morphinans and many natural-product drugs; used in the synthesis of oseltamivir intermediates and cortisone." },
      { course: "Biochemistry", text: "Diels–Alderase enzymes (e.g. SpnF in spinosyn biosynthesis) are among the few natural pericyclic catalysts; inverse-electron-demand Diels–Alder reactions are used for bio-orthogonal labelling in cells." },
      { course: "Pharmacology", text: "Tetrazine–trans-cyclooctene 'click' ligations deliver and image drugs in vivo using Diels–Alder chemistry." },
      { course: "Chemistry", text: "The central pericyclic reaction; introduces frontier molecular orbital theory, endo/exo selectivity and stereospecificity." },
    ],
    examTips: [
      "Draw three curly arrows going round the ring — one from each π bond — all in the same direction.",
      "Check the diene can reach s-cis; a diene locked s-trans will not react.",
      "For cyclopentadiene + maleic anhydride, draw the endo product with the anhydride pointing under the new double bond.",
    ],
    mistakes: [
      "Forgetting that the product's new double bond is between C2 and C3 of the original diene.",
      "Drawing a stepwise mechanism with a zwitterion or radical.",
      "Losing the dienophile's cis/trans relationship in the product.",
    ],
    keyTerms: [
      { term: "s-cis", def: "The conformation of a diene with both double bonds on the same side of the central single bond." },
      { term: "Endo rule", def: "The kinetic preference for the dienophile's substituents to sit under the diene's π system in the transition state." },
      { term: "HOMO/LUMO", def: "Highest occupied / lowest unoccupied molecular orbitals; the diene HOMO and dienophile LUMO interact in a normal-demand Diels–Alder." },
    ],
  },
  "fischer-esterification": {
    overview: [
      "Fischer esterification converts a carboxylic acid and an alcohol into an ester plus water, using a strong acid catalyst. Every step is reversible, so the yield is controlled by Le Chatelier's principle: use a large excess of the alcohol or remove the water as it forms.",
      "Protonation of the carbonyl oxygen makes the carbonyl carbon electrophilic enough for the weakly nucleophilic alcohol to attack. The resulting tetrahedral intermediate undergoes a proton transfer that converts one OH into a good leaving group (–OH₂⁺). Water leaves, the C=O re-forms and loss of H⁺ regenerates the catalyst.",
      "Isotope labelling shows that the alkoxy oxygen of the ester comes from the alcohol and the water contains the acid's OH oxygen — exactly what the tetrahedral mechanism predicts.",
    ],
    conditions: [
      { label: "Reagents", value: "RCO₂H + R'OH with catalytic H₂SO₄, TsOH or dry HCl" },
      { label: "Conditions", value: "Reflux; excess alcohol as solvent, or Dean–Stark removal of water" },
      { label: "Mechanism type", value: "Acid-catalysed nucleophilic acyl substitution via a tetrahedral intermediate" },
      { label: "Equilibrium constant", value: "K ≈ 4 for acetic acid + ethanol — hence the need to drive it" },
      { label: "Reverse reaction", value: "Acid-catalysed ester hydrolysis (same mechanism backwards with excess water)" },
      { label: "Limitations", value: "Slow for tertiary alcohols (elimination competes) and hindered acids" },
    ],
    relevance: [
      { course: "Pharmacy", text: "Esters are everywhere in pharmacy — aspirin, local anaesthetics (procaine, benzocaine), ester prodrugs that improve absorption — and Fischer esterification is often how they are made." },
      { course: "Pharmacology", text: "Ester prodrugs are activated by esterases running the reverse reaction; understanding the mechanism explains why hindered esters are hydrolysed more slowly and last longer in plasma." },
      { course: "Biochemistry", text: "Acyl-transfer via tetrahedral intermediates is the same chemistry that serine proteases and acyl-CoA enzymes use, just with better leaving groups." },
      { course: "Chemistry", text: "The standard example of nucleophilic acyl substitution and of using equilibrium thermodynamics in synthesis." },
    ],
    examTips: [
      "Write 'reversible' next to every arrow pair and explain how to drive the equilibrium.",
      "Show the proton transfer step explicitly — it is the step students most often skip and examiners most often look for.",
      "Label the oxygens if asked about ¹⁸O experiments: alcohol O → ester, acid OH → water.",
    ],
    mistakes: [
      "Having hydroxide leave directly (it is a terrible leaving group) instead of water.",
      "Protonating the OH oxygen first instead of the C=O oxygen (protonating C=O activates the carbon much more).",
      "Forgetting to regenerate H⁺ at the end — it is a catalyst.",
    ],
    keyTerms: [
      { term: "Tetrahedral intermediate", def: "The sp³ species formed when a nucleophile adds to a carbonyl carbon." },
      { term: "Nucleophilic acyl substitution", def: "Addition to C=O followed by elimination of a leaving group, replacing one group on the acyl carbon." },
      { term: "Dean–Stark trap", def: "Apparatus that removes water azeotropically to push an esterification to completion." },
    ],
  },
  claisen: {
    overview: [
      "The Claisen condensation couples two esters to give a β-keto ester. Alkoxide base removes an α-hydrogen to form an ester enolate, which attacks the carbonyl of a second ester molecule. The tetrahedral intermediate collapses, expelling alkoxide, to give the β-keto ester.",
      "Unlike the aldol, the Claisen needs a full equivalent of base. Each step up to the β-keto ester is unfavourable, but the product's CH₂ between two carbonyls is unusually acidic (pKa ≈ 11) and is deprotonated irreversibly by alkoxide. That final deprotonation drives the whole equilibrium forward; the neutral product is released on acid work-up.",
      "Use the alkoxide that matches the ester (methoxide for methyl esters, ethoxide for ethyl esters) or transesterification scrambles the products. The intramolecular version, which closes five- and six-membered rings, is the Dieckmann condensation.",
    ],
    conditions: [
      { label: "Reagents", value: "Ester with ≥2 α-hydrogens + NaOR (matching alkoxide), 1 equivalent or more" },
      { label: "Solvent", value: "The corresponding alcohol or THF; room temperature to reflux" },
      { label: "Driving force", value: "Irreversible deprotonation of the β-keto ester product (pKa ≈ 11)" },
      { label: "Work-up", value: "Dilute acid to protonate the stabilised enolate" },
      { label: "Crossed Claisen", value: "Works when one ester has no α-H (benzoate, formate, oxalate, carbonate)" },
      { label: "Dieckmann", value: "Intramolecular Claisen → cyclic β-keto esters (5- and 6-membered rings)" },
    ],
    relevance: [
      { course: "Biochemistry", text: "Fatty-acid biosynthesis and polyketide synthases build carbon chains by Claisen condensations of malonyl-ACP with acyl thioesters; the thiolase reaction in ketogenesis is a retro-Claisen." },
      { course: "Pharmacy", text: "β-Keto esters from Claisen condensations are versatile intermediates for pyrazoles, pyrimidines and many heterocyclic drugs." },
      { course: "Pharmacology", text: "Statins block HMG-CoA reductase downstream of a Claisen-type condensation (HMG-CoA synthase) in cholesterol biosynthesis." },
      { course: "Chemistry", text: "Shows how thermodynamics (a product-deprotonation sink) can control an otherwise unfavourable series of equilibria." },
    ],
    examTips: [
      "State clearly why stoichiometric base is required — this is the single most-asked conceptual point.",
      "Draw the tetrahedral intermediate expelling alkoxide, not hydride or the alkyl group.",
      "For a crossed Claisen, identify which ester lacks α-hydrogens and make it the electrophile.",
    ],
    mistakes: [
      "Using hydroxide as the base (it hydrolyses the ester).",
      "Stopping at the tetrahedral intermediate as if it were the product (that is aldol-like thinking).",
      "Using ethoxide with a methyl ester and ignoring transesterification.",
    ],
    keyTerms: [
      { term: "β-Keto ester", def: "An ester with a ketone on the carbon two along from the ester carbonyl, e.g. ethyl acetoacetate." },
      { term: "Ester enolate", def: "The enolate of an ester; less stable and harder to form (pKa ≈ 25) than a ketone enolate." },
      { term: "Dieckmann condensation", def: "Intramolecular Claisen condensation forming a ring." },
    ],
  },
  wittig: {
    overview: [
      "The Wittig reaction converts an aldehyde or ketone into an alkene using a phosphorus ylide (phosphorane), R₃P=CR'₂. It is the most dependable way to install a C=C bond exactly where a C=O used to be, with no regiochemical ambiguity.",
      "The ylide carbon attacks the carbonyl carbon while the oxygen bonds to phosphorus — effectively a [2+2] cycloaddition — forming a four-membered oxaphosphetane. This fragments the other way: the P–C electrons become the C=C π bond and the C–O electrons become P=O. The immensely strong P=O bond of triphenylphosphine oxide drives the reaction.",
      "Alkene geometry is set when the oxaphosphetane forms. Unstabilised ylides (R' = alkyl) give mainly Z-alkenes; stabilised ylides (R' = ester, ketone, nitrile) give E-alkenes. The Horner–Wadsworth–Emmons variant uses phosphonate anions and gives E-alkenes with a water-soluble by-product.",
    ],
    conditions: [
      { label: "Ylide preparation", value: "Ph₃P + R'CH₂X (SN2) → phosphonium salt; deprotonate with n-BuLi, NaH or NaHMDS" },
      { label: "Electrophile", value: "Aldehydes (fast) and ketones (slower); esters do not react" },
      { label: "Solvent / temperature", value: "THF or Et₂O, –78 °C to room temperature, under N₂" },
      { label: "By-product", value: "Triphenylphosphine oxide, Ph₃P=O (P=O ≈ 540 kJ mol⁻¹)" },
      { label: "Selectivity", value: "Unstabilised ylide → Z; stabilised ylide → E; HWE → E" },
      { label: "Tolerates", value: "Most functional groups; esters, amides and nitriles survive" },
    ],
    relevance: [
      { course: "Pharmacy", text: "Industrial synthesis of vitamin A and β-carotene (BASF) and of many drug side chains uses Wittig or HWE olefinations." },
      { course: "Pharmacology", text: "Prostaglandin analogues (misoprostol, latanoprost) are made with Wittig chemistry to set the geometry of their alkene side chains." },
      { course: "Biochemistry", text: "A useful contrast with biological olefination: enzymes build C=C bonds by dehydration or decarboxylation, never via phosphorus ylides." },
      { course: "Chemistry", text: "Nobel-Prize chemistry (Wittig, 1979) and the standard example of a reaction driven by a strong bond in the by-product." },
    ],
    examTips: [
      "To find the product, delete the O from the C=O and the Ph₃P from the ylide, then join the two carbons with a double bond.",
      "Mention Ph₃P=O as the driving force by name.",
      "If asked for E vs Z, classify the ylide as stabilised or unstabilised first.",
    ],
    mistakes: [
      "Forming the alkene between the wrong carbons (the ylide carbon bonds to the carbonyl carbon, not the oxygen).",
      "Forgetting that the ylide must be made from a phosphonium salt with a strong base.",
      "Using a Wittig reagent on an ester expecting a product.",
    ],
    keyTerms: [
      { term: "Ylide", def: "A neutral molecule with adjacent opposite charges, e.g. Ph₃P⁺–CH₂⁻ ↔ Ph₃P=CH₂." },
      { term: "Oxaphosphetane", def: "The four-membered P–C–C–O ring intermediate." },
      { term: "Horner–Wadsworth–Emmons", def: "Olefination with a phosphonate carbanion; E-selective, water-soluble by-product." },
    ],
  },
  "friedel-crafts-acylation": {
    overview: [
      "Friedel–Crafts acylation attaches an acyl group (R–C=O) to an aromatic ring. A Lewis acid, usually AlCl₃, pulls chloride off an acyl chloride to generate a linear, resonance-stabilised acylium ion, R–C≡O⁺, a powerful electrophile.",
      "The aromatic π system attacks the acylium carbon. This temporarily destroys aromaticity and gives the σ-complex (arenium or Wheland intermediate), a cyclohexadienyl cation whose positive charge is spread over the ortho and para positions. Loss of the proton from the sp³ carbon restores aromaticity and gives the aryl ketone.",
      "Acylation is cleaner than alkylation: the acylium ion cannot rearrange, and the product ketone is deactivated so it does not react a second time. The ketone oxygen does, however, complex AlCl₃ strongly, so more than one equivalent of Lewis acid is needed.",
    ],
    conditions: [
      { label: "Reagents", value: "Acyl chloride or anhydride + AlCl₃ (≥1 equivalent) in CS₂, CH₂Cl₂ or nitrobenzene" },
      { label: "Substrate", value: "Benzene and activated/mildly deactivated arenes; fails with strongly deactivated rings and basic amines" },
      { label: "Electrophile", value: "Acylium ion R–C≡O⁺ ↔ R–C⁺=O" },
      { label: "Intermediate", value: "σ-complex (arenium ion), charge delocalised ortho/para" },
      { label: "Regiochemistry", value: "Para-selective on monosubstituted activated rings (steric); meta on deactivated rings" },
      { label: "Follow-up", value: "Clemmensen or Wolff–Kishner reduction converts the ketone to an alkyl group without rearrangement" },
    ],
    relevance: [
      { course: "Pharmacy", text: "Aryl ketones made this way are intermediates for ibuprofen, paracetamol precursors, fenofibrate and many other APIs; the Boots ibuprofen route starts with a Friedel–Crafts acylation." },
      { course: "Pharmacology", text: "Understanding electrophilic aromatic substitution explains how drug aromatic rings are hydroxylated by cytochrome P450 via arene-oxide/arenium-like intermediates." },
      { course: "Biochemistry", text: "Electrophilic attack on aromatic rings underlies tyrosine nitration and iodination (thyroid hormone biosynthesis) — same σ-complex logic." },
      { course: "Chemistry", text: "The model electrophilic aromatic substitution; introduces activating/deactivating groups, directing effects and the limits of Lewis-acid catalysis." },
    ],
    examTips: [
      "Draw at least two resonance forms of the acylium ion and all three of the σ-complex.",
      "Explain why acylation does not suffer from polysubstitution or rearrangement, unlike alkylation.",
      "Remember the ketone–AlCl₃ complex when asked why stoichiometric AlCl₃ is needed.",
    ],
    mistakes: [
      "Showing the proton lost before the new C–C bond forms.",
      "Placing the positive charge of the σ-complex on the sp³ carbon or at the meta positions.",
      "Attempting Friedel–Crafts on nitrobenzene or aniline.",
    ],
    keyTerms: [
      { term: "Acylium ion", def: "R–C≡O⁺, the linear electrophile generated from an acyl chloride and AlCl₃." },
      { term: "σ-Complex / arenium ion", def: "The non-aromatic cationic intermediate of electrophilic aromatic substitution." },
      { term: "Lewis acid", def: "An electron-pair acceptor (AlCl₃, FeCl₃) that activates the electrophile." },
    ],
  },
};

export function getNotes(slug: string): ReactionNotes | undefined {
  return notes[slug];
}
