import React, { useState, useEffect } from "react";
import { Bot, Loader2, Send, Sparkles, Zap, Clock } from "lucide-react";

export function AICalculator() {

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [response, setResponse] = useState<{
    finalAnswer: string;
    explanation: string;
    summary: string;
    provider?: string;
  } | null>(null);

  const [creditsUsed, setCreditsUsed] = useState(0);
  const maxCredits = 10;

  const [resetAt, setResetAt] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState("");

  // fetch credit status
  useEffect(() => {
    const fetchCredits = async () => {
      try {

        const res = await fetch("/.netlify/functions/ai");

        if (!res.ok) return;

        const data = await res.json();

        setCreditsUsed(data.creditsUsed || 0);
        setResetAt(data.resetAt || null);

      } catch (err) {
        console.log("credit fetch failed");
      }
    };

    fetchCredits();
  }, []);

  // timer
  useEffect(() => {

    if (!resetAt) return;

    const update = () => {

      const diff = resetAt - Date.now();

      if (diff <= 0) {
        setTimeRemaining("");
        setCreditsUsed(0);
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeRemaining(`${h}h ${m}m`);
    };

    update();

    const interval = setInterval(update, 60000);

    return () => clearInterval(interval);

  }, [resetAt]);



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!query.trim()) return;

    if (creditsUsed >= maxCredits) {

      setError(`Daily limit reached. Try again in ${timeRemaining || "a few hours"}.`);
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    try {

      const res = await fetch("/.netlify/functions/ai", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          prompt: query
        })

      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI request failed");
      }

      setResponse({
        finalAnswer: data.answer || "No result",
        explanation: data.explanation || data.answer,
        summary: data.summary || data.answer,
        provider: data.source
      });

      setCreditsUsed(data.creditsUsed || creditsUsed + 1);
      setResetAt(data.resetAt || null);

    } catch (err: any) {

      console.error(err);
      setError("Network failure or API error. Please try again.");

    }

    setLoading(false);
  };



  return (

    <section className="py-16">

      <div className="max-w-4xl mx-auto px-4">

        <div className="flex items-center gap-3 mb-8">

          <Bot size={28} />

          <h1 className="text-3xl font-bold">
            AI Text Calculator
          </h1>

        </div>


        <div className="bg-slate-800 rounded-2xl p-6">


          <div className="flex justify-between mb-4 flex-wrap gap-2">

            <span>Ask any math or financial question</span>

            <span className="flex items-center gap-2">

              <Zap size={16} />

              {maxCredits - creditsUsed} / {maxCredits}

            </span>

          </div>


          {creditsUsed >= maxCredits && timeRemaining && (

            <div className="text-yellow-400 text-sm mb-4 flex items-center gap-2">

              <Clock size={14} />

              Reset in {timeRemaining}

            </div>

          )}


          <form onSubmit={handleSubmit}>

            <textarea

              value={query}

              onChange={(e) => setQuery(e.target.value)}

              placeholder="Example: 2000 - 400"

              rows={3}

              className="w-full p-4 rounded-lg bg-slate-900 mb-4"

              disabled={loading}

            />

            <button

              type="submit"

              disabled={loading || !query.trim()}

              className="px-6 py-3 bg-indigo-600 rounded-lg flex items-center gap-2"

            >

              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}

              Calculate

            </button>

          </form>



          {error && (

            <div className="mt-6 text-red-400">
              {error}
            </div>

          )}



          {response && (

            <div className="mt-8 space-y-4">

              <div className="p-4 bg-indigo-900 rounded-lg">

                <div className="font-semibold mb-1">
                  Result
                </div>

                <div className="text-xl">

                  {response.finalAnswer}

                </div>

              </div>


              <div className="p-4 bg-slate-900 rounded-lg">

                {response.explanation}

              </div>


              <div className="text-sm opacity-70">

                AI Provider: {response.provider}

              </div>

            </div>

          )}


        </div>

      </div>

    </section>

  );

}
