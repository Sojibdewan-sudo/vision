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

  /* =============================== */

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
You are a calculator AI.

Return answer like:
First line = final answer only
Then explanation
Then summary
`;

  let provider = "groq";
  let text = "";

  /* ===============================
     GROQ FIRST
  =============================== */

  try {

    if (!process.env.GROQ_API_KEY) {
      throw new Error("Missing GROQ_API_KEY");
    }

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
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
      }
    );

    if (!groqRes.ok) {
      throw new Error("Groq failed");
    }

    const groqData = await groqRes.json();

    text = groqData?.choices?.[0]?.message?.content || "";

  } catch (err) {

    console.log("Groq failed → Gemini fallback");

    provider = "gemini";

    try {

      if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing GEMINI_API_KEY");
      }

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemPrompt}\n\n${prompt}` }
                ]
              }
            ]
          })
        }
      );

      if (!geminiRes.ok) {
        throw new Error("Gemini failed");
      }

      const data = await geminiRes.json();

      text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No answer";

    } catch (error) {

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Both AI providers failed"
        })
      };

    }

  }

  user.creditsUsed += 1;

  const lines = text.split("\n");

  return {
    statusCode: 200,
    body: JSON.stringify({
      provider, // ✅ FIXED
      finalAnswer: lines[0] || text,
      explanation: text,
      summary: lines.slice(1).join(" ").slice(0, 120),
      creditsUsed: user.creditsUsed,
      maxCredits: MAX_CREDITS,
      resetAt: user.resetAt
    })
  };

}
