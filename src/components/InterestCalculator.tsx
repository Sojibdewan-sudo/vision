import React, { useState, useEffect } from 'react';
import { Percent } from 'lucide-react';
import { SEOBlock } from './SEOBlock';

export function InterestCalculator() {
  const [principal, setPrincipal] = useState<number | ''>('');
  const [rate, setRate] = useState<number | ''>('');
  const [time, setTime] = useState<number | ''>('');
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');
  const [interestType, setInterestType] = useState<'simple' | 'compound'>('simple');
  const [compoundFrequency, setCompoundFrequency] = useState<number>(12); // Default to monthly
  const [result, setResult] = useState<{ totalInterest: number; totalAmount: number } | null>(null);

  useEffect(() => {
    if (principal && rate && time) {
      calculateInterest();
    } else {
      setResult(null);
    }
  }, [principal, rate, time, timeUnit, interestType, compoundFrequency]);

  const calculateInterest = () => {
    const P = Number(principal);
    const R = Number(rate) / 100;
    const T = timeUnit === 'years' ? Number(time) : Number(time) / 12;

    if (P <= 0 || R <= 0 || T <= 0) return;

    let totalAmount = 0;
    let totalInterest = 0;

    if (interestType === 'simple') {
      totalInterest = P * R * T;
      totalAmount = P + totalInterest;
    } else {
      const n = compoundFrequency;
      totalAmount = P * Math.pow(1 + R / n, n * T);
      totalInterest = totalAmount - P;
    }

    setResult({ totalInterest, totalAmount });
  };

  return (
    <section id="interest" className="py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Percent size={28} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Interest Calculator</h1>
        </div>
        
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-3xl">
          Calculate simple and compound interest easily with our free online Interest Calculator. Determine the total interest earned or paid on a principal amount over a specific period. Ideal for estimating investment returns or loan costs.
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 p-6 sm:p-8 transition-all duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="col-span-1 md:col-span-2 flex gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
              <button
                onClick={() => setInterestType('simple')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${interestType === 'simple' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
              >
                Simple Interest
              </button>
              <button
                onClick={() => setInterestType('compound')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${interestType === 'compound' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
              >
                Compound Interest
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Principal Amount</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                placeholder="e.g. 10000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Annual Interest Rate (%)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                placeholder="e.g. 5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Time Period</label>
              <div className="flex">
                <input
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-l-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  placeholder="e.g. 5"
                />
                <select
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value as 'years' | 'months')}
                  className="bg-slate-100 dark:bg-slate-700 border border-l-0 border-slate-200 dark:border-slate-700 rounded-r-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>

            {interestType === 'compound' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Compound Frequency</label>
                <select
                  value={compoundFrequency}
                  onChange={(e) => setCompoundFrequency(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                >
                  <option value={1}>Annually (1/yr)</option>
                  <option value={2}>Semi-Annually (2/yr)</option>
                  <option value={4}>Quarterly (4/yr)</option>
                  <option value={12}>Monthly (12/yr)</option>
                  <option value={365}>Daily (365/yr)</option>
                </select>
              </div>
            )}
          </div>

          {result && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800/50 animate-in zoom-in duration-300">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 text-center">Interest Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:-translate-y-1 transition-transform">
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Interest Earned</div>
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    {result.totalInterest.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:-translate-y-1 transition-transform">
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Amount</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {result.totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <SEOBlock
          title="Interest Calculator"
          description={[
            "Our free online Interest Calculator helps you determine the interest earned or paid on a principal amount over a specific period. It supports both simple and compound interest calculations.",
            "Whether you're calculating returns on an investment, estimating savings growth, or understanding the cost of a loan, this tool provides accurate and instant results."
          ]}
          howToUse={[
            "Select the type of interest: Simple or Compound.",
            "Enter the Principal Amount (initial investment or loan amount).",
            "Input the Annual Interest Rate (%).",
            "Specify the Time Period in years or months.",
            "If using Compound Interest, select the compounding frequency (e.g., annually, monthly, daily).",
            "Review the Total Interest Earned and Total Amount instantly."
          ]}
          formulas={[
            { title: "Simple Interest", formula: "I = P × R × T" },
            { title: "Compound Interest", formula: "A = P(1 + r/n)^(nt)" }
          ]}
          examples={[
            { question: "Simple Interest on $1,000 at 5% for 2 years", calculation: "I = 1000 × 0.05 × 2 = $100" },
            { question: "Compound Interest on $1,000 at 5% compounded annually for 2 years", calculation: "A = 1000(1 + 0.05/1)^(1×2) = $1,102.50" }
          ]}
          benefits={[
            "Versatile: Supports both simple and compound interest.",
            "Flexible: Choose different compounding frequencies (annually, monthly, daily, etc.).",
            "Accurate: Uses standard mathematical formulas for precise calculations.",
            "Instant Results: See the total interest and amount immediately as you type."
          ]}
          faq={[
            {
              question: "What is the difference between simple and compound interest?",
              answer: "Simple interest is calculated only on the principal amount. Compound interest is calculated on the principal amount and also on the accumulated interest of previous periods."
            },
            {
              question: "How does compounding frequency affect the total interest?",
              answer: "The more frequently interest is compounded (e.g., daily vs. annually), the higher the total interest earned or paid will be."
            }
          ]}
          relatedTools={[
            { name: "Loan Calculator", link: "/loan" },
            { name: "Percentage Calculator", link: "/percentage" }
          ]}
        />
      </div>
    </section>
  );
}
