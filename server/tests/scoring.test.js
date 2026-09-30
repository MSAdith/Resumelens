import { describe, it, expect } from "vitest";
import { scoreKeywordMatch } from "../scoring/keywordMatcher.js";
import { scoreParseability } from "../scoring/parseability.js";
import { scoreSectionStructure } from "../scoring/sectionStructure.js";
import { scoreContactInfo } from "../scoring/contactInfo.js";
import { scoreExperienceQuality } from "../scoring/experienceQuality.js";
import { scoreSkillsRelevance } from "../scoring/skillsRelevance.js";
import { scoreLengthReadability } from "../scoring/lengthReadability.js";
import { scoreSpellingGrammar } from "../scoring/spellingGrammar.js";
import { analyzeResume } from "../scoring/index.js";

const SAMPLE_TECH_RESUME = `
Jane Doe
Email: jane.doe@example.com | Phone: (555) 123-4567 | Location: San Francisco, CA
LinkedIn: linkedin.com/in/janedoe | GitHub: github.com/janedoe

Professional Summary
Results-driven Senior Full Stack Engineer with 7+ years of experience engineering high-performance web applications, microservices, and distributed cloud systems. Specialized in TypeScript, React, Node.js, Next.js, PostgreSQL, Docker, and AWS cloud infrastructure. Proven track record of accelerating software delivery, mentoring junior developers, and scaling production systems to support millions of active users.

Experience
Senior Full Stack Engineer | TechCorp Solutions | Jan 2021 – Present
- Spearheaded the architectural overhaul of core customer portal using React, Next.js, and TypeScript, improving web vitals and increasing page load speed by 45%.
- Architected resilient microservices powered by Node.js, Express, and PostgreSQL handling 50k daily active users with 99.99% uptime.
- Optimized database query performance and indexing, reducing server response latency by 200ms across 15 high-traffic API endpoints.
- Mentored a team of 6 software engineers on modern frontend architecture, TDD, code review best practices, and clean code principles.
- Implemented automated CI/CD pipelines with GitHub Actions and Docker, reducing release cycle time from 3 days to under 20 minutes.

Full Stack Software Engineer | CloudScale Systems | Mar 2018 – Dec 2020
- Engineered real-time analytics visualization dashboard with React, Redux, and WebSockets for monitoring enterprise infrastructure metrics.
- Accelerated automated unit and integration test coverage to 88% using Jest, Vitest, and Cypress, eliminating major regression bugs in production.
- Automated multi-region AWS cloud resource provisioning using Terraform, Docker, and Kubernetes (EKS).
- Streamlined cross-functional collaboration with product managers, UX designers, and QA engineers in an Agile/Scrum environment.

Education
Bachelor of Science in Computer Science | University of California, Berkeley | 2014 – 2018
- Graduated with Honors (GPA 3.8/4.0). Coursework: Data Structures, Algorithms, Distributed Systems, Database Design.

Skills
Languages: JavaScript, TypeScript, Python, SQL, HTML5, CSS3, Bash
Frameworks & Libraries: React, Node.js, Express, Next.js, Redux, Tailwind CSS, Jest, Vitest
DevOps & Cloud: AWS, Docker, Kubernetes, GitHub Actions, CI/CD, Terraform, Nginx
Databases & Storage: PostgreSQL, MongoDB, Redis, Elasticsearch

Projects & Certifications
- ResumeLens ATS Scorer: Developed open-source resume analysis platform using React, Node.js, and Express.
- AWS Certified Solutions Architect – Associate (2023)
`;

const SAMPLE_JD = `
We are looking for a Senior Full Stack Software Engineer proficient in React, Node.js, TypeScript, PostgreSQL, Docker, AWS, and CI/CD pipelines.
Responsibilities:
- Build scalable web interfaces using React and Next.js.
- Architect high-performance Node.js REST APIs and microservices.
- Manage PostgreSQL databases and cloud deployments on AWS.
`;

describe("ResumeLens Scoring Engine Unit Tests", () => {
  it("Test 1: Keyword Match scores accurately when matching JD skills", () => {
    const res = scoreKeywordMatch(SAMPLE_TECH_RESUME, SAMPLE_JD);
    expect(res.score).toBeGreaterThanOrEqual(25);
    expect(res.max).toBe(35);
    expect(res.matchedKeywords).toContain("React");
    expect(res.matchedKeywords).toContain("Node.js");
    expect(res.matchedKeywords).toContain("TypeScript");
  });

  it("Test 2: Keyword Match falls back gracefully when no JD is provided", () => {
    const res = scoreKeywordMatch(SAMPLE_TECH_RESUME, "");
    expect(res.score).toBeGreaterThanOrEqual(20);
    expect(res.findings.length).toBeGreaterThan(0);
  });

  it("Test 3: Parseability detects normal text and penalizes near-empty scanned image text", () => {
    const goodRes = scoreParseability(SAMPLE_TECH_RESUME);
    expect(goodRes.score).toBe(20);

    const emptyRes = scoreParseability("Scanned image resume text");
    expect(emptyRes.score).toBeLessThan(10);
    expect(emptyRes.findings[0]).toContain("sparse");
  });

  it("Test 4: Section Structure detects standard resume headings", () => {
    const res = scoreSectionStructure(SAMPLE_TECH_RESUME);
    expect(res.score).toBeGreaterThanOrEqual(8);
    expect(res.max).toBe(10);
  });

  it("Test 5: Contact Info extracts email, phone, and social links", () => {
    const res = scoreContactInfo(SAMPLE_TECH_RESUME);
    expect(res.score).toBe(5);
    expect(res.findings[0]).toContain("Complete contact info");
  });

  it("Test 6: Experience Quality rewards strong action verbs and metrics while penalizing weak phrases", () => {
    const goodRes = scoreExperienceQuality(SAMPLE_TECH_RESUME);
    expect(goodRes.score).toBeGreaterThanOrEqual(12);

    const weakText = "- Responsible for working on web pages and helping to fix bugs.";
    const weakRes = scoreExperienceQuality(weakText);
    expect(weakRes.score).toBeLessThan(8);
  });

  it("Test 7: Skills Relevance evaluates dedicated section and categorization", () => {
    const res = scoreSkillsRelevance(SAMPLE_TECH_RESUME);
    expect(res.score).toBe(5);
    expect(res.findings).toContain("Skills are neatly categorized into functional sub-groups (e.g., Languages, Frameworks, Databases).");
  });

  it("Test 8: Length & Readability verifies word count and bullet lengths", () => {
    const res = scoreLengthReadability(SAMPLE_TECH_RESUME);
    expect(res.score).toBe(5);
    expect(res.findings[0]).toContain("Optimal word count");
  });

  it("Test 9: Spelling & Grammar ignores technical skills dictionary words", () => {
    const res = scoreSpellingGrammar(SAMPLE_TECH_RESUME);
    expect(res.score).toBeGreaterThanOrEqual(4);
  });

  it("Test 10: Master analyzeResume orchestrator calculates total sum out of 100", async () => {
    const result = await analyzeResume(SAMPLE_TECH_RESUME, SAMPLE_JD);
    expect(result.total).toBeGreaterThanOrEqual(80);
    expect(result.categories.length).toBe(8);
    expect(result.verdict).toBeDefined();
    expect(result.matchedKeywords.length).toBeGreaterThan(0);
  });
});
