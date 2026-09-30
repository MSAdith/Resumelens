const STRONG_VERBS = new Set([
  "accelerated", "achieved", "architected", "automated", "built", "spearheaded", "engineered",
  "optimized", "scaled", "decreased", "increased", "developed", "launched", "designed", "streamlined",
  "pioneered", "championed", "delivered", "expanded", "generated", "implemented", "improvised",
  "maximized", "minimized", "orchestrated", "overhauled", "reduced", "revamped", "transformed",
  "established", "executed", "formulated", "headed", "initiated", "introduced", "led", "managed",
  "negotiated", "organized", "produced", "restructured", "upgraded", "yielded", "devised", "crafted",
  "modernized", "migrated", "refactored", "benchmarked", "deployed", "provisioned", "centralized",
  "integrated", "authored", "mentored", "onboarded", "standardized", "supervised", "boosted", "saved"
]);

const WEAK_PHRASES = [
  "responsible for", "worked on", "assisted with", "helped to", "duties included",
  "in charge of", "handled", "helped out", "participated in", "tasked with"
];

export function scoreExperienceQuality(resumeText) {
  const findings = [];
  const fixes = [];
  const maxScore = 15;
  let score = maxScore;

  const lines = resumeText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  const bulletLines = lines.filter(l => /^[•\-\*\d\.\>\–\—]/.test(l));

  const targetLines = bulletLines.length > 0 ? bulletLines : lines.filter(l => l.length > 25 && !l.includes("|"));

  if (targetLines.length === 0) {
    return {
      name: "Experience Quality",
      score: 5,
      max: maxScore,
      findings: ["No distinct bullet points found in work experience."],
      fixes: ["Structure your work history into clear bullet points starting with strong action verbs."]
    };
  }

  // 1. Action Verbs Check
  let strongVerbCount = 0;
  targetLines.forEach(b => {
    const firstWord = b.replace(/^[•\-\*\d\.\>\–\—\s]+/, "").split(/\s+/)[0]?.toLowerCase();
    if (firstWord && STRONG_VERBS.has(firstWord)) {
      strongVerbCount++;
    }
  });

  const verbRatio = strongVerbCount / targetLines.length;
  if (verbRatio >= 0.4) {
    findings.push(`Strong action verbs start ${Math.round(verbRatio * 100)}% of your experience bullets.`);
  } else {
    score -= 4;
    findings.push(`Only ${Math.round(verbRatio * 100)}% of bullets begin with strong action verbs.`);
    fixes.push("Start every bullet point with powerful impact verbs (e.g., 'Spearheaded', 'Architected', 'Optimized', 'Accelerated').");
  }

  // 2. Quantified Impact Check (percentages, $, ₹, INR, Lakhs, 10k users, multiplier scale)
  let quantifiedCount = 0;
  const quantRegex = /(?:\d+%\b|\$\d+|₹\d+|\b\d+\s*(?:lakhs?|crores?|k|m|b)\b|reduced by|increased by|grew|saved|\b\d+x\b|\b\d{2,}\b|\b10k\b)/i;
  
  targetLines.forEach(b => {
    if (quantRegex.test(b)) {
      quantifiedCount++;
    }
  });

  const quantRatio = quantifiedCount / targetLines.length;
  if (quantRatio >= 0.35) {
    findings.push(`Good data measurement! ${Math.round(quantRatio * 100)}% of bullets contain quantified metrics (%, $, ₹, numbers, or scale).`);
  } else {
    score -= 5;
    findings.push(`Only ${Math.round(quantRatio * 100)}% of experience bullets contain metrics or numbers.`);
    fixes.push("Quantify your achievements with numbers, percentages, time saved, or revenue impact (e.g. 'Improved speed by 35%').");
  }

  // 3. Weak Phrases Penalty
  let weakCount = 0;
  const lowerText = resumeText.toLowerCase();
  WEAK_PHRASES.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      weakCount++;
    }
  });

  if (weakCount > 0) {
    score -= Math.min(4, weakCount * 2);
    findings.push(`Detected passive phrases like "responsible for" or "worked on" (${weakCount} instance${weakCount > 1 ? 's' : ''}).`);
    fixes.push("Replace passive wording ('responsible for managing...') with active achievement statements ('Managed and executed...').");
  } else {
    findings.push("Zero passive duty statements detected.");
  }

  score = Math.min(maxScore, Math.max(0, score));

  return {
    name: "Experience Quality",
    score,
    max: maxScore,
    findings,
    fixes
  };
}
