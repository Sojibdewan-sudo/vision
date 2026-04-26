import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { SEOBlock } from './SEOBlock';
import { CopyResultButton } from './CopyResultButton';
import { getToolContent } from '../lib/toolContent';

export function AgeCalculator() {
  const [dob, setDob] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    nextBirthdayDays: number;
  } | null>(null);

  const content = getToolContent('age');

  useEffect(() => {
    if (dob && currentDate) {
      calculateAge();
    }
  }, [dob, currentDate]);

  const calculateAge = () => {
    const birthDate = new Date(dob);
    const targetDate = new Date(currentDate);

    if (birthDate > targetDate) {
      setResult(null);
      return;
    }

    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((targetDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
    const nextBirthday = new Date(birthDate);
    nextBirthday.setFullYear(targetDate.getFullYear());
    if (nextBirthday < targetDate) {
      nextBirthday.setFullYear(targetDate.getFullYear() + 1);
    }
    const nextBirthdayDays = Math.ceil((nextBirthday.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));

    setResult({ years, months, days, totalDays, nextBirthdayDays });
  };

  return (
    <section id="age" className="py-16 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            <Calendar size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Age Calculator</h1>
        </div>

        <p className="mb-8 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Use this age calculator online to find exact age from date of birth, total days lived, and days left until the next birthday for forms, eligibility checks, and quick profile updates.
        </p>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Date of Birth">
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </Field>
            <Field label="Current Date">
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </Field>
          </div>

          {result && (
            <div className="rounded-[1.75rem] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-6 dark:border-indigo-800/50 dark:from-indigo-900/20 dark:via-slate-800 dark:to-slate-800">
              <div className="mb-6 flex flex-col items-center justify-between gap-4 border-b border-slate-200 pb-6 text-center dark:border-slate-700 md:flex-row md:text-left">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Exact Age</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Years, months, days, and birthday countdown.</p>
                </div>
                <CopyResultButton
                  value={`${result.years} years, ${result.months} months, ${result.days} days | Total days lived: ${result.totalDays} | Next birthday in: ${result.nextBirthdayDays} days`}
                />
              </div>

              <div className="mb-6 grid grid-cols-3 gap-4">
                <StatCard label="Years" value={result.years} highlight />
                <StatCard label="Months" value={result.months} highlight />
                <StatCard label="Days" value={result.days} highlight />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <StatCard label="Total Days Lived" value={result.totalDays.toLocaleString()} />
                <StatCard label="Next Birthday In" value={`${result.nextBirthdayDays} days`} />
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

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
      <div className={`text-3xl font-bold ${highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
        {value}
      </div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}
