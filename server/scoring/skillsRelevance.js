export function scoreSkillsRelevance(resumeText) {
  const findings = [];
  const fixes = [];
  const maxScore = 5;
  let score = 0;

  // 1. Dedicated Skills Section check
  const hasSkillsHeading = /(?:skills|technical skills|core competencies|technologies):?/i.test(resumeText);

  if (hasSkillsHeading) {
    score += 3;
    findings.push("Dedicated Skills section detected.");

    // 2. Sub-categorization check (e.g. "Languages:", "Frameworks:", "Tools:", "Databases:", "Cloud:")
    const categoriesRegex = /(?:languages|frameworks|tools|databases|cloud|libraries|platforms|methodologies|soft skills):/i;
    const isCategorized = categoriesRegex.test(resumeText);

    if (isCategorized) {
      score += 2;
      findings.push("Skills are neatly categorized into functional sub-groups (e.g., Languages, Frameworks, Databases).");
    } else {
      score += 1;
      findings.push("Skills section is present, but listed as an uncategorized block.");
      fixes.push("Organize your skills into distinct categories (e.g., 'Programming Languages', 'Frameworks', 'DevOps & Tools').");
    }
  } else {
    findings.push("No explicit 'Skills' section heading detected.");
    fixes.push("Create a clear 'Skills' section near the top or bottom of your resume to highlight your core competencies.");
  }

  score = Math.min(maxScore, score);

  return {
    name: "Skills Relevance",
    score,
    max: maxScore,
    findings,
    fixes
  };
}
