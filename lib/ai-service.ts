const MAX_CREDITS = 10;
const WINDOW = 24 * 60 * 60 * 1000;

type UsageEntry = {
  creditsUsed: number;
  resetAt: number;
};

type RequestInput = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: string | null;
};

type ResponseOutput = {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
};

const usage: Record<string, UsageEntry> = {};

function json(statusCode: number, payload: unknown): ResponseOutput {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  };
}

function getHeader(
  headers: Record<string, string | string[] | undefined>,
  name: string
): string {
  const match = Object.entries(headers).find(
    ([key]) => key.toLowerCase() === name.toLowerCase()
  )?.[1];

  if (Array.isArray(match)) {
    return match[0] || "";
  }

  return match || "";
}

function getClientIp(headers: Record<string, string | string[] | undefined>): string {
  const forwardedFor = getHeader(headers, "x-forwarded-for");
  return forwardedFor.split(",")[0]?.trim() || "unknown";
}

function buildSystemPrompt() {
  return [
    "You are a calculator AI for math and financial questions.",
    'Return plain text in exactly this structure:',
    "Line 1: final answer only",
    "Line 2+: short explanation",
    "Final line: simple summary"
  ].join("\n");
}

function parseAiText(text: string) {
  const trimmed = text.trim();
  const lines = trimmed
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const finalAnswer = lines[0] || trimmed || "No answer";
  const explanation =
    lines.length > 1 ? lines.slice(1).join("\n") : trimmed || "No explanation provided.";
  const summary =
    lines.length > 2
      ? lines[lines.length - 1]
      : explanation.slice(0, 140) || "No summary provided.";

  return { finalAnswer, explanation, summary };
}

async function callGroq(prompt: string, systemPrompt: string) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Groq failed: ${details || response.statusText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error("Groq returned an empty response");
  }

  return text;
}

async function callGemini(prompt: string, systemPrompt: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${systemPrompt}\n\n${prompt}` }]
          }
        ]
      })
    }
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Gemini failed: ${details || response.statusText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return text;
}

export async function handleAiRequest(input: RequestInput): Promise<ResponseOutput> {
  const headers = input.headers || {};
  const method = (input.method || "GET").toUpperCase();
  const ip = getClientIp(headers);
  const now = Date.now();

  if (!usage[ip] || now > usage[ip].resetAt) {
    usage[ip] = {
      creditsUsed: 0,
      resetAt: now + WINDOW
    };
  }

  const user = usage[ip];

  if (method === "GET") {
    return json(200, {
      creditsUsed: user.creditsUsed,
      maxCredits: MAX_CREDITS,
      resetAt: user.resetAt
    });
  }

  if (method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  if (user.creditsUsed >= MAX_CREDITS) {
    return json(429, {
      error: "Daily limit reached",
      creditsUsed: user.creditsUsed,
      maxCredits: MAX_CREDITS,
      resetAt: user.resetAt
    });
  }

  let payload: { prompt?: string };

  try {
    payload = JSON.parse(input.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const prompt = payload.prompt?.trim();

  if (!prompt) {
    return json(400, { error: "Prompt required" });
  }

  const systemPrompt = buildSystemPrompt();
  let provider = "groq";
  let text = "";
  let groqError = "";

  try {
    text = await callGroq(prompt, systemPrompt);
  } catch (error) {
    groqError = error instanceof Error ? error.message : "Unknown Groq error";
    provider = "gemini";

    try {
      text = await callGemini(prompt, systemPrompt);
    } catch (geminiError) {
      const geminiMessage =
        geminiError instanceof Error ? geminiError.message : "Unknown Gemini error";

      return json(500, {
        error: "Both AI providers failed",
        details: `${groqError} | ${geminiMessage}`
      });
    }
  }

  user.creditsUsed += 1;

  return json(200, {
    provider,
    ...parseAiText(text),
    creditsUsed: user.creditsUsed,
    maxCredits: MAX_CREDITS,
    resetAt: user.resetAt,
    userIp: ip
  });
}
