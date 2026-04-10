const MAX_CREDITS = 10;
const WINDOW = 24 * 60 * 60 * 1000;
const GROQ_MODELS = ["llama-3.1-8b-instant", "llama3-8b-8192", "llama-3.3-70b-versatile"];
const GEMINI_MODELS = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-flash-001"];

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
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
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
  const realIp = getHeader(headers, "x-nf-client-connection-ip");
  return forwardedFor.split(",")[0]?.trim() || realIp || "unknown";
}

function buildSystemPrompt() {
  return [
    "You are a calculator AI for math and financial questions.",
    "Answer accurately and keep the explanation concise.",
    "Return plain text in exactly this structure:",
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
    lines.length > 1 ? lines.slice(1, -1).join("\n") || lines.slice(1).join("\n") : trimmed;
  const summary =
    lines.length > 2
      ? lines[lines.length - 1]
      : (explanation || trimmed).slice(0, 140) || "No summary provided.";

  return {
    finalAnswer,
    explanation: explanation || "No explanation provided.",
    summary
  };
}

async function parseErrorText(response: Response) {
  try {
    return await response.text();
  } catch {
    return response.statusText || "Unknown provider error";
  }
}

async function callGroq(prompt: string, systemPrompt: string) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const errors: string[] = [];

  for (const model of GROQ_MODELS) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      errors.push(`${model}: ${await parseErrorText(response)}`);
      continue;
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();

    if (text) {
      return { text, model };
    }

    errors.push(`${model}: empty response`);
  }

  throw new Error(`Groq failed: ${errors.join(" | ")}`);
}

async function callGemini(prompt: string, systemPrompt: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const errors: string[] = [];

  for (const model of GEMINI_MODELS) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
      errors.push(`${model}: ${await parseErrorText(response)}`);
      continue;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (text) {
      return { text, model };
    }

    errors.push(`${model}: empty response`);
  }

  throw new Error(`Gemini failed: ${errors.join(" | ")}`);
}

export async function handleAiRequest(input: RequestInput): Promise<ResponseOutput> {
  const headers = input.headers || {};
  const method = (input.method || "GET").toUpperCase();

  if (method === "OPTIONS") {
    return json(200, { ok: true });
  }

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
      ok: true,
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
  let providerModel = "";
  let text = "";
  let groqError = "";

  try {
    const groqResult = await callGroq(prompt, systemPrompt);
    text = groqResult.text;
    providerModel = groqResult.model;
  } catch (error) {
    groqError = error instanceof Error ? error.message : "Unknown Groq error";
    console.error("[AI] Groq failure:", groqError);
    provider = "gemini";

    try {
      const geminiResult = await callGemini(prompt, systemPrompt);
      text = geminiResult.text;
      providerModel = geminiResult.model;
    } catch (geminiError) {
      const geminiMessage =
        geminiError instanceof Error ? geminiError.message : "Unknown Gemini error";
      console.error("[AI] Gemini failure:", geminiMessage);

      return json(500, {
        error: "Both AI providers failed",
        details: `${groqError} | ${geminiMessage}`
      });
    }
  }

  user.creditsUsed += 1;

  return json(200, {
    ok: true,
    provider,
    providerModel,
    ...parseAiText(text),
    creditsUsed: user.creditsUsed,
    maxCredits: MAX_CREDITS,
    resetAt: user.resetAt,
    userIp: ip
  });
}
