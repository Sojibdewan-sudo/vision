import { Handler } from "@netlify/functions";
import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";

interface UsageRecord {
  ip: string;
  creditsUsed: number;
  windowStart: number;
}

const usageStore = new Map<string, UsageRecord>();

const MAX_DAILY_CREDITS = 10;
const WINDOW = 24 * 60 * 60 * 1000;

export const handler: Handler = async (event) => {

  const ip =
    (event.headers["x-forwarded-for"] || "")
      .toString()
      .split(",")[0] || "unknown";

  const now = Date.now();

  let record = usageStore.get(ip);

  if (!record) {
    record = { ip, creditsUsed: 0, windowStart: now };
  }

  if (now > record.windowStart + WINDOW) {
    record = { ip, creditsUsed: 0, windowStart: now };
  }

  usageStore.set(ip, record);

  const resetAt = record.windowStart + WINDOW;


  /* ===============================
      GET → CREDIT STATUS
  =============================== */

  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      body: JSON.stringify({
        creditsUsed: record.creditsUsed,
        maxCredits: MAX_DAILY_CREDITS,
        resetAt
      })
    };
  }


  /* ===============================
        POST → AI CALCULATION
  =============================== */

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {

    if (record.creditsUsed >= MAX_DAILY_CREDITS) {

      return {
        statusCode: 429,
        body: JSON.stringify({
          error: "Daily limit reached",
          creditsUsed: record.creditsUsed,
          maxCredits: MAX_DAILY_CREDITS,
          resetAt
        })
      };

    }

    const { prompt } = JSON.parse(event.body || "{}");

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Prompt required" })
      };
    }

    const systemPrompt = `
You are a calculator AI.

Return JSON only:

{
"finalAnswer": "...",
"explanation": "...",
"summary": "..."
}
`;


    /* ===============================
            TRY GROQ FIRST
    =============================== */

    let provider = "groq";
    let result: any = null;

    try {

      if (!process.env.GROQ_API_KEY)
        throw new Error("Missing GROQ_API_KEY");

      const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY
      });

      const completion = await groq.chat.completions.create({

        model: "llama3-8b-8192",

        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],

        temperature: 0.2
      });

      const text = completion.choices[0]?.message?.content || "";

      try {
        result = JSON.parse(text);
      } catch {
        result = {
          finalAnswer: text.split("\n")[0],
          explanation: text,
          summary: text.slice(0, 120)
        };
      }

    } catch (groqErr) {

      console.log("Groq failed → Gemini fallback");

      provider = "gemini";

      if (!process.env.GEMINI_API_KEY)
        throw new Error("Missing GEMINI_API_KEY");

      const gemini = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
      });

      const response = await gemini.models.generateContent({

        model: "gemini-1.5-flash",

        contents: prompt,

        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json"
        }

      });

      const text = response.text || "{}";

      result = JSON.parse(text);

    }


    record.creditsUsed += 1;
    usageStore.set(ip, record);


    return {

      statusCode: 200,

      body: JSON.stringify({

        finalAnswer: result.finalAnswer || "No result",
        explanation: result.explanation || "",
        summary: result.summary || "",
        provider,

        creditsUsed: record.creditsUsed,
        maxCredits: MAX_DAILY_CREDITS,
        resetAt

      })

    };

  } catch (error: any) {

    console.error("AI Function Error:", error);

    return {

      statusCode: 500,

      body: JSON.stringify({
        error: "AI server error",
        details: error.message
      })

    };

  }

};
