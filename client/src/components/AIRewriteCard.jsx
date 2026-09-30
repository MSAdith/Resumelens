import React from "react";

export default function AIRewriteCard({ aiRewrites }) {
  if (!aiRewrites) return null;

  const { summary = [], rewrites = [] } = aiRewrites;

  return (
    <div className="card-surface ai-section">
      <div className="ai-header">
        <span className="ai-badge">AI Intelligence</span>
        <h2 className="section-heading" style={{ margin: 0 }}>
          Claude AI Improvement Suggestions
        </h2>
      </div>

      {summary.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <h3 className="label-title">High-Level Executive Summary</h3>
          <ul className="findings-list">
            {summary.map((line, idx) => (
              <li key={idx} className="finding-item">
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}

      {rewrites.length > 0 && (
        <div>
          <h3 className="label-title">Suggested Bullet Point Rewrites</h3>
          {rewrites.map((item, idx) => (
            <div key={idx} className="rewrite-card">
              <div className="original-bullet">
                <strong>Original:</strong> {item.original}
              </div>
              <div className="rewritten-bullet">
                <strong>✨ Enhanced ATS Bullet:</strong> {item.rewritten}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
