import React, { useState, useRef } from "react";

export default function UploadView({ onAnalyze, loading, error }) {
  const [file, setFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndSetFile = (selectedFile) => {
    setValidationError("");
    if (!selectedFile) return;

    const validExtensions = [".pdf", ".docx"];
    const validMimes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    const fileName = selectedFile.name.toLowerCase();
    const isValidExt = validExtensions.some(ext => fileName.endsWith(ext));
    const isValidMime = validMimes.includes(selectedFile.type);

    if (!isValidExt && !isValidMime) {
      setValidationError("Invalid file format. Please upload a .pdf or .docx resume file.");
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setValidationError("File size exceeds 5 MB limit. Please select a smaller resume.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setValidationError("Please select or drop a PDF/DOCX resume file before submitting.");
      return;
    }
    onAnalyze(file, jdText);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="grid-12 landing-grid">
      {/* Left Column */}
      <div className="landing-left">
        <h1 className="hero-headline">
          Know how ATS software rates your resume.
        </h1>
        <p className="hero-subtext">
          Instant, explainable resume scoring engine. Align your keywords, bullet impact, and formatting to land more interviews.
        </p>

        <div className="trust-points">
          <div className="trust-item">
            <svg className="trust-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="trust-text">
              <strong>100% Deterministic & Rule-Based</strong>: 8 objective ATS criteria derived from real recruiter software.
            </span>
          </div>
          <div className="trust-item">
            <svg className="trust-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="trust-text">
              <strong>Zero Storage Privacy Guarantee</strong>: Files are processed purely in-memory and deleted immediately.
            </span>
          </div>
          <div className="trust-item">
            <svg className="trust-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="trust-text">
              <strong>Actionable Keyword Gap Analysis</strong>: Specific missing terms and bullet rewrites.
            </span>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="landing-right">
        <form className="card-surface" onSubmit={handleSubmit}>
          {/* Drag & Drop Zone */}
          <div
            className={`dropzone ${isDragOver ? "is-dragover" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            tabIndex={0}
            role="button"
            aria-label="Upload Resume File"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current && fileInputRef.current.click();
              }
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              style={{ display: "none" }}
            />
            <svg className="dropzone-icon" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="dropzone-title">
              {file ? "Change Resume File" : "Drop your resume here, or click to browse"}
            </div>
            <div className="dropzone-sub">Supports PDF and DOCX (Max 5 MB)</div>

            {file && (
              <div className="file-pill" onClick={(e) => e.stopPropagation()}>
                <span className="file-name">{file.name}</span>
                <span className="file-size">({formatSize(file.size)})</span>
                <button
                  type="button"
                  className="remove-file-btn"
                  onClick={() => setFile(null)}
                  aria-label="Remove selected file"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Privacy Note */}
          <div className="privacy-note">
            <svg className="privacy-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Privacy Guarantee: Files are processed in memory and never stored or written to disk.
          </div>

          {/* Job Description Field */}
          <div className="jd-group">
            <label htmlFor="jdInput" className="label-title">
              Target Job Description (Optional, Recommended)
            </label>
            <textarea
              id="jdInput"
              className="jd-textarea"
              placeholder="Paste the target job description here to perform a precise keyword match and gap analysis..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
          </div>

          {/* Validation & Server Error Messages */}
          {(validationError || error) && (
            <div className="error-alert">
              ⚠️ {validationError || error}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <svg className="spin" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Parsing & Scoring Resume...
              </>
            ) : (
              "Analyse Resume"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
