import app from "../server/index.js";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.url === "/api/health" || req.url === "/" || req.url.includes("health")) {
    return res.status(200).json({ ok: true, status: "ok", service: "ResumeLens Backend" });
  }
  return app(req, res);
}
