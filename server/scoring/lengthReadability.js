export function scoreLengthReadability(resumeText) {
  const findings = [];
  const fixes = [];
  const maxScore = 5;
  let score = maxScore;

  // 1. Total Word Count Check (Ideal: 250 - 800 words)
  const words = resumeText.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  if (wordCount >= 250 && wordCount <= 800) {
    findings.push(`Optimal word count (${wordCount} words). Fits standard 1-2 page ATS guidelines.`);
  } else if (wordCount < 250) {
    score -= 2;
    findings.push(`Resume word count is low (${wordCount} words). Minimum recommended length is 250 words.`);
    fixes.push("Expand on project scope, key responsibilities, and quantified impacts to provide more context.");
  } else {
    score -= 1.5;
    findings.push(`Resume word count is slightly long (${wordCount} words). Ideal length is under 800 words.`);
    fixes.push("Trim overly verbose descriptions to keep your resume concise and high-impact.");
  }

  // 2. Average Bullet Length Check (Ideal: 10 - 28 words per bullet)
  const bullets = resumeText.split("\n")
    .map(l => l.trim())
    .filter(l => /^[•\-\*\d\.\>]/.test(l) || (l.length > 20 && l.length < 250));

  if (bullets.length > 0) {
    const totalBulletWords = bullets.reduce((sum, b) => sum + b.split(/\s+/).length, 0);
    const avgBulletWords = Math.round(totalBulletWords / bullets.length);

    if (avgBulletWords >= 10 && avgBulletWords <= 28) {
      findings.push(`Bullet lengths are punchy and readable (avg ${avgBulletWords} words per bullet).`);
    } else if (avgBulletWords < 10) {
      score -= 1;
      findings.push(`Bullet points are very brief (avg ${avgBulletWords} words).`);
      fixes.push("Add context and action details to short bullets.");
    } else {
      score -= 1;
      findings.push(`Bullet points are overly lengthy (avg ${avgBulletWords} words).`);
      fixes.push("Break dense bullet paragraphs into focused single-sentence achievements (10-25 words each).");
    }
  }

  // 3. Date Format Consistency Check
  const mmmYyyyCount = (resumeText.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}/gi) || []).length;
  const mmYyyyCount = (resumeText.match(/\b\d{2}\/\d{4}\b/g) || []).length;
  const yyyyOnlyCount = (resumeText.match(/\b(?:19|20)\d{2}\s*[-–—]\s*(?:(?:19|20)\d{2}|Present)\b/gi) || []).length;

  if ((mmmYyyyCount > 0 && mmYyyyCount > 0) || (mmYyyyCount > 0 && yyyyOnlyCount > 0)) {
    score -= 1;
    findings.push("Inconsistent date formats detected across work history.");
    fixes.push("Use a single, consistent date format throughout your resume (e.g. 'Jan 2021 – Present').");
  } else {
    findings.push("Consistent date formatting across work history.");
  }

  score = Math.min(maxScore, Math.max(0, Math.round(score)));

  return {
    name: "Length & Readability",
    score,
    max: maxScore,
    findings,
    fixes
  };
}
