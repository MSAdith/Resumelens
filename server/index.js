import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.js";
import PDFParser from "pdf2json";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import { analyzeResume } from "./scoring/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simple in-memory sliding window IP rate limiter (20 req / min per IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 20;

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
  const now = Date.now();
  const userRecord = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

  if (now > userRecord.resetTime) {
    userRecord.count = 1;
    userRecord.resetTime = now + RATE_LIMIT_WINDOW;
  } else {
    userRecord.count++;
  }

  rateLimitMap.set(ip, userRecord);

  if (userRecord.count > MAX_REQUESTS) {
    return res.status(429).json({
      error: "Too many requests. Rate limit exceeded (20 requests per minute). Please try again shortly."
    });
  }

  next();
};

// Memory storage for file uploads (max 5MB limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

// Multi-engine PDF parser
async function parsePdf(buffer) {
  // 1. Primary: Mozilla pdfjs-dist
  try {
    const uint8Data = new Uint8Array(buffer);
    const loadingTask = getDocument({ data: uint8Data, useSystemFonts: true });
    const pdfDocument = await loadingTask.promise;

    let fullText = "";
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(" ");
      fullText += pageText + "\n";
    }

    if (fullText && fullText.trim().length > 20) {
      return fullText;
    }
  } catch (pdfjsErr) {
    console.warn("pdfjs-dist engine note:", pdfjsErr.message);
  }

  // 2. Secondary: pdf-parse (direct library import avoiding index.js readFileSync crash)
  try {
    const parseFn = typeof pdfParse === "function" ? pdfParse : pdfParse.default;
    const pdfData = await parseFn(buffer);
    if (pdfData && pdfData.text && pdfData.text.trim().length > 20) {
      return pdfData.text;
    }
  } catch (pdfParseErr) {
    console.warn("pdf-parse engine note:", pdfParseErr.message);
  }

  // 3. Tertiary: pdf2json fallback
  try {
    const text = await new Promise((resolve, reject) => {
      const parser = new PDFParser(null, 1);
      parser.on("pdfParser_dataError", err => reject(new Error(err.parserError)));
      parser.on("pdfParser_dataReady", () => {
        const raw = parser.getRawTextContent();
        try {
          resolve(decodeURIComponent(raw));
        } catch (e) {
          resolve(raw);
        }
      });
      parser.parseBuffer(buffer);
    });

    if (text && text.trim().length > 20) {
      return text;
    }
  } catch (pdf2jsonErr) {
    console.warn("pdf2json engine note:", pdf2jsonErr.message);
  }

  return "";
}

// GET /api/health
app.get(["/api/health", "/health"], (req, res) => {
  res.json({ ok: true, status: "ok", service: "ResumeLens Backend" });
});

// POST /api/analyze
app.post(["/api/analyze", "/analyze"], rateLimiter, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a resume file (PDF or DOCX)." });
    }

    const { buffer, originalname, mimetype } = req.file;
    const jdText = req.body.jd || "";

    let extractedText = "";
    const filenameLower = originalname.toLowerCase();

    if (mimetype === "application/pdf" || filenameLower.endsWith(".pdf")) {
      try {
        extractedText = await parsePdf(buffer);
      } catch (pdfErr) {
        console.error("PDF parse error:", pdfErr);
        return res.status(422).json({
          error: "Failed to parse PDF document. Ensure the file is not password-protected or corrupted."
        });
      }
    } else if (
      mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      filenameLower.endsWith(".docx")
    ) {
      try {
        const docxResult = await mammoth.extractRawText({ buffer });
        extractedText = docxResult.value || "";
      } catch (docxErr) {
        console.error("DOCX parse error:", docxErr);
        return res.status(422).json({
          error: "Failed to parse DOCX document. Ensure the file is a valid Word document."
        });
      }
    } else {
      return res.status(400).json({
        error: "Unsupported file format. Please upload a .pdf or .docx file (max 5 MB)."
      });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(422).json({
        error: "Could not extract readable text from document. If this is a scanned PDF, please re-save as a text-selectable PDF."
      });
    }

    // Run scoring engine
    const analysis = await analyzeResume(extractedText, jdText);

    return res.json({
      filename: originalname,
      filesize: req.file.size,
      ...analysis
    });

  } catch (err) {
    console.error("Error during analysis route:", err);
    return res.status(500).json({
      error: err.message || "An unexpected error occurred during resume analysis. Please try again."
    });
  }
});

// Global multer & application error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size exceeds the 5 MB limit. Please upload a smaller resume." });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err) {
    return res.status(err.status || 500).json({ error: err.message || "An unexpected server error occurred." });
  }
  next();
});

export default app;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`ResumeLens backend running on http://localhost:${PORT}`);
  });
}
