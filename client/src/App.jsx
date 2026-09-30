import React, { useState } from "react";
import Header from "./components/Header.jsx";
import UploadView from "./components/UploadView.jsx";
import ResultsView from "./components/ResultsView.jsx";

export default function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (file, jdText) => {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jd", jdText);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData
      });

      const responseText = await response.text();
      let data = null;

      try {
        data = JSON.parse(responseText);
      } catch (jsonErr) {
        console.error("Non-JSON Response received from server:", responseText);
        throw new Error("The server had a problem analysing your resume. Please try again.");
      }

      if (!response.ok || !data) {
        throw new Error(data?.error || "The server had a problem analysing your resume. Please try again.");
      }

      setResults(data);
    } catch (err) {
      console.error("Analysis Error:", err);
      setError(err.message || "The server had a problem analysing your resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError("");
  };

  return (
    <div>
      <Header onReset={handleReset} />
      <main className="app-container">
        {!results ? (
          <UploadView
            onAnalyze={handleAnalyze}
            loading={loading}
            error={error}
          />
        ) : (
          <ResultsView
            results={results}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
