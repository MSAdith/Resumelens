import React from "react";
import ScoreGauge from "./ScoreGauge.jsx";
import CategoryCard from "./CategoryCard.jsx";
import KeywordChips from "./KeywordChips.jsx";
import AIRewriteCard from "./AIRewriteCard.jsx";

export default function ResultsView({ results, onReset }) {
  const {
    filename,
    filesize,
    total,
    verdict,
    categories = [],
    matchedKeywords = [],
    missingKeywords = [],
    aiRewrites
  } = results;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ paddingBottom: "64px" }}>
      {/* Header bar with metadata & actions */}
      <div className="results-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span className="verdict-tag">Analysis Report</span>
            <h1 className="hero-headline" style={{ fontSize: "36px", marginBottom: "4px" }}>
              {filename}
            </h1>
            <p className="verdict-sub">
              Processed in memory • {(filesize / 1024).toFixed(1)} KB
            </p>
          </div>

          <div className="results-actions">
            <button type="button" className="btn-secondary" onClick={handlePrint}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Download Report
            </button>
            <button type="button" className="btn-primary" style={{ width: "auto", marginTop: 0 }} onClick={onReset}>
              Analyse Another Resume
            </button>
          </div>
        </div>
      </div>

      {/* Main Score Overview Card */}
      <div className="card-surface score-overview-card">
        <ScoreGauge score={total} />

        <div className="verdict-info">
          <div className="verdict-tag">ATS Compatibility Index</div>
          <h2 className="verdict-title">{verdict}</h2>
          <p className="verdict-sub">
            This score reflects 8 weighted criteria across keyword alignment, section formatting, experience bullet impact, and parseability.
          </p>
        </div>
      </div>

      {/* 8-Category Grid */}
      <h2 className="section-heading">Detailed Category Breakdown</h2>
      <div className="category-grid">
        {categories.map((cat, i) => (
          <CategoryCard key={i} category={cat} />
        ))}
      </div>

      {/* Keyword Breakdown Chips */}
      <KeywordChips
        matchedKeywords={matchedKeywords}
        missingKeywords={missingKeywords}
      />

      {/* Optional AI Suggestions */}
      {aiRewrites && <AIRewriteCard aiRewrites={aiRewrites} />}
    </div>
  );
}
