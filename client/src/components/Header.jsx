import React from "react";

export default function Header({ onReset }) {
  return (
    <header className="site-header">
      <div className="app-container header-inner">
        <a href="#home" className="logo-link" onClick={(e) => { e.preventDefault(); if (onReset) onReset(); }}>
          <span className="logo-badge">ATS</span>
          <span className="logo-title">ResumeLens</span>
        </a>
        <span className="tagline">Deterministic Resume Optimization & ATS Intelligence</span>
      </div>
    </header>
  );
}
