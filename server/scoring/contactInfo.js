export function scoreContactInfo(resumeText) {
  const findings = [];
  const fixes = [];
  const maxScore = 5;
  let score = 0;

  // 1. Email check
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
  const hasEmail = emailRegex.test(resumeText);
  if (hasEmail) score += 2;
  else {
    findings.push("No email address detected in text.");
    fixes.push("Add a professional email address (e.g. name@domain.com).");
  }

  // 2. Phone check (supports US, Indian +91, 10-digit mobile, 5-digit spaced, and international formats)
  const phoneRegex = /(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b[6-9]\d{9}\b|\b\d{5}[\s-]?\d{5}\b/;
  const hasPhone = phoneRegex.test(resumeText);
  if (hasPhone) score += 1.5;
  else {
    findings.push("No valid phone number detected.");
    fixes.push("Include your phone number with country/area code.");
  }

  // 3. Online Profiles (LinkedIn, GitHub, Portfolio)
  const linkedinRegex = /(?:linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i;
  const githubRegex = /(?:github\.com\/[a-zA-Z0-9_-]+)/i;
  const webRegex = /(?:https?:\/\/|www\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;

  const hasLinkedIn = linkedinRegex.test(resumeText);
  const hasGitHub = githubRegex.test(resumeText);
  const hasWeb = webRegex.test(resumeText);

  if (hasLinkedIn || hasGitHub || hasWeb) {
    score += 1.5;
    const found = [];
    if (hasLinkedIn) found.push("LinkedIn");
    if (hasGitHub) found.push("GitHub");
    if (hasWeb && !hasLinkedIn && !hasGitHub) found.push("Portfolio");
    findings.push(`Online presence detected: ${found.join(", ")}.`);
  } else {
    findings.push("No LinkedIn or GitHub profile URLs found.");
    fixes.push("Include a link to your professional LinkedIn profile or GitHub repository.");
  }

  score = Math.min(maxScore, Math.round(score));

  if (score === maxScore) {
    findings.unshift("Complete contact info present (Email, Phone, Professional links).");
  }

  return {
    name: "Contact Information",
    score,
    max: maxScore,
    findings,
    fixes
  };
}
