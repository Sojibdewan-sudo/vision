import React, { useState } from 'react';
import { Percent } from 'lucide-react';
import { SEOBlock } from './SEOBlock';
import { CopyResultButton } from './CopyResultButton';
import { getToolContent } from '../lib/toolContent';

export function PercentageCalculator() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [result1, setResult1] = useState<string | null>(null);

  const [value3, setValue3] = useState('');
  const [value4, setValue4] = useState('');
  const [result2, setResult2] = useState<string | null>(null);

  const [value5, setValue5] = useState('');
  const [value6, setValue6] = useState('');
  const [result3, setResult3] = useState<string | null>(null);

  const content = getToolContent('percentage');

  const formatResult = (value: number) => {
    if (!Number.isFinite(value)) return 'Error';
    return Number(value.toFixed(10)).toString();
  };

  const calculate1 = () => {
    try {
      if (!value1 || !value2) return;
      const res = (Number(value1) / 100) * Number(value2);
      setResult1(formatResult(res));
    } catch {
      setResult1('Error');
    }
  };

  const calculate2 = () => {
    try {
      if (!value3 || !value4) return;
      const denominator = Number(value4);
      if (denominator === 0) {
        setResult2('Error');
        return;
      }
      const res = (Number(value3) / denominator) * 100;
      setResult2(formatResult(res));
    } catch {
      setResult2('Error');
    }
  };

  const calculate3 = () => {
    try {
      if (!value5 || !value6) return;
      const original = Number(value5);
      if (original === 0) {
        setResult3('Error');
        return;
      }
      const res = ((Number(value6) - original) / Math.abs(original)) * 100;
      setResult3(formatResult(res));
    } catch {
      setResult3('Error');
    }
  };

  return (
    <section id="percentage" className="py-16 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            <Percent size={24} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Percentage Calculator</h1>
        </div>

        <p className="mb-8 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Use this percentage calculator online to calculate percentage increase, percentage decrease, and what percent one number is of another. It is useful for discounts, score checks, margin review, and everyday finance math.
        </p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">What is X% of Y?</h2>
            <div className="space-y-4">
              <div className="grid gap-3">
                <input
                  type="number"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                  placeholder="Enter percentage"
                />
                <input
                  type="number"
                  value={value2}
                  onChange={(e) => setValue2(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                  placeholder="Enter base number"
                />
              </div>
              <button
                onClick={calculate1}
                className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Calculate
              </button>
              {result1 !== null && (
                <ResultCard value={result1} copyValue={result1} />
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">X is what % of Y?</h2>
            <div className="space-y-4">
              <div className="grid gap-3">
                <input
                  type="number"
                  value={value3}
                  onChange={(e) => setValue3(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                  placeholder="Enter part"
                />
                <input
                  type="number"
                  value={value4}
                  onChange={(e) => setValue4(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                  placeholder="Enter total"
                />
              </div>
              <button
                onClick={calculate2}
                className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Calculate
              </button>
              {result2 !== null && (
                <ResultCard value={`${result2}%`} copyValue={`${result2}%`} />
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Percentage Change</h2>
            <div className="space-y-4">
              <div className="grid gap-3">
                <input
                  type="number"
                  value={value5}
                  onChange={(e) => setValue5(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                  placeholder="Original value"
                />
                <input
                  type="number"
                  value={value6}
                  onChange={(e) => setValue6(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                  placeholder="New value"
                />
              </div>
              <button
                onClick={calculate3}
                className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Calculate
              </button>
              {result3 !== null && (
                <ResultCard
                  value={`${Number(result3) > 0 ? '+' : ''}${result3}%`}
                  copyValue={`${Number(result3) > 0 ? '+' : ''}${result3}%`}
                />
              )}
            </div>
          </div>
        </div>

        {content && <SEOBlock content={content} />}
      </div>
    </section>
  );
}

function ResultCard({ value, copyValue }: { value: string; copyValue: string }) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-center dark:border-indigo-800/40 dark:bg-indigo-900/30">
      <div className="text-sm text-slate-600 dark:text-slate-400">Result</div>
      <div className="mt-1 text-2xl font-bold text-indigo-700 dark:text-indigo-400">{value}</div>
      <div className="mt-3 flex justify-center">
        <CopyResultButton value={copyValue} />
      </div>
    </div>
  );
}
