import React from "react";

export default function CategoryCard({ category }) {
  const { name, score, max, findings = [], fixes = [] } = category;
  const percentage = max > 0 ? (score / max) * 100 : 0;

  let fillClass = "fill-good";
  if (percentage < 50) fillClass = "fill-bad";
  else if (percentage < 75) fillClass = "fill-mid";

  return (
    <div className="card-surface category-card">
      <div>
        <div className="category-header">
          <h3 className="category-title">{name}</h3>
          <span className="category-score-num">
            {score} / {max}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="progress-track">
          <div
            className={`progress-fill ${fillClass}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Findings List */}
        {findings.length > 0 && (
          <ul className="findings-list">
            {findings.map((f, idx) => (
              <li key={idx} className="finding-item">
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Fix Suggestions */}
      {fixes.length > 0 && (
        <div className="fixes-box">
          <div className="fixes-title">Actionable Recommendation</div>
          {fixes.map((fix, idx) => (
            <p key={idx} className="fix-text">
              {fix}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
