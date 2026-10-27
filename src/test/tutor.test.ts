import { describe, expect, it } from "vitest";
import { getReaction, reactions } from "@/data/reactions";
import { answer } from "@/data/tutor";
import { getNotes } from "@/data/notes";

describe("study notes", () => {
  it("exist for every reaction and are substantial", () => {
    for (const r of reactions) {
      const n = getNotes(r.slug);
      expect(n, r.slug).toBeDefined();
      expect(n!.overview.join(" ").length).toBeGreaterThan(400);
      expect(n!.conditions.length).toBeGreaterThanOrEqual(5);
      expect(n!.relevance.map((x) => x.course).sort()).toEqual(["Biochemistry", "Chemistry", "Pharmacology", "Pharmacy"]);
      expect(n!.examTips.length).toBeGreaterThanOrEqual(3);
      expect(n!.mistakes.length).toBeGreaterThanOrEqual(3);
      expect(n!.keyTerms.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("tutor", () => {
  const sn2 = getReaction("sn2")!;
  it("answers intents with the right section", () => {
    expect(answer(sn2, "walk me through it step by step").text).toContain("Step 1");
    expect(answer(sn2, "what are the conditions?").text).toContain("Solvent");
    expect(answer(sn2, "any exam tips?").text).toContain("Exam tips");
    expect(answer(sn2, "common mistakes").text).toContain("✗");
    expect(answer(sn2, "why does this matter for pharmacy").text).toContain("Pharmacy");
    expect(answer(sn2, "what is walden inversion").text.toLowerCase()).toContain("inversion");
    expect(answer(sn2, "sn1 vs sn2").text).toContain("SN1 vs SN2");
    expect(answer(sn2, "what is hybridisation").text).toContain("sp³");
  });
  it("always returns follow-ups and never an empty answer", () => {
    for (const r of reactions) {
      for (const q of ["hi", "why", "rate law?", "stereochemistry", "banana", ...r.suggestions]) {
        const a = answer(r, q);
        expect(a.text.length, `${r.slug}: ${q}`).toBeGreaterThan(40);
        expect(a.followUps.length).toBeGreaterThan(0);
      }
    }
  });
});
