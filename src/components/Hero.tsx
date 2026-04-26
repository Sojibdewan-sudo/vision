import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, FileText, Landmark, Percent, Settings2, Type, Zap } from 'lucide-react';

export function Hero() {
  const tools = [
    { name: 'Scientific Calculator', desc: 'Advanced mathematical functions', icon: Zap, link: '/scientific' },
    { name: 'Percentage Calculator', desc: 'Calculate percentages easily', icon: Percent, link: '/percentage' },
    { name: 'Unit Converter', desc: 'Convert length, weight, temperature, and more', icon: Settings2, link: '/converter' },
    { name: 'Age Calculator', desc: 'Calculate exact age in years, months, and days', icon: Calendar, link: '/age' },
    { name: 'Loan Calculator', desc: 'Calculate EMI and interest breakdown', icon: Landmark, link: '/loan' },
    { name: 'Interest Calculator', desc: 'Calculate simple and compound interest', icon: Percent, link: '/interest' },
    { name: 'Typing Test', desc: 'Test your typing speed in English or Bangla', icon: Type, link: '/typing-test' },
    { name: 'Word Counter', desc: 'Count words, characters, and sentences', icon: FileText, link: '/word-counter' },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden pb-24 pt-16 transition-colors duration-200 ease-in-out animate-in fade-in duration-700 sm:pb-32 sm:pt-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-slate-50 dark:from-indigo-900/10 dark:via-slate-900 dark:to-slate-900" />

        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-indigo-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400">
            Free Online Tools
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-7xl">
            All-in-One Smart <br className="hidden sm:block" />
            <span className="text-indigo-600 dark:text-indigo-400">Calculator Platform</span>
          </h1>

          <p className="mx-auto mt-6 max-w-[600px] text-lg tracking-tight text-slate-600 dark:text-slate-300">
            Use free online calculators, converters, and productivity tools built for fast answers and clean results.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/scientific"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-indigo-700 hover:shadow-md"
            >
              Start Calculating
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 transition-colors duration-200 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Explore Our Tools</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Everything you need for quick calculations and conversions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.name}
                to={tool.link}
                className="group flex flex-col items-start rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="mb-4 rounded-xl bg-indigo-100 p-3 text-indigo-600 transition-transform duration-200 group-hover:scale-110 dark:bg-indigo-900/50 dark:text-indigo-400">
                  <tool.icon size={24} />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">{tool.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
