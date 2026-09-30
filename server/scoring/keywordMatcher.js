import { SKILL_MAP, ALL_SKILLS, normalizeSkill } from "./skillsDictionary.js";

const STOPWORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing",
  "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
  "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself",
  "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is",
  "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no",
  "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves",
  "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't",
  "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then",
  "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those",
  "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll",
  "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's",
  "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't",
  "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves",
  "work", "job", "role", "responsibilities", "requirements", "qualification", "qualifications",
  "experience", "years", "candidate", "ability", "strong", "knowledge", "working", "looking", "team",
  "company", "position", "degree", "preferred", "required", "skills", "must", "plus", "understanding"
]);

// Exact skill regex matcher to prevent false positives (e.g. Java vs JavaScript)
function createSkillRegex(key) {
  const escaped = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  if (/^[a-zA-Z0-9_]+$/.test(key)) {
    return new RegExp(`\\b${escaped}\\b`, "gi");
  }
  return new RegExp(`(?:^|[^a-zA-Z0-9#+.])${escaped}(?=[^a-zA-Z0-9#+]|$)`, "gi");
}

// Extract canonical skills & count frequencies
export function extractKeywords(text) {
  if (!text) return new Map();
  const lowerText = text.toLowerCase();
  const foundKeywords = new Map(); // Canonical Name -> Count

  // 1. Scan for known dictionary skills using strict boundary regex
  for (const [key, canonical] of SKILL_MAP.entries()) {
    const regex = createSkillRegex(key);
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      const current = foundKeywords.get(canonical) || 0;
      foundKeywords.set(canonical, current + matches.length);
    }
  }

  // 2. Tokenize remaining words for domain terms
  const tokens = lowerText.split(/[^a-zA-Z0-9#+.]+/).filter(t => t.length > 2 && !STOPWORDS.has(t));
  tokens.forEach(token => {
    const canonical = normalizeSkill(token);
    if (canonical && !foundKeywords.has(canonical)) {
      foundKeywords.set(canonical, 1);
    }
  });

  return foundKeywords;
}

// Simple TF-IDF cosine similarity bonus
function calculateCosineSimilarity(textA, textB) {
  const getVector = (text) => {
    const words = text.toLowerCase().split(/[^a-zA-Z0-9]+/).filter(w => w.length > 2 && !STOPWORDS.has(w));
    const freq = new Map();
    words.forEach(w => freq.set(w, (freq.get(w) || 0) + 1));
    return freq;
  };

  const vecA = getVector(textA);
  const vecB = getVector(textB);

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const val of vecA.values()) normA += val * val;
  for (const val of vecB.values()) normB += val * val;

  for (const [word, countA] of vecA.entries()) {
    if (vecB.has(word)) {
      dotProduct += countA * vecB.get(word);
    }
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function scoreKeywordMatch(resumeText, jdText) {
  const findings = [];
  const fixes = [];
  const maxScore = 35;

  const resumeLower = resumeText.toLowerCase();
  const resumeSkills = extractKeywords(resumeText);

  let matchedKeywords = [];
  let missingKeywords = [];
  let score = 0;

  // 1. Anti-Keyword Stuffing Check (>6 occurrences of the same skill)
  const stuffedSkills = [];
  for (const [canonical, count] of resumeSkills.entries()) {
    if (count > 6) {
      stuffedSkills.push({ skill: canonical, count });
    }
  }

  if (jdText && jdText.trim().length > 30) {
    // JD provided - match against JD
    const jdKeywords = extractKeywords(jdText);
    
    if (jdKeywords.size === 0) {
      findings.push("Job description contains generic wording; extracted general requirements.");
      score = 25;
    } else {
      let totalWeight = 0;
      let matchedWeight = 0;

      for (const [canonical, weight] of jdKeywords.entries()) {
        totalWeight += weight;
        let matched = resumeSkills.has(canonical);
        
        if (!matched) {
          // Check synonyms
          for (const [syn, can] of SKILL_MAP.entries()) {
            if (can === canonical) {
              const regex = createSkillRegex(syn);
              if (regex.test(resumeLower)) {
                matched = true;
                break;
              }
            }
          }
        }

        if (matched) {
          matchedWeight += weight;
          matchedKeywords.push(canonical);
        } else {
          missingKeywords.push(canonical);
        }
      }

      const ratio = totalWeight > 0 ? matchedWeight / totalWeight : 0.5;
      score = Math.round(ratio * maxScore);

      // Semantic similarity bonus (up to +5 points inside keyword score)
      const similarity = calculateCosineSimilarity(resumeText, jdText);
      if (similarity > 0.25) {
        const bonus = Math.min(5, Math.round(similarity * 8));
        score = Math.min(maxScore, score + bonus);
        findings.push(`High contextual similarity with job description (+${bonus} bonus).`);
      }

      findings.push(`Matched ${matchedKeywords.length} out of ${jdKeywords.size} key skills from the job description.`);
      if (missingKeywords.length > 0) {
        findings.push(`Missing high-priority JD keywords: ${missingKeywords.slice(0, 5).join(", ")}.`);
        fixes.push(`Incorporate missing job keywords directly into your skills and experience section: ${missingKeywords.slice(0, 4).join(", ")}.`);
      } else {
        findings.push("Excellent keyword alignment! Your resume covers all key job requirements.");
      }
    }
  } else {
    // General benchmark fallback
    findings.push("No job description provided. Evaluating against general tech & business skill benchmarks.");
    
    const count = resumeSkills.size;
    if (count >= 12) {
      score = 32;
      findings.push(`Found ${count} recognizable industry skills in your resume.`);
    } else if (count >= 7) {
      score = 24;
      findings.push(`Found ${count} skills. Adding more domain-specific technical terms will improve ATS score.`);
      fixes.push("Add a dedicated skills section listing core tools, languages, and frameworks.");
    } else {
      score = 14;
      findings.push(`Only ${count} core skills detected. ATS parsers rely heavily on explicit skill keywords.`);
      fixes.push("Paste a target job description to get a precise keyword gap analysis, and add relevant technical skills.");
    }

    matchedKeywords = Array.from(resumeSkills.keys());
    const popularSkills = ["Git", "SQL", "Agile", "REST API", "Docker", "CI/CD", "Python", "JavaScript", "AWS", "Communication"];
    missingKeywords = popularSkills.filter(s => !resumeSkills.has(s)).slice(0, 5);
  }

  // Apply keyword stuffing penalty if detected
  if (stuffedSkills.length > 0) {
    const penalty = Math.min(10, stuffedSkills.length * 5);
    score = Math.max(5, score - penalty);
    const names = stuffedSkills.map(s => `"${s.skill}" (${s.count}x)`).join(", ");
    findings.push(`WARNING: Keyword stuffing detected for ${names}. Excessive repetition triggers ATS penalties.`);
    fixes.push("Remove repeated skills lists or artificially duplicated keyword blocks.");
  }

  // Ensure score bounds
  score = Math.min(maxScore, Math.max(0, score));

  return {
    name: "Keyword Match",
    score,
    max: maxScore,
    findings,
    fixes,
    matchedKeywords,
    missingKeywords
  };
}
