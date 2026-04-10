import React, { useState, useEffect } from 'react';
import { Bot, Loader2, Send, Sparkles, Zap, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SEOBlock } from './SEOBlock';

const AI_ENDPOINTS = ['/api/ai', '/.netlify/functions/ai'];

function buildEndpointUrl(path: string) {
  if (typeof window === 'undefined') {
    return path;
  }

  return new URL(path, window.location.origin).toString();
}

async function fetchAiJson(path: string, init?: RequestInit) {
  const target = buildEndpointUrl(path);
  const res = await fetch(target, {
    cache: 'no-store',
    credentials: 'same-origin',
    ...init,
  });
  const raw = await res.text();

  let data: any = null;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    if (!res.ok) {
      throw new Error(`${target} failed with status ${res.status}`);
    }
    throw new Error(`${target} returned invalid JSON.`);
  }

  return { res, data, target };
}

async function requestAi(init?: RequestInit) {
  const failures: string[] = [];

  for (const path of AI_ENDPOINTS) {
    try {
      return await fetchAiJson(path, init);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown API error';
      failures.push(message);
    }
  }

  throw new Error(failures.join(' | ') || 'Network failure or API error. Please try again.');
}

export function AICalculator() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    finalAnswer: string;
    explanation: string;
    summary: string;
    provider?: string;
  } | null>(null);
  const [error, setError] = useState('');
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [maxCredits, setMaxCredits] = useState(10);
  const [resetAt, setResetAt] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    // Fetch initial credit status from backend
    const fetchCredits = async () => {
      try {
        const { res, data } = await requestAi();
        if (res.ok) {
          setCreditsUsed(data.creditsUsed);
          setMaxCredits(data.maxCredits);
          setResetAt(data.resetAt);
        }
      } catch (err) {
        console.error('Failed to fetch credit status', err);
      }
    };
    fetchCredits();
  }, []);

  useEffect(() => {

    if (!resetAt) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = resetAt - now;

      if (diff <= 0) {
        setTimeRemaining('');
        setCreditsUsed(0);
        setResetAt(null);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);

  }, [resetAt]);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!query.trim()) return;

    if (creditsUsed >= maxCredits) {
      setError(`Daily limit reached. Try again in ${timeRemaining || 'a few hours'}.`);
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const { res, data } = await requestAi({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: query }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          setCreditsUsed(data.creditsUsed || maxCredits);
          setResetAt(data.resetAt);
          throw new Error(`Daily limit reached. Try again in ${timeRemaining || 'a few hours'}.`);
        }
        
        if (data.details) {
          throw new Error(`${data.error}: ${data.details}`);
        }
        throw new Error(data.error || 'Network failure or API error. Please try again.');
      }

      setResponse(data);
      setCreditsUsed(data.creditsUsed);
      setResetAt(data.resetAt);

      // Logging should never block the user from seeing a valid AI result.
      if (supabase) {
        try {
          await supabase.from('ai_logs').insert([
            {
              query: query,
              response: data,
              user_ip: data.userIp || 'unknown',
              created_at: new Date().toISOString(),
            },
          ]);
        } catch (logError) {
          console.error('Supabase AI log insert failed:', logError);
        }
      }
    } catch (err: any) {
      console.error('AI Error:', err);
      setError(err.message || 'Failed to process your request. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <section id="ai-calculator" className="py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Bot size={24} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Text Calculator</h1>
        </div>
        
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-3xl">
          Solve complex math and financial problems using plain English with our free AI Text Calculator. Just type your question naturally, and our advanced AI will provide the exact answer along with a step-by-step explanation.
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 p-6 sm:p-8 transition-all duration-200">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <label htmlFor="ai-query" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Ask any math or financial question in plain English
            </label>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100 dark:border-indigo-800/50">
                <Zap size={14} className={creditsUsed >= maxCredits ? "text-slate-400" : "text-amber-500"} />
                <span>Credits left today: {Math.max(0, maxCredits - creditsUsed)} / {maxCredits}</span>
              </div>
              {creditsUsed >= maxCredits && timeRemaining && (
                <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium px-2">
                  <Clock size={12} />
                  <span>Resets in {timeRemaining}</span>
                </div>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="relative">
              <textarea
                id="ai-query"
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., If I save 2000 taka per month for 3 years with 10% interest?"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none pr-16 disabled:opacity-60"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute bottom-4 right-4 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
          </form>


          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800/30 mb-6">
              {error}
            </div>
          )}


          {/* Result */}
          {response && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Final Answer */}
              <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 relative">
                <div className="absolute top-4 right-4 text-xs font-medium px-2 py-1 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm">
                  Powered by {response.provider === 'groq' ? 'Groq (Llama 3)' : 'Gemini'}
                </div>
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-2 text-sm uppercase tracking-wider">
                  <Sparkles size={16} />
                  Result
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white pr-24">
                  {response.finalAnswer}
                </div>
              </div>

              {/* Explanation */}
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Short Explanation</h3>
                <div className="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                  {response.explanation}
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold text-sm">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></div>
                  Simple Summary
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 italic pl-4">
                  "{response.summary}"
                </p>
              </div>
            </div>

          )}

        </div>

        <SEOBlock
          title="AI Text Calculator"
          description={[
            "Our AI Text Calculator is a revolutionary tool that allows you to solve complex mathematical and financial problems using natural language. Instead of figuring out which formula to use or how to punch numbers into a traditional calculator, you simply type your question in plain English.",
            "Powered by advanced AI models, it understands context, performs the necessary calculations, and provides not just the final answer, but a detailed, step-by-step explanation of how it arrived at that result."
          ]}
          howToUse={[
            "Type your math or financial problem into the text box just as you would ask a human.",
            "For example, \"If I save $500 a month for 5 years at 6% interest, how much will I have?\"",
            "Click the send button or press enter.",
            "Review the final answer, the step-by-step breakdown, and the concise summary provided by the AI."
          ]}
          formulas={[
            { title: "No Formulas Needed", formula: "Just type your question in plain English!" }
          ]}
          examples={[
            { question: "If I save 2000 taka per month for 3 years with 10% interest?", calculation: "The AI will calculate the future value of an annuity and provide the exact amount." },
            { question: "What is 15% of 850?", calculation: "The AI will instantly calculate 127.5." }
          ]}
          benefits={[
            "Natural Language Processing: No need to learn complex calculator syntax. Just ask.",
            "Educational: The step-by-step explanations help you understand the math behind the answer.",
            "Versatile: Can handle a wide variety of problems, from simple arithmetic to complex compound interest scenarios.",
            "Time-Saving: Get instant answers to word problems without having to translate them into equations first."
          ]}
          faq={[
            {
              question: "What kind of questions can I ask?",
              answer: "You can ask anything from basic math (\"What is 15% of 850?\") to complex financial scenarios (\"How long will it take to double my money at 7% interest?\")."
            },
            {
              question: "Is the AI always accurate?",
              answer: "While the AI is highly advanced and accurate for standard mathematical and financial calculations, it's always good practice to double-check critical financial decisions."
            },
            {
              question: "Can it solve algebra or calculus?",
              answer: "Yes, the AI is capable of solving algebraic equations and basic calculus problems, providing the steps along the way."
            }
          ]}
          relatedTools={[
            { name: "Scientific Calculator", link: "/scientific" },
            { name: "Loan Calculator", link: "/loan" },
            { name: "Interest Calculator", link: "/interest" }
          ]}
        />
      </div>

    </section>
  );
}
