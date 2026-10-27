/*
 * ReactIQ tutor — a local, deterministic question answerer.
 * It understands intents (steps, conditions, exam tips, mistakes, relevance,
 * definitions, comparisons), scores keyword matches against the reaction's
 * own knowledge plus a general organic-chemistry base, and always returns
 * something useful with follow-up prompts.
 */
import { generalKnowledge, reactions, type ChatEntry, type Reaction } from "./reactions";
import { getNotes } from "./notes";

export type TutorReply = { text: string; followUps: string[] };

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9αβ₂₃+\-= ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const has = (q: string, ...words: string[]) => words.some((w) => q.includes(w));

/* ---------- general chemistry knowledge (beyond the per-reaction entries) ---------- */
export const chemistryBasics: ChatEntry[] = [
  {
    keywords: ["hybridi", "sp3", "sp2", "sp "],
    answer:
      "Hybridisation tells you the shape. sp³ carbons (four σ bonds) are tetrahedral with 109.5° angles; sp² carbons (three σ bonds + one π) are trigonal planar at 120°; sp carbons (two σ + two π) are linear. Carbocations and carbonyl carbons are sp², which is why they are flat and can be attacked from either face.",
  },
  {
    keywords: ["resonance", "delocal", "mesomer"],
    answer:
      "Resonance structures are different ways of drawing the same molecule's electrons — the real molecule is a weighted average. Charge spread over more atoms (as in enolates, carboxylates, the acylium ion and the σ-complex) means greater stability. Curly arrows between resonance forms move only π electrons and lone pairs, never atoms.",
  },
  {
    keywords: ["pka", "acidity", "how acidic", "acid strength"],
    answer:
      "Lower pKa = stronger acid. Useful anchors: carboxylic acids ≈ 5, phenols ≈ 10, β-dicarbonyls ≈ 9–13, water ≈ 15.7, alcohols ≈ 16–18, ketone α-H ≈ 19–20, ester α-H ≈ 25, terminal alkynes ≈ 25, amines (N–H) ≈ 35–38, alkanes ≈ 50. A base can only remove a proton whose pKa is lower than the pKa of the base's conjugate acid (or close to it, if the next step is irreversible).",
  },
  {
    keywords: ["markovnikov", "regiochem", "regioselect"],
    answer:
      "Regiochemistry is about which position reacts. Markovnikov's rule (electrophilic addition to alkenes) says H adds to the carbon that already has more hydrogens, because that puts the positive charge on the more substituted, more stable carbon. In eliminations, Zaitsev vs Hofmann is the equivalent question.",
  },
  {
    keywords: ["stereospecific", "stereoselective", "difference between stereo"],
    answer:
      "Stereospecific: different stereoisomers of the starting material give different stereoisomers of product because the mechanism demands it (SN2 inversion, E2 anti elimination, Diels–Alder). Stereoselective: one stereoisomer forms preferentially even from the same starting material (E alkene from E1, endo adduct). All stereospecific reactions are stereoselective; the reverse is not true.",
  },
  {
    keywords: ["kinetic", "thermodynamic control", "thermodynamic product"],
    answer:
      "Under kinetic control the product that forms fastest (lowest activation energy) dominates — low temperature, irreversible. Under thermodynamic control the most stable product dominates — higher temperature, reversible conditions, time to equilibrate. The endo Diels–Alder adduct and the Z-alkene from an unstabilised Wittig are kinetic products.",
  },
  {
    keywords: ["rate determining", "rate-determining", "slow step", "rds"],
    answer:
      "The rate-determining step is the slowest step — the highest energy barrier on the reaction profile. Only species involved up to and including that step appear in the rate law. That is why SN1/E1 (ionisation is slow) are first order and SN2/E2 (one concerted step) are second order.",
  },
  {
    keywords: ["sn1 vs sn2", "sn2 vs sn1", "sn1 or sn2", "substitution or elimination", "which mechanism", "decide", "predict the mechanism"],
    answer:
      "Decision checklist: (1) Substrate — methyl/primary → SN2/E2; tertiary → SN1/E1 (or E2 with strong base); secondary → depends. (2) Nucleophile/base — strong anionic nucleophile → SN2; strong bulky base → E2; weak neutral nucleophile (H₂O, ROH) → SN1/E1. (3) Solvent — polar aprotic favours SN2/E2; polar protic favours SN1/E1. (4) Heat favours elimination over substitution.",
  },
  {
    keywords: ["protic", "aprotic", "solvent effect", "dmso", "dmf"],
    answer:
      "Polar protic solvents (water, alcohols, acetic acid) have O–H bonds that hydrogen-bond anions, stabilising carbocations and leaving groups (good for SN1/E1) but caging nucleophiles (bad for SN2). Polar aprotic solvents (DMSO, DMF, acetone, acetonitrile) dissolve salts but leave the anion 'naked', so SN2 is up to a million times faster.",
  },
  {
    keywords: ["nucleophilicity", "strong nucleophile", "weak nucleophile", "good nucleophile"],
    answer:
      "Nucleophilicity rises with negative charge (HO⁻ > H₂O), with polarisability (I⁻ > Br⁻ > Cl⁻ in protic solvents; RS⁻ > RO⁻) and falls with steric bulk (tBuO⁻ is a strong base but a poor nucleophile). It is a kinetic property, unlike basicity, which is thermodynamic.",
  },
  {
    keywords: ["electron withdrawing", "electron donating", "ewg", "edg", "inductive"],
    answer:
      "Electron-withdrawing groups (NO₂, C=O, CN, CF₃, halogens by induction) pull electron density away: they stabilise anions/enolates, make carbonyls more electrophilic and deactivate aromatic rings. Electron-donating groups (alkyl, OR, NR₂) push density in: they stabilise carbocations and activate rings towards electrophiles.",
  },
  {
    keywords: ["energy profile", "reaction coordinate", "activation energy", "diagram"],
    answer:
      "A reaction-coordinate diagram plots energy against progress. Each maximum is a transition state (‡); each valley between maxima is an intermediate. One-step mechanisms (SN2, E2, Diels–Alder) have a single hump; SN1/E1 have two humps with the carbocation in the valley; the first, higher hump is rate-determining.",
  },
  {
    keywords: ["hammond"],
    answer:
      "Hammond's postulate: a transition state resembles whichever species — reactant or product/intermediate — is closer to it in energy. For an endothermic step (ionisation to a carbocation) the TS looks like the carbocation, so factors that stabilise the cation lower the barrier.",
  },
  {
    keywords: ["aromatic", "aromaticity", "huckel", "hückel", "4n+2"],
    answer:
      "A ring is aromatic when it is planar, fully conjugated and holds 4n+2 π electrons (Hückel's rule: 2, 6, 10 …). Breaking aromaticity costs ~150 kJ mol⁻¹ for benzene, which is why electrophilic aromatic substitution restores it by losing H⁺ rather than adding a nucleophile.",
  },
  {
    keywords: ["enol", "tautomer", "keto-enol", "keto enol"],
    answer:
      "Keto–enol tautomerism interconverts a carbonyl with its enol (C=C–OH) by moving a proton and a double bond; the two are isomers, not resonance forms. The keto form is usually more stable, but the enol/enolate is the nucleophilic species in aldol, Claisen and halogenation reactions.",
  },
  {
    keywords: ["michael", "conjugate addition", "1,4-addition", "1 4 addition"],
    answer:
      "Michael (conjugate, 1,4-) addition is nucleophilic attack at the β-carbon of an α,β-unsaturated carbonyl — the enones made by aldol condensation. Soft nucleophiles (enolates, thiols, amines, cuprates) prefer 1,4-addition; hard ones (Grignards, hydrides) tend to add 1,2 at the carbonyl.",
  },
  {
    keywords: ["chiral", "chirality", "stereocentre", "stereocenter", "enantiomer", "r and s", "optical"],
    answer:
      "A stereocentre is a carbon with four different groups; swapping two inverts its configuration (R ↔ S). Enantiomers are non-superimposable mirror images with identical physical properties except the direction they rotate plane-polarised light — and, crucially for pharmacology, often very different biological activity.",
  },
  {
    keywords: ["drug", "medicine", "pharma", "why learn", "why do i need", "real life", "relevan"],
    answer:
      "Every drug is made by, and is broken down by, reaction mechanisms. Mechanisms explain why a prodrug ester is activated in plasma, why an alkylating agent damages DNA, why a tertiary alcohol in a drug can dehydrate on the shelf, and how an enzyme active site works. Ask 'why does this matter for pharmacy?' on any reaction page to see its clinical connections.",
  },
  {
    keywords: ["how to study", "memori", "remember mechanisms", "tips for learning", "how do i learn"],
    answer:
      "Don't memorise arrows — learn the five questions: Where are the electrons (nucleophile)? Where is the hole (electrophile)? What leaves, and is it happy to leave? What is the geometry? What is the rate law? Watch the 2D animation once, then rebuild the mechanism yourself from a blank page, then check with the 3D view for stereochemistry. Repeat tomorrow.",
  },
];

