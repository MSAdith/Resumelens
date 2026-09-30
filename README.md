# ResumeLens – ATS Resume Scorer & Optimization Engine

ResumeLens is a high-performance, deterministic ATS (Applicant Tracking System) resume scoring web application. It parses PDF and DOCX resumes entirely in-memory, evaluates them against 8 objective recruitment criteria, performs keyword gap analysis against target job descriptions, and provides actionable bullet improvements.

---

## 🎨 Design System: Paper & Ink Aesthetic

ResumeLens follows a disciplined, high-contrast **"paper & ink"** editorial aesthetic:
- **Page Background (`--paper`)**: `#F4EFE6`
- **Card Surface (`--surface`)**: `#FBF8F2`
- **Primary Ink (`--ink`)**: `#1B1A17`
- **Muted Ink (`--ink-muted`)**: `#6B655A`
- **Border Dividers (`--line`)**: `#DDD5C4`
- **Forest Accent (`--forest`)**: `#1F3D2B`
- **Ember Accent (`--ember`)**: `#D9541E`
- **Typography**: Headings in *Fraunces*, Body text in *Instrument Sans*, Numbers & Chips in *JetBrains Mono*.

---

## ⚡ Quick Start & Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm

### 1. Installation
Run the root setup command to install dependencies across the monorepo:
```bash
npm run setup
```
*(Or install manually in root, `/server`, and `/client`)*

### 2. Run Development Server
Start both the Express backend (`http://localhost:5000`) and the React + Vite frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser to view the application.

---

## 🧪 Running Unit Tests

Run the Vitest test suite for the 8-category scoring engine:
```bash
npm test
```

---

## 🧠 Scoring Engine Breakdown (Total: 100 Points)

ResumeLens evaluates uploaded resumes using an explainable 8-category rule-based engine:

### 1. Keyword Match with Job Description (Weight: 35 points)
- **Methodology**: Tokenizes and normalizes the target Job Description (JD). Matches terms against a built-in skills dictionary of **500+ tech and business competencies** (including canonical name mappings and synonyms, e.g. `JS` $\rightarrow$ `JavaScript`, `K8s` $\rightarrow$ `Kubernetes`).
- **Scoring**: Weighted keyword frequency match ratio. If no JD is provided, evaluates against general industry skill benchmarks.

### 2. Parseability & Formatting (Weight: 20 points)
- **Methodology**: Verifies character extraction. Penalizes scanned image PDFs (<150 extracted characters). Scans for multi-column / tabular spacing artifacts, unreadable wingding icons, and missing body contact text.

### 3. Section Structure (Weight: 10 points)
- **Methodology**: Detects 6 standard ATS section headers: *Summary/Objective, Education, Experience, Projects, Skills, Certifications*.

### 4. Contact Information (Weight: 5 points)
- **Methodology**: Validates presence of Email address, Phone number, and LinkedIn / GitHub / Portfolio URLs using pattern matching.

### 5. Experience Quality & Bullet Impact (Weight: 15 points)
- **Methodology**: Analyzes bullet points for strong action verbs (*Spearheaded, Architected, Optimized, Scaled*) and quantified impact metrics (*percentages, monetary values, user scale*). Penalizes weak passive phrases (*"responsible for", "worked on"*).

### 6. Skills Relevance & Categorization (Weight: 5 points)
- **Methodology**: Checks for an explicit Skills section and assesses whether skills are organized into subcategories (*Languages, Frameworks, Databases, Tools*).

### 7. Length & Readability (Weight: 5 points)
- **Methodology**: Evaluates total word count (ideal: 350–800 words), bullet length (ideal: 10–28 words per bullet), and date formatting consistency.

### 8. Spelling & Grammar (Weight: 5 points)
- **Methodology**: Performs vocabulary scan ignoring proper nouns, numbers, and technical terms in the skills dictionary.

### Optional AI Layer (Claude API)
If `ANTHROPIC_API_KEY` is provided in `.env`, Claude API rewrites the 3 weakest bullet points into high-impact metric-driven statements and generates a 3-line executive summary. *The AI layer operates strictly as an advisory feature and never alters the numeric score.*

---

## 🔒 Privacy & Security

Files uploaded to ResumeLens are parsed in-memory using `multer.memoryStorage()`, `pdf-parse`, and `mammoth`. Resumes are **never written to disk, cached, or stored** in any database.

---

## 📁 Repository Structure

```
resumelens/
├── package.json               # Root monorepo orchestration
├── .env.example               # Environment variables template
├── README.md                  # System documentation
├── sample-resumes/            # Sample PDF & DOCX test files
├── server/
│   ├── index.js               # Express API server & multer endpoint
│   ├── scoring/               # 8 scoring category modules & skills dictionary
│   └── tests/                 # Vitest test suite (scoring.test.js)
└── client/
    ├── vite.config.js         # Vite configuration with API proxy
    ├── index.html             # HTML shell & font imports
    └── src/
        ├── index.css          # Paper & Ink design tokens & print stylesheet
        ├── App.jsx            # Master app controller
        └── components/        # UI components (ScoreGauge, CategoryCard, etc.)
```
