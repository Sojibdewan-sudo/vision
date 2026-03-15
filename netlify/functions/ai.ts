import { Handler } from '@netlify/functions';
import Groq from 'groq-sdk';
import { GoogleGenAI } from '@google/genai';

interface UsageRecord {
  ip: string;
  creditsUsed: number;
  windowStart: number;
}

const usageStore = new Map<string, UsageRecord>();
const MAX_DAILY_CREDITS = 10;
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export const handler: Handler = async (event) => {
  const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
  const now = Date.now();
  
  let record = usageStore.get(ip);
  if (record && now > record.windowStart + TWENTY_FOUR_HOURS) {
    record = { ip, creditsUsed: 0, windowStart: now };
    usageStore.set(ip, record);
  } else if (!record) {
    record = { ip, creditsUsed: 0, windowStart: now };
    usageStore.set(ip, record);
  }

  const resetAt = record.windowStart + TWENTY_FOUR_HOURS;

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        creditsUsed: record.creditsUsed,
        maxCredits: MAX_DAILY_CREDITS,
        resetAt
      })
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    if (record.creditsUsed >= MAX_DAILY_CREDITS) {
      return {
        statusCode: 429,
        body: JSON.stringify({
          error: 'Rate limit reached',
          creditsUsed: record.creditsUsed,
          maxCredits: MAX_DAILY_CREDITS,
          resetAt
        })
      };
    }

    const { prompt, systemInstruction } = JSON.parse(event.body || '{}');

    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Prompt is required' }) };
    }

    const systemPrompt = systemInstruction || `You are a math assistant. Return the numeric answer first, then a short explanation. Respond in JSON format with exactly these keys: "finalAnswer", "explanation", "summary".`;

    let provider = 'groq';
    let parsedResponse = null;
    let groqErrorMsg = '';

    try {
      if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY is missing");
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        model: 'llama3-8b-8192',
        response_format: { type: 'json_object' }
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) throw new Error('Empty response from Groq');

      parsedResponse = JSON.parse(responseContent);
    } catch (groqError: any) {
      console.error('Groq failed, falling back to Gemini:', groqError);
      groqErrorMsg = groqError.message || 'Unknown Groq error';
      provider = 'gemini';

      try {
        if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing");
        const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const response = await gemini.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json'
          }
        });

        parsedResponse = JSON.parse(response.text || '{}');
      } catch (geminiError: any) {
        console.error('Gemini failed:', geminiError);
        return {
          statusCode: 500,
          body: JSON.stringify({ 
            error: 'AI API failure', 
            details: `Groq failed: ${groqErrorMsg}. Gemini failed: ${geminiError.message || 'Unknown error'}` 
          })
        };
      }
    }

    record.creditsUsed += 1;
    usageStore.set(ip, record);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        ...parsedResponse, 
        provider,
        creditsUsed: record.creditsUsed,
        maxCredits: MAX_DAILY_CREDITS,
        resetAt
      })
    };
  } catch (error: any) {
    console.error('AI Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message })
    };
  }
};