/* ---------- helpers that turn notes into prose ---------- */
function stepsText(r: Reaction) {
  return r.steps.map((s, i) => `Step ${i + 1} — ${s.title}\n${s.text}`).join("\n\n");
}
function conditionsText(r: Reaction) {
  const n = getNotes(r.slug);
  if (!n) return r.summary;
  return `Typical conditions for the ${r.name}:\n\n` + n.conditions.map((c) => `• ${c.label}: ${c.value}`).join("\n");
}
function tipsText(r: Reaction) {
  const n = getNotes(r.slug);
  if (!n) return r.summary;
  return `Exam tips for the ${r.name}:\n\n` + n.examTips.map((t) => `• ${t}`).join("\n");
}
function mistakesText(r: Reaction) {
  const n = getNotes(r.slug);
  if (!n) return r.summary;
  return `Common mistakes in the ${r.name}:\n\n` + n.mistakes.map((t) => `✗ ${t}`).join("\n");
}
function relevanceText(r: Reaction, course?: string) {
  const n = getNotes(r.slug);
  if (!n) return r.summary;
  const items = course ? n.relevance.filter((x) => x.course.toLowerCase().startsWith(course)) : n.relevance;
  const list = items.length ? items : n.relevance;
  return `Why the ${r.name} matters:\n\n` + list.map((x) => `• ${x.course}: ${x.text}`).join("\n\n");
}
function overviewText(r: Reaction) {
  const n = getNotes(r.slug);
  return n ? n.overview.join("\n\n") : r.summary;
}
function termsText(r: Reaction, q: string) {
  const n = getNotes(r.slug);
  if (!n) return null;
  const hit = n.keyTerms.find((t) => q.includes(norm(t.term)) || norm(t.term).split(" ").some((w) => w.length > 4 && q.includes(w)));
  if (hit) return `${hit.term}: ${hit.def}`;
  return null;
}
function compareText(a: Reaction, b: Reaction) {
  const na = getNotes(a.slug);
  const nb = getNotes(b.slug);
  const kin = (n?: ReturnType<typeof getNotes>) => n?.conditions.find((c) => c.label === "Kinetics")?.value ?? "—";
  const st = (n?: ReturnType<typeof getNotes>) => n?.conditions.find((c) => /Stereo|Regio/.test(c.label))?.value ?? "—";
  return (
    `${a.name} vs ${b.name}\n\n` +
    `${a.name}: ${a.summary}\n• Kinetics: ${kin(na)}\n• Stereo/regio: ${st(na)}\n\n` +
    `${b.name}: ${b.summary}\n• Kinetics: ${kin(nb)}\n• Stereo/regio: ${st(nb)}`
  );
}

