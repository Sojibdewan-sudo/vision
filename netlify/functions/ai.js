export async function handler(event) {

  const MAX_CREDITS = 10;
  const WINDOW = 24 * 60 * 60 * 1000;

  const ip =
    (event.headers["x-forwarded-for"] || "")
      .split(",")[0] || "unknown";

  global.usage = global.usage || {};

  let user = global.usage[ip];

  if (!user || Date.now() > user.resetAt) {
    user = {
      creditsUsed: 0,
      resetAt: Date.now() + WINDOW
    };
    global.usage[ip] = user;
  }

  /* ===============================
     GET → CREDIT STATUS
  =============================== */

  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      body: JSON.stringify({
        creditsUsed: user.creditsUsed,
        maxCredits: MAX_CREDITS,
        resetAt: user.resetAt
      })
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  if (user.creditsUsed >= MAX_CREDITS) {
    return {
      statusCode: 429,
      body: JSON.stringify({
        error: "Daily limit reached",
        creditsUsed: user.creditsUsed,
        maxCredits: MAX_CREDITS,
        resetAt: user.resetAt
      })
    };
  }

  let body;

  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" })
    };
  }

  const prompt = body.prompt;

  if (!prompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Prompt missing" })
    };
  }

  const systemPrompt = `
You are a smart calculator AI.

Rules:
1. Always calculate the final numeric result.
2. First line = Final Answer only.
3. Then short explanation.
4. Then short summary.
`;

  /* ===============================
     TRY GEMINI FIRST
  =============================== */

  try {

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.VITE_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${systemPrompt}\n\n${prompt}`
                }
              ]
            }
          ]
        })
      }
    );

    if (geminiRes.ok) {

      const geminiData = await geminiRes.json();

      const text =
        geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No answer";

      const lines = text.split("\n");

      user.creditsUsed += 1;

      return {
        statusCode: 200,
        body: JSON.stringify({
          source: "gemini",
          finalAnswer: lines[0] || text,
          explanation: text,
          summary: lines.slice(1).join(" ").slice(0,120),
          creditsUsed: user.creditsUsed,
          maxCredits: MAX_CREDITS,
          resetAt: user.resetAt
        })
      };

    }

  } catch (error) {

    console.log("Gemini failed → switching to Groq");

  }

  /* ===============================
        GROQ FALLBACK
  =============================== */

  try {

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.VITE_GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.2
        })
      }
    );

    const groqData = await groqRes.json();

    const text =
      groqData?.choices?.[0]?.message?.content ||
      "No answer";

    const lines = text.split("\n");

    user.creditsUsed += 1;

    return {
      statusCode: 200,
      body: JSON.stringify({
        source: "groq",
        finalAnswer: lines[0] || text,
        explanation: text,
        summary: lines.slice(1).join(" ").slice(0,120),
        creditsUsed: user.creditsUsed,
        maxCredits: MAX_CREDITS,
        resetAt: user.resetAt
      })
    };

  } catch (error) {

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Both AI providers failed"
      })
    };

  }

}
