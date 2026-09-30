import React from "react";

export default function KeywordChips({ matchedKeywords = [], missingKeywords = [] }) {
  return (
    <div className="card-surface keywords-section">
      <h2 className="section-heading">Keyword Breakdown</h2>

      <div style={{ marginBottom: "24px" }}>
        <h3 className="label-title" style={{ color: "var(--good)" }}>
          ✓ Matched Keywords ({matchedKeywords.length})
        </h3>
        {matchedKeywords.length === 0 ? (
          <p className="dropzone-sub">No explicit keywords matched.</p>
        ) : (
          <div className="chip-container">
            {matchedKeywords.map((kw, i) => (
              <span key={i} className="chip chip-matched">
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="label-title" style={{ color: "var(--ember)" }}>
          ⚠ Missing Keywords ({missingKeywords.length})
        </h3>
        {missingKeywords.length === 0 ? (
          <p className="dropzone-sub" style={{ color: "var(--good)" }}>
            Great job! No major missing keywords identified.
          </p>
        ) : (
          <div className="chip-container">
            {missingKeywords.map((kw, i) => (
              <span key={i} className="chip chip-missing">
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