function scoreEntry(q: string, entry: ChatEntry) {
  let score = 0;
  for (const k of entry.keywords) {
    const kk = norm(k);
    if (!kk) continue;
    if (q.includes(kk)) score += kk.includes(" ") ? 3 : 2;
    else if (kk.length > 5 && q.split(" ").some((w) => w.startsWith(kk.slice(0, 5)))) score += 1;
  }
  return score;
}

const defaultFollowUps = (r: Reaction) => [
  `What are the conditions for the ${r.name}?`,
  `Common mistakes in the ${r.name}?`,
  `Why does the ${r.name} matter for pharmacy?`,
];

export function answer(r: Reaction, question: string): TutorReply {
  const q = norm(question);
  const follow = defaultFollowUps(r);

  if (!q) return { text: `Ask me anything about the ${r.name} — the steps, the conditions, stereochemistry, or why it matters for your course.`, followUps: follow };

  // greetings / meta
  if (/^(hi|hello|hey|good (morning|afternoon|evening))\b/.test(q)) {
    return { text: `Hi! I'm the ReactIQ tutor. We're on the ${r.name}. ${r.summary} Ask me about a step, the conditions, the stereochemistry, or how it shows up in pharmacy and biochemistry.`, followUps: [`Walk me through the ${r.name} step by step`, ...follow.slice(0, 2)] };
  }

  // comparison: "sn1 vs sn2", "compare aldol and claisen", "difference between e1 and e2"
  const pos = (x: Reaction) => {
    const keys = [norm(x.name), x.slug.replace(/-/g, " "), x.slug];
    const idx = keys.map((k) => q.indexOf(k)).filter((i) => i >= 0);
    return idx.length ? Math.min(...idx) : -1;
  };
  const mentioned = reactions.filter((x) => pos(x) >= 0).sort((a, b) => pos(a) - pos(b));
  if ((has(q, " vs", "versus", "compare", "difference", "differ") && mentioned.length >= 1) || mentioned.length >= 2) {
    const a = mentioned[0] ?? r;
    const b = mentioned.find((x) => x.slug !== a.slug) ?? (a.slug === r.slug ? undefined : r);
    if (b) return { text: compareText(a, b), followUps: [`Conditions for the ${a.name}?`, `Conditions for the ${b.name}?`, `Which is faster, ${a.name} or ${b.name}?`] };
  }

  // intents
  if (has(q, "step by step", "walk me", "all the steps", "whole mechanism", "full mechanism", "show the mechanism", "how does it work", "how does the", "explain the mechanism"))
    return { text: stepsText(r), followUps: [`Why is step 1 the slow step?`, `What is the transition state like?`, ...follow.slice(0, 1)] };
  if (has(q, "condition", "reagent", "solvent", "temperature", "catalyst", "what do i need", "how do you run", "how is it done", "set up"))
    return { text: conditionsText(r), followUps: [`Why that solvent?`, `What is the rate law?`, `What can go wrong?`] };
  if (has(q, "exam", "tip", "marks", "examiner", "how to answer", "what should i write"))
    return { text: tipsText(r), followUps: [`Common mistakes in the ${r.name}?`, `Key terms I should know?`, `Walk me through it step by step`] };
  if (has(q, "mistake", "wrong", "error", "pitfall", "go wrong", "careful", "trap"))
    return { text: mistakesText(r), followUps: [`Exam tips for the ${r.name}?`, `Walk me through it step by step`, ...follow.slice(0, 1)] };
  const course = ["pharmacy", "pharmacol", "biochem", "chemistry"].find((c) => q.includes(c));
  if (has(q, "matter", "relevan", "real life", "real world", "drug", "medicine", "enzyme", "body", "clinical", "why learn", "use", "application", "important") || course)
    return { text: relevanceText(r, course === "pharmacol" ? "pharmacol" : course), followUps: [`Walk me through it step by step`, `Exam tips for the ${r.name}?`, `What are the key terms?`] };
  if (has(q, "key term", "glossary", "vocab", "terms"))
    return {
      text: (getNotes(r.slug)?.keyTerms ?? []).map((t) => `${t.term}: ${t.def}`).join("\n\n") || r.summary,
      followUps: follow,
    };
  if (has(q, "overview", "summar", "in short", "one sentence", "briefly", "what is the", "what is a", "tell me about", "explain the", "introduce"))
    return { text: overviewText(r), followUps: [`Walk me through it step by step`, ...follow.slice(0, 2)] };

  // specific step by number
  const stepNum = q.match(/step (\d)/);
  if (stepNum) {
    const s = r.steps[Number(stepNum[1]) - 1];
    if (s) return { text: `Step ${stepNum[1]} — ${s.title}\n\n${s.text}`, followUps: [`Why does that step happen?`, `What comes next?`, ...follow.slice(0, 1)] };
  }
  const stepHit = r.steps.find((s) => norm(s.title).split(" ").some((w) => w.length > 4 && q.includes(w)));

  // scored knowledge lookup (reaction-specific first, then general)
  const pool: { entry: ChatEntry; score: number; src: number }[] = [];
  r.chat.forEach((e) => pool.push({ entry: e, score: scoreEntry(q, e) * 1.2, src: 0 }));
  generalKnowledge.forEach((e) => pool.push({ entry: e, score: scoreEntry(q, e), src: 1 }));
  chemistryBasics.forEach((e) => pool.push({ entry: e, score: scoreEntry(q, e), src: 2 }));
  pool.sort((a, b) => b.score - a.score || a.src - b.src);
  const best = pool[0];
  const term = termsText(r, q);
  if (best && best.score >= 2) {
    const second = pool[1];
    const extra = second && second.score >= 3 && second.entry !== best.entry ? `\n\nRelated: ${second.entry.answer}` : "";
    const def = term && !best.entry.answer.includes(term.split(":")[0] ?? "") ? `\n\nDefinition — ${term}` : "";
    return { text: best.entry.answer + extra + def, followUps: follow };
  }
  if (term) return { text: term, followUps: follow };
  if (stepHit) return { text: `${stepHit.title}\n\n${stepHit.text}`, followUps: follow };

  // why / how generic
  if (has(q, "why")) return { text: `Good 'why' question. Here's the reasoning behind the ${r.name}:\n\n${overviewText(r)}`, followUps: [`Walk me through it step by step`, ...follow.slice(0, 2)] };

  return {
    text: `I don't have a specific note on that yet, but here's the core idea of the ${r.name}:\n\n${overviewText(r).split("\n\n")[0]}\n\nTry asking about a specific step, the conditions, stereochemistry, exam tips, or why it matters for your course — or switch to 2D/3D mode and watch it happen.`,
    followUps: [`Walk me through it step by step`, ...follow.slice(0, 2)],
  };
}
