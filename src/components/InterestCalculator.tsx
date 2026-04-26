import React, { useEffect, useState } from 'react';
import { Percent } from 'lucide-react';
import { SEOBlock } from './SEOBlock';
import { CopyResultButton } from './CopyResultButton';
import { getToolContent } from '../lib/toolContent';

export function InterestCalculator() {
  const [principal, setPrincipal] = useState<number | ''>('');
  const [rate, setRate] = useState<number | ''>('');
  const [time, setTime] = useState<number | ''>('');
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');
  const [interestType, setInterestType] = useState<'simple' | 'compound'>('simple');
  const [compoundFrequency, setCompoundFrequency] = useState<number>(12);
  const [result, setResult] = useState<{ totalInterest: number; totalAmount: number } | null>(null);

  const content = getToolContent('interest');

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

    if (interestType === 'simple') {
      const totalInterest = P * R * T;
      setResult({ totalInterest, totalAmount: P + totalInterest });
      return;
    }

    const n = compoundFrequency;
    const totalAmount = P * Math.pow(1 + R / n, n * T);
    setResult({ totalInterest: totalAmount - P, totalAmount });
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

  return (
    <section id="interest" className="py-16 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            <Percent size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Interest Calculator</h1>
        </div>

        <p className="mb-8 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Use this interest calculator online to compare simple and compound interest, estimate savings growth, and check maturity amount before investing or borrowing.
        </p>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <div className="mb-8 flex flex-wrap gap-3 border-b border-slate-200 pb-5 dark:border-slate-700">
            <button
              onClick={() => setInterestType('simple')}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                interestType === 'simple'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              Simple Interest
            </button>
            <button
              onClick={() => setInterestType('compound')}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                interestType === 'compound'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              Compound Interest
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Principal Amount">
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value ? Number(e.target.value) : '')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                placeholder="e.g. 10000"
              />
            </Field>

            <Field label="Annual Interest Rate (%)">
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value ? Number(e.target.value) : '')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                placeholder="e.g. 8"
              />
            </Field>

            <Field label="Time Period">
              <div className="flex">
                <input
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value ? Number(e.target.value) : '')}
                  className="w-full rounded-l-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder="e.g. 5"
                />
                <select
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value as 'years' | 'months')}
                  className="rounded-r-xl border border-l-0 border-slate-200 bg-slate-100 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-700 dark:text-white"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </Field>

            {interestType === 'compound' && (
              <Field label="Compound Frequency">
                <select
                  value={compoundFrequency}
                  onChange={(e) => setCompoundFrequency(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value={1}>Annually</option>
                  <option value={2}>Semi-annually</option>
                  <option value={4}>Quarterly</option>
                  <option value={12}>Monthly</option>
                  <option value={365}>Daily</option>
                </select>
              </Field>
            )}
          </div>

          {result && (
            <div className="mt-8 rounded-[1.75rem] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-6 dark:border-indigo-800/50 dark:from-indigo-900/20 dark:via-slate-800 dark:to-slate-800">
              <div className="mb-6 flex flex-col items-center justify-between gap-4 border-b border-slate-200 pb-6 text-center dark:border-slate-700 md:flex-row md:text-left">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Interest Summary</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Interest earned and maturity amount in one view.</p>
                </div>
                <CopyResultButton
                  value={`Interest: ${formatCurrency(result.totalInterest)} | Total Amount: ${formatCurrency(result.totalAmount)}`}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <MetricCard label="Total Interest" value={formatCurrency(result.totalInterest)} highlight />
                <MetricCard label="Total Amount" value={formatCurrency(result.totalAmount)} />
              </div>
            </div>
          )}
        </div>

        {content && <SEOBlock content={content} />}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      {children}
    </label>
  );
}

function MetricCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</div>
      <div className={`mt-2 text-3xl font-bold ${highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
        {value}
      </div>
    </div>
  );
}
