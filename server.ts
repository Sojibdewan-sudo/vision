import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/ai", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      console.log(`[AI Request] IP: ${userIp} | Prompt: ${prompt.substring(0, 50)}...`);

      const systemInstruction = "You are a math assistant. Return the final numeric answer first, then a short explanation.";

      let result: any = null;
      let usedProvider = 'groq';

      try {
        const groqApiKey = process.env.GROQ_API_KEY;
        if (!groqApiKey) {
           throw new Error("GROQ_API_KEY is not configured.");
        }

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [
              {
                role: "system",
                content: `${systemInstruction}\nRespond in JSON format with exactly these keys: "finalAnswer", "explanation", "summary".`
              },
              {
                role: "user",
                content: prompt
              }
            ],
            response_format: { type: "json_object" }
          })
        });

        if (!groqResponse.ok) {
          const errText = await groqResponse.text();
          throw new Error(`Groq API failed: ${errText}`);
        }

        const groqData = await groqResponse.json();
        const content = groqData.choices[0]?.message?.content;
        if (!content) throw new Error("No response from Groq");

        result = JSON.parse(content);
      } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
      }

      if (!result) {
        throw new Error("AI provider failed to return a valid result.");
      }

      res.json({ ...result, provider: usedProvider });
    } catch (error) {
      console.error("AI API Error:", error);
      res.status(500).json({ error: "AI service temporarily unavailable. Please try again later." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
