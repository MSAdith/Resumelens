import { scoreKeywordMatch } from "./keywordMatcher.js";
import { scoreParseability } from "./parseability.js";
import { scoreSectionStructure } from "./sectionStructure.js";
import { scoreContactInfo } from "./contactInfo.js";
import { scoreExperienceQuality } from "./experienceQuality.js";
import { scoreSkillsRelevance } from "./skillsRelevance.js";
import { scoreLengthReadability } from "./lengthReadability.js";
import { scoreSpellingGrammar } from "./spellingGrammar.js";
import { generateAIRewrites } from "./aiRewriter.js";

export async function analyzeResume(resumeText, jdText = "") {
  const startTime = Date.now();
  const timings = {};

  const runCategory = async (name, fn) => {
    const t0 = Date.now();
    const result = fn();
    timings[name] = Date.now() - t0;
    return result;
  };

  const c1 = await runCategory("Keyword Match", () => scoreKeywordMatch(resumeText, jdText));
  const c2 = await runCategory("Parseability & Format", () => scoreParseability(resumeText));
  const c3 = await runCategory("Section Structure", () => scoreSectionStructure(resumeText));
  const c4 = await runCategory("Contact Information", () => scoreContactInfo(resumeText));
  const c5 = await runCategory("Experience Quality", () => scoreExperienceQuality(resumeText));
  const c6 = await runCategory("Skills Relevance", () => scoreSkillsRelevance(resumeText));
  const c7 = await runCategory("Length & Readability", () => scoreLengthReadability(resumeText));
  const c8 = await runCategory("Spelling & Grammar", () => scoreSpellingGrammar(resumeText));

  const categories = [c1, c2, c3, c4, c5, c6, c7, c8];

  let rawTotal = categories.reduce((acc, cat) => acc + cat.score, 0);

  // ATS Qualification Caps & Anti-Gaming Rules
  // 1. Unsectioned resume cap: if 0 section headers exist, cap total score at 45
  if (c3.score === 0) {
    rawTotal = Math.min(45, rawTotal);
  }

  // 2. Role mismatch cap: if JD is provided but 0 keywords match, cap total score at 45
  if (jdText && jdText.trim().length > 30 && c1.matchedKeywords.length === 0) {
    rawTotal = Math.min(45, rawTotal);
  }

  // 3. Max score cap: never award >95 total score to align with realistic ATS bounds
  const total = Math.min(95, Math.round(rawTotal));

  let verdict = "";
  if (total >= 85) {
    verdict = "Top-tier ATS optimization! Your resume is highly tailored and structurally sound.";
  } else if (total >= 75) {
    verdict = "Strong ATS resume! A few targeted keyword additions will maximize callback rates.";
  } else if (total >= 50) {
    verdict = "Fair ATS compatibility. Addressing keyword gaps and bullet impact will boost your score.";
  } else {
    verdict = "Needs improvement. Critical ATS formatting and keyword alignment issues detected.";
  }

  // Find weak bullets for optional AI layer
  const bulletLines = resumeText.split("\n")
    .map(l => l.trim())
    .filter(l => (l.startsWith("-") || l.startsWith("•") || l.startsWith("*")) && l.length > 20);
  
  const weakBullets = bulletLines.filter(b => 
    b.toLowerCase().includes("responsible for") || 
    b.toLowerCase().includes("worked on") || 
    b.toLowerCase().includes("assisted") ||
    !/\d/.test(b)
  );

  const aiRewrites = await generateAIRewrites(resumeText, weakBullets);

  const totalTimeMs = Date.now() - startTime;

  return {
    total,
    verdict,
    categories,
    matchedKeywords: c1.matchedKeywords || [],
    missingKeywords: c1.missingKeywords || [],
    aiRewrites,
    performanceMs: {
      total: totalTimeMs,
      modules: timings
    }
  };
}
