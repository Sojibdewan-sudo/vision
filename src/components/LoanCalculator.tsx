import React, { useEffect, useState } from 'react';
import { Landmark } from 'lucide-react';
import { SEOBlock } from './SEOBlock';
import { CopyResultButton } from './CopyResultButton';
import { getToolContent } from '../lib/toolContent';

export function LoanCalculator() {
  const [principal, setPrincipal] = useState<number | ''>('');
  const [rate, setRate] = useState<number | ''>('');
  const [tenure, setTenure] = useState<number | ''>('');
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  const [result, setResult] = useState<{
    emi: number;
    totalPayment: number;
    totalInterest: number;
    principalPercentage: number;
    interestPercentage: number;
  } | null>(null);

  const content = getToolContent('loan');

  useEffect(() => {
    if (principal && rate && tenure) {
      calculateLoan();
    } else {
      setResult(null);
    }
  }, [principal, rate, tenure, tenureType]);

  const calculateLoan = () => {
    const P = Number(principal);
    const R = Number(rate) / 12 / 100;
    const N = tenureType === 'years' ? Number(tenure) * 12 : Number(tenure);

    if (P <= 0 || R <= 0 || N <= 0) return;

    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    setResult({
      emi,
      totalPayment,
      totalInterest,
      principalPercentage: (P / totalPayment) * 100,
      interestPercentage: (totalInterest / totalPayment) * 100,
    });
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

  return (
    <section id="loan" className="py-16 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            <Landmark size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Loan Calculator</h1>
        </div>

        <p className="mb-8 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Use this loan calculator online to estimate EMI, total repayment, and total interest for home, car, or personal loans. It works well for monthly installment checks and EMI calculator BD style comparisons.
        </p>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field label="Loan Amount">
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value ? Number(e.target.value) : '')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                placeholder="e.g. 500000"
              />
            </Field>

            <Field label="Interest Rate (% p.a.)">
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value ? Number(e.target.value) : '')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                placeholder="e.g. 10"
              />
            </Field>

            <Field label="Tenure">
              <div className="flex">
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value ? Number(e.target.value) : '')}
                  className="w-full rounded-l-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder="e.g. 5"
                />
                <select
                  value={tenureType}
                  onChange={(e) => setTenureType(e.target.value as 'years' | 'months')}
                  className="rounded-r-xl border border-l-0 border-slate-200 bg-slate-100 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-700 dark:text-white"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </Field>
          </div>

          {result && (
            <div className="rounded-[1.75rem] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-6 dark:border-indigo-800/50 dark:from-indigo-900/20 dark:via-slate-800 dark:to-slate-800">
              <div className="mb-6 flex flex-col items-center justify-between gap-4 border-b border-slate-200 pb-6 text-center dark:border-slate-700 md:flex-row md:text-left">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Loan Summary</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Clear monthly EMI and full borrowing cost.</p>
                </div>
                <CopyResultButton
                  value={`EMI: ${formatCurrency(result.emi)} | Interest: ${formatCurrency(result.totalInterest)} | Total: ${formatCurrency(result.totalPayment)}`}
                />
              </div>

              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <MetricCard label="Monthly EMI" value={formatCurrency(result.emi)} highlight />
                <MetricCard label="Total Interest" value={formatCurrency(result.totalInterest)} />
                <MetricCard label="Total Payable" value={formatCurrency(result.totalPayment)} />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Breakdown</h3>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Principal vs interest share
                  </span>
                </div>
                <div className="mb-4 flex h-4 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="bg-indigo-500" style={{ width: `${result.principalPercentage}%` }} />
                  <div className="bg-amber-500" style={{ width: `${result.interestPercentage}%` }} />
                </div>
                <div className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300 sm:flex-row sm:justify-between">
                  <span>Principal: {result.principalPercentage.toFixed(1)}%</span>
                  <span>Interest: {result.interestPercentage.toFixed(1)}%</span>
                </div>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</div>
      <div className={`mt-2 text-3xl font-bold ${highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
        {value}
      </div>
    </div>
  );
}
