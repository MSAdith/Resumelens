export function scoreSectionStructure(resumeText) {
  const findings = [];
  const fixes = [];
  const maxScore = 10;

  const headings = [
    { name: "Summary / Objective", regex: /(?:summary|objective|profile|about\s+me|professional\s+summary|executive\s+summary|career\s+summary)\b/i },
    { name: "Education", regex: /(?:education|academic\s+background|academic\s+qualifications|degrees|university|college|academics)\b/i },
    { name: "Experience", regex: /(?:work\s+experience|employment\s+history|career\s+history|professional\s+experience|work\s+history|experience)\b/i },
    { name: "Projects", regex: /(?:projects|key\s+projects|personal\s+projects|academic\s+projects|portfolio)\b/i },
    { name: "Skills", regex: /(?:technical\s+skills|core\s+competencies|skills\s+&\s+expertise|technologies|skills)\b/i },
    { name: "Certifications", regex: /(?:certifications|certificates|licenses|credentials|training)\b/i }
  ];

  // Extract lines that look like section headings (short lines < 60 chars, not bullet points)
  const headerLines = resumeText
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0 && l.length < 60 && !/^[•\-\*\d\.]/.test(l));

  const headerText = headerLines.join("\n");

  let detectedCount = 0;
  const missingSections = [];

  headings.forEach(h => {
    if (h.regex.test(headerText)) {
      detectedCount++;
    } else {
      missingSections.push(h.name);
    }
  });

  let score = 0;
  if (detectedCount >= 6) score = 10;
  else if (detectedCount >= 4) score = 8;
  else if (detectedCount >= 2) score = 5;
  else if (detectedCount === 1) score = 2;
  else score = 0;

  findings.push(`Detected ${detectedCount} out of 6 standard ATS section headings.`);

  if (missingSections.length > 0) {
    findings.push(`Missing standard section headers: ${missingSections.join(", ")}.`);
    fixes.push(`Add clear, standard heading titles for missing sections: ${missingSections.slice(0, 3).join(", ")}.`);
  } else {
    findings.push("All core ATS section headers are clearly present and well-structured.");
  }

  score = Math.min(maxScore, Math.max(0, score));

  return {
    name: "Section Structure",
    score,
    max: maxScore,
    findings,
    fixes
  };
}
