export function scoreParseability(resumeText, rawMetadata = {}) {
  const findings = [];
  const fixes = [];
  const maxScore = 20;
  let score = maxScore;

  const textLength = resumeText ? resumeText.trim().length : 0;

  // 1. Scanned Image / Empty Text Check
  if (textLength < 150) {
    score -= 15;
    findings.push("CRITICAL: Resume text is extremely sparse (<150 characters). This suggests a scanned image PDF or non-selectable text.");
    fixes.push("Re-save or export your resume directly from Word or Google Docs as a searchable text PDF instead of scanning a physical document.");
  } else if (textLength < 350) {
    score -= 5;
    findings.push("Low character count detected. Ensure all experience details were extracted accurately by the parser.");
  } else {
    findings.push("Clean text extraction. ATS parsers can easily read the document content.");
  }

  // 2. Multi-column / Table layout Heuristic
  // Multi-column or complex tables often produce large inline spacing, multiple tabs, or short line fragments
  const tabCount = (resumeText.match(/\t/g) || []).length;
  const multiSpaceLines = (resumeText.match(/ {4,}/g) || []).length;
  const shortFragmentLines = resumeText.split("\n").filter(l => l.trim().length > 0 && l.trim().length < 15).length;
  const totalLines = resumeText.split("\n").length;

  if (tabCount > 8 || multiSpaceLines > 10 || (totalLines > 20 && shortFragmentLines / totalLines > 0.4)) {
    score -= 4;
    findings.push("Signs of multi-column layout or embedded tables detected. Tables often confuse ATS parsing order.");
    fixes.push("Use a standard single-column layout without tables or text boxes to guarantee proper top-to-bottom ATS reading order.");
  } else {
    findings.push("Layout appears to be single-column and ATS-friendly.");
  }

  // 3. Special Bullets / Odd Unreadable Symbols Check
  // Check for private-use unicode, wingdings, odd bullet artifacts
  const oddSymbols = resumeText.match(/[\uF000-\uFFFF\u25A0-\u25FF\u2B00-\u2BFF]/g) || [];
  if (oddSymbols.length > 5) {
    score -= 3;
    findings.push(`Found ${oddSymbols.length} non-standard symbols or decorative bullet icons that may cause parsing artifacts.`);
    fixes.push("Replace custom shape bullets or wingdings with standard round bullets (•) or hyphens (-).");
  }

  // 4. Contact info present in body text
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  if (!hasEmail || !hasPhone) {
    score -= 3;
    findings.push("Contact details (email or phone) appear to be missing from the body text or placed in headers/footers.");
    fixes.push("Ensure contact info is in the main body text, not embedded inside header/footer fields which some ATS software ignores.");
  }

  score = Math.min(maxScore, Math.max(0, score));

  return {
    name: "Parseability & Format",
    score,
    max: maxScore,
    findings,
    fixes
  };
}
