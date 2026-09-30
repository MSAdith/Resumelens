import Anthropic from "@anthropic-ai/sdk";

export async function generateAIRewrites(resumeText, weakBullets = []) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return null; // Skip silently if key is missing
  }

  const targetBullets = weakBullets.length > 0 
    ? weakBullets.slice(0, 3) 
    : resumeText.split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 25 && !l.toLowerCase().includes("education"))
        .slice(0, 3);

  if (targetBullets.length === 0) return null;

  const prompt = `You are an expert resume consultant and ATS specialist. 
Analyze the following bullet points from a resume and provide high-impact, action-verb driven, quantified rewrites. Also provide a concise 3-line overall summary of key improvements.

Bullets to rewrite:
${targetBullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

Respond strictly in valid JSON format with the following keys:
{
  "summary": ["Line 1 of summary", "Line 2 of summary", "Line 3 of summary"],
  "rewrites": [
    { "original": "original bullet 1", "rewritten": "improved bullet 1" }
  ]
}`;

  const callAnthropicWithTimeout = async (attempt = 1) => {
    try {
      const anthropic = new Anthropic({ apiKey });
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await anthropic.messages.create(
        {
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        },
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      const content = response.content[0]?.text;
      if (!content) return null;

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed.summary) && Array.isArray(parsed.rewrites)) {
          return parsed;
        }
      }
    } catch (err) {
      if (attempt === 1) {
        // Retry once on failure
        return callAnthropicWithTimeout(2);
      }
      console.warn("AI Rewriter fallback triggered:", err.message);
      return null;
    }
    return null;
  };

  return callAnthropicWithTimeout();
}
