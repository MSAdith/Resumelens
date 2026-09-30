import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

import { scoreKeywordMatch, extractKeywords } from "../scoring/keywordMatcher.js";
import { scoreParseability } from "../scoring/parseability.js";
import { scoreSectionStructure } from "../scoring/sectionStructure.js";
import { scoreContactInfo } from "../scoring/contactInfo.js";
import { scoreExperienceQuality } from "../scoring/experienceQuality.js";
import { scoreSkillsRelevance } from "../scoring/skillsRelevance.js";
import { scoreLengthReadability } from "../scoring/lengthReadability.js";
import { scoreSpellingGrammar } from "../scoring/spellingGrammar.js";
import { analyzeResume } from "../scoring/index.js";

function readFixture(filename) {
  const fixturePath = path.resolve(__dirname, "fixtures", filename);
  return fs.readFileSync(fixturePath, "utf-8");
}

describe("ResumeLens Comprehensive Module & Audit Test Suite", () => {

  // 1. SECTION STRUCTURE AUDIT
  describe("Section Structure Module", () => {
    it("should detect standard section headings with various casings", () => {
      const text = `
        PROFESSIONAL SUMMARY
        WORK EXPERIENCE
        TECHNICAL SKILLS
        ACADEMIC PROJECTS
        EDUCATION
        CERTIFICATIONS
      `;
      const result = scoreSectionStructure(text);
      expect(result.score).toBe(10);
      expect(result.findings.some(f => f.includes("6 out of 6"))).toBe(true);
    });

    it("should penalize missing sections", () => {
      const text = "Just some unformatted random text without headings.";
      const result = scoreSectionStructure(text);
      expect(result.score).toBeLessThan(5);
      expect(result.fixes.length).toBeGreaterThan(0);
    });

    it("should ignore heading keywords inside long bullet text", () => {
      const text = `
        WORK EXPERIENCE
        - Responsible for software development projects involving cloud services.
        - Worked on educational projects and summary reports.
      `;
      const result = scoreSectionStructure(text);
      expect(result.score).toBeLessThanOrEqual(5);
    });
  });

  // 2. CONTACT INFORMATION AUDIT
  describe("Contact Information Module", () => {
    it("should detect Indian phone numbers (+91, 10-digit mobile)", () => {
      const text = "Contact: adithya@example.com | +91 98765 43210 | linkedin.com/in/adithya";
      const result = scoreContactInfo(text);
      expect(result.score).toBe(5);
      expect(result.findings.some(f => f.includes("Complete contact info"))).toBe(true);
    });

    it("should detect International phone formats and GitHub/Portfolio links", () => {
      const text = "Jane Doe\njane@test.org | +1 (555) 019-2834 | github.com/janedoe | https://janedoe.dev";
      const result = scoreContactInfo(text);
      expect(result.score).toBe(5);
    });

    it("should penalize missing phone number or email", () => {
      const text = "John Smith - No contact info provided.";
      const result = scoreContactInfo(text);
      expect(result.score).toBe(0);
      expect(result.fixes.some(f => f.includes("email"))).toBe(true);
    });
  });

  // 3. KEYWORD MATCHING & ANTI-GAMING AUDIT
  describe("Keyword Matching Module", () => {
    it("should match skills with strict word boundaries (Java vs JavaScript)", () => {
      const resume = "Experienced in JavaScript, React, Node.js, and TypeScript.";
      const jd = "Looking for a developer with Java experience.";
      const result = scoreKeywordMatch(resume, jd);
      
      expect(result.matchedKeywords).not.toContain("Java");
      expect(result.missingKeywords).toContain("Java");
    });

    it("should handle skill synonyms (JS -> JavaScript, ML -> Machine Learning)", () => {
      const resume = "Built web apps using JS, TS, and ML algorithms.";
      const jd = "Requirements: JavaScript, TypeScript, Machine Learning.";
      const result = scoreKeywordMatch(resume, jd);
      expect(result.matchedKeywords).toContain("JavaScript");
      expect(result.matchedKeywords).toContain("TypeScript");
      expect(result.matchedKeywords).toContain("Machine Learning");
    });

    it("should penalize keyword stuffing (>6 occurrences of same skill)", () => {
      const stuffedResume = readFixture("keyword_stuffed.txt");
      const jd = readFixture("frontend_jd.txt");
      const result = scoreKeywordMatch(stuffedResume, jd);
      
      expect(result.findings.some(f => f.includes("Keyword stuffing detected"))).toBe(true);
      expect(result.score).toBeLessThan(25);
    });

    it("should provide general benchmark evaluation when no JD is given", () => {
      const resume = "Skills: React, Node.js, TypeScript, PostgreSQL, AWS, Docker, Python, SQL, Git, REST API, GraphQL, CI/CD";
      const result = scoreKeywordMatch(resume, "");
      expect(result.score).toBeGreaterThanOrEqual(30);
      expect(result.findings.some(f => f.includes("No job description provided"))).toBe(true);
    });
  });

  // 4. EXPERIENCE QUALITY AUDIT
  describe("Experience Quality Module", () => {
    it("should detect strong action verbs and metrics (%, $, ₹, numbers)", () => {
      const resume = `
        - Spearheaded the frontend overhaul using React, improving speed by 45%.
        - Architected Node.js backend microservices handling 50,000 daily active users.
        - Optimized database queries saving $15,000 in monthly infrastructure costs.
      `;
      const result = scoreExperienceQuality(resume);
      expect(result.score).toBeGreaterThanOrEqual(13);
    });

    it("should penalize weak passive phrases ('responsible for', 'worked on')", () => {
      const resume = `
        - Responsible for writing frontend code and fixing bugs.
        - Worked on HTML and CSS pages.
        - Assisted with database management.
      `;
      const result = scoreExperienceQuality(resume);
      expect(result.score).toBeLessThan(8);
      expect(result.findings.some(f => f.includes("passive phrases"))).toBe(true);
    });
  });

  // 5. PARSEABILITY & FORMAT AUDIT
  describe("Parseability & Format Module", () => {
    it("should flag scanned image PDFs with <150 chars text", () => {
      const text = readFixture("image_only.txt");
      const result = scoreParseability(text);
      expect(result.score).toBeLessThan(10);
      expect(result.findings.some(f => f.includes("CRITICAL: Resume text is extremely sparse"))).toBe(true);
    });

    it("should flag multi-column tab and spacing artifacts", () => {
      const text = readFixture("two_column.txt");
      const result = scoreParseability(text);
      expect(result.score).toBeLessThan(18);
      expect(result.findings.some(f => f.includes("multi-column"))).toBe(true);
    });
  });

  // 6. LENGTH, READABILITY & SPELLING AUDIT
  describe("Length, Readability & Spelling Modules", () => {
    it("should pass standard word count and bullet lengths", () => {
      const text = readFixture("strong_fresher.txt");
      const result = scoreLengthReadability(text);
      expect(result.score).toBeGreaterThanOrEqual(4);
    });

    it("should not flag technical terms or framework names as spelling errors", () => {
      const text = "Used JavaScript, TypeScript, React, PostgreSQL, Kubernetes, Docker, Node.js, GraphQL, AWS.";
      const result = scoreSpellingGrammar(text);
      expect(result.score).toBe(5);
      expect(result.findings.some(f => f.includes("Clean spelling"))).toBe(true);
    });
  });

  // 7. AI LAYER AUDIT
  describe("AI Layer Resilience", () => {
    it("should fallback gracefully when ANTHROPIC_API_KEY is missing", async () => {
      const text = readFixture("strong_fresher.txt");
      const result = await analyzeResume(text, "");
      expect(result.aiRewrites).toBeNull(); // Silent fallback
      expect(result.total).toBeGreaterThan(0); // Scoring still works fully
    });
  });

  // 8. DETERMINISM TEST
  describe("Determinism Verification (10 Runs)", () => {
    it("should return the exact same score and category breakdown across 10 identical runs", async () => {
      const resume = readFixture("strong_fresher.txt");
      const jd = readFixture("frontend_jd.txt");

      const firstRun = await analyzeResume(resume, jd);

      for (let i = 0; i < 9; i++) {
        const run = await analyzeResume(resume, jd);
        expect(run.total).toBe(firstRun.total);
        expect(run.categories.map(c => c.score)).toEqual(firstRun.categories.map(c => c.score));
      }
    });
  });

  // 9. FIXTURE SCORE CALIBRATION TEST SUITE
  describe("Fixture Score Calibration Suite", () => {
    it("strong_fresher + frontend_jd should land in 80–95 range", async () => {
      const resume = readFixture("strong_fresher.txt");
      const jd = readFixture("frontend_jd.txt");
      const result = await analyzeResume(resume, jd);
      expect(result.total).toBeGreaterThanOrEqual(80);
      expect(result.total).toBeLessThanOrEqual(95);
    });

    it("weak_fresher + frontend_jd should land in 30–65 range", async () => {
      const resume = readFixture("weak_fresher.txt");
      const jd = readFixture("frontend_jd.txt");
      const result = await analyzeResume(resume, jd);
      expect(result.total).toBeGreaterThanOrEqual(30);
      expect(result.total).toBeLessThanOrEqual(65);
    });

    it("keyword_stuffed + frontend_jd should be penalized (<75 total)", async () => {
      const resume = readFixture("keyword_stuffed.txt");
      const jd = readFixture("frontend_jd.txt");
      const result = await analyzeResume(resume, jd);
      expect(result.total).toBeLessThan(75);
    });

    it("image_only resume should land < 30 total score", async () => {
      const resume = readFixture("image_only.txt");
      const result = await analyzeResume(resume, "");
      expect(result.total).toBeLessThan(30);
    });

    it("no_sections resume should land < 50 total score", async () => {
      const resume = readFixture("no_sections.txt");
      const result = await analyzeResume(resume, "");
      expect(result.total).toBeLessThan(50);
    });

    it("non_tech + frontend_jd should land < 50 total score", async () => {
      const resume = readFixture("non_tech.txt");
      const jd = readFixture("frontend_jd.txt");
      const result = await analyzeResume(resume, jd);
      expect(result.total).toBeLessThan(50);
    });
  });
});
