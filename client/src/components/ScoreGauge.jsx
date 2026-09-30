import React, { useEffect, useState } from "react";

export default function ScoreGauge({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.min(100, Math.max(0, score));
    const duration = 1000;
    const stepTime = 15;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Determine gauge stroke color
  let strokeColor = "var(--bad)";
  if (score >= 75) strokeColor = "var(--good)";
  else if (score >= 50) strokeColor = "var(--mid)";

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="score-gauge-wrapper">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {/* Background Track */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="var(--line)"
          strokeWidth="12"
        />
        {/* Progress Circle */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease-in-out, stroke 0.4s ease" }}
          transform="rotate(-90 80 80)"
        />
        {/* Centered Score Text */}
        <text
          x="80"
          y="76"
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--ink)"
          fontFamily="var(--font-mono)"
          fontSize="44"
          fontWeight="600"
        >
          {animatedScore}
        </text>
        <text
          x="80"
          y="108"
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--ink-muted)"
          fontFamily="var(--font-mono)"
          fontSize="12"
          fontWeight="600"
          letterSpacing="1"
        >
          / 100
        </text>
      </svg>
    </div>
  );
}
