import { SKILLS_DICTIONARY_WORDS } from "./skillsDictionary.js";

// Extended technical terms dictionary so technical words/proper nouns are never flagged as typos
const TECH_AND_COMMON_WORDS = new Set([
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as",
  "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will",
  "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which",
  "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into",
  "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only",
  "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first",
  "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us", "engineered",
  "developed", "designed", "implemented", "managed", "led", "spearheaded", "optimized", "built", "accelerated",
  "created", "maintained", "collaborated", "improved", "increased", "decreased", "reduced", "delivered",
  "executed", "directed", "formulated", "established", "architected", "integrated", "automated", "scaled",
  "experience", "education", "skills", "summary", "projects", "certifications", "university", "college",
  "bachelor", "master", "degree", "science", "arts", "engineering", "business", "administration", "software",
  "senior", "junior", "lead", "principal", "manager", "director", "consultant", "intern", "associate",
  "full", "stack", "frontend", "backend", "web", "mobile", "cloud", "data", "system", "systems", "application",
  "applications", "service", "services", "platform", "platforms", "solution", "solutions", "team", "teams",
  "project", "user", "users", "customer", "customers", "client", "clients", "code", "database", "api", "apis",
  "quality", "performance", "security", "infrastructure", "deployment", "testing", "architecture", "design",
  "development", "management", "analysis", "strategy", "support", "operations", "process", "processes",
  "present", "current", "january", "february", "march", "april", "may", "june", "july", "august", "september",
  "october", "november", "december", "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "oct", "nov", "dec",
  "gpa", "phone", "email", "linkedin", "github", "location", "address", "city", "state", "remote", "hybrid",
  "react", "node", "express", "postgres", "postgresql", "mongodb", "redis", "docker", "kubernetes", "k8s",
  "typescript", "javascript", "python", "golang", "rust", "aws", "gcp", "azure", "ci/cd", "rest", "graphql"
]);

export function scoreSpellingGrammar(resumeText) {
  const findings = [];
  const fixes = [];
  const maxScore = 5;
  let score = maxScore;

  if (!resumeText) {
    return { name: "Spelling & Grammar", score: 0, max: maxScore, findings: ["Empty text."], fixes: [] };
  }

  const words = resumeText
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length > 2);

  const suspectWords = new Set();

  for (const word of words) {
    const lower = word.toLowerCase();

    // Skip numbers, uppercase acronyms, dictionary matches, technical terms
    if (/^\d+$/.test(word)) continue;
    if (word === word.toUpperCase() && word.length <= 4) continue;
    if (SKILLS_DICTIONARY_WORDS.has(lower)) continue;
    if (TECH_AND_COMMON_WORDS.has(lower)) continue;

    // Detect actual typos like "teest", "swwimming", "proogramm"
    if (/(.)\1\1+/.test(lower)) {
      suspectWords.add(word);
    }
  }

  const suspectCount = suspectWords.size;

  if (suspectCount === 0) {
    findings.push("Clean spelling and grammar scan. Technical terms and standard vocabulary checked.");
  } else if (suspectCount <= 3) {
    score -= 1;
    findings.push(`Spelling scan flagged ${suspectCount} potential typo artifact: ${Array.from(suspectWords).join(", ")}.`);
    fixes.push("Review flagged words for minor typos or unconventional formatting.");
  } else {
    score -= 2.5;
    findings.push(`Flagged ${suspectCount} possible spelling/formatting anomalies.`);
    fixes.push("Run a thorough spellcheck to fix typos in job titles and project descriptions.");
  }

  score = Math.min(maxScore, Math.max(0, Math.round(score)));

  return {
    name: "Spelling & Grammar",
    score,
    max: maxScore,
    findings,
    fixes
  };
}
