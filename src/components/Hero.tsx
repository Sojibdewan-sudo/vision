import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Cpu, Zap, Percent, Calendar, Landmark, Settings2, Type, FileText } from 'lucide-react';

export function Hero() {
  const tools = [
    { name: 'Scientific Calculator', desc: 'Advanced mathematical functions', icon: Zap, link: '/scientific' },
    { name: 'Percentage Calculator', desc: 'Calculate percentages easily', icon: Percent, link: '/percentage' },
    { name: 'Unit Converter', desc: 'Convert length, weight, temperature, etc.', icon: Settings2, link: '/converter' },
    { name: 'Age Calculator', desc: 'Calculate exact age in years, months, days', icon: Calendar, link: '/age' },
    { name: 'Loan Calculator', desc: 'Calculate EMI and interest breakdown', icon: Landmark, link: '/loan' },
    { name: 'Interest Calculator', desc: 'Calculate simple and compound interest', icon: Percent, link: '/interest' },
    { name: 'AI Text Calculator', desc: 'Solve math problems with AI', icon: Cpu, link: '/ai' },
    { name: 'Typing Test', desc: 'Test your typing speed (English/Bangla)', icon: Type, link: '/typing-test' },
    { name: 'Word Counter', desc: 'Count words, characters, and sentences', icon: FileText, link: '/word-counter' },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32 transition-colors duration-200 ease-in-out animate-in fade-in duration-700">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-slate-50 dark:from-indigo-900/10 dark:via-slate-900 dark:to-slate-900"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            ✨ Free Online Tools
          </div>
          
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-7xl">
            All-in-One Smart <br className="hidden sm:block" />
            <span className="text-indigo-600 dark:text-indigo-400">
              Calculator Platform
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-[600px] text-lg tracking-tight text-slate-600 dark:text-slate-300">
            Convert units instantly, use advanced scientific calculator, and solve real-life problems with AI. Free online smart calculator tool.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/scientific"
              className="inline-flex items-center justify-center rounded-xl py-3 px-8 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
            >
              Start Calculating
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/ai"
              className="inline-flex items-center justify-center rounded-xl py-3 px-8 text-sm font-semibold bg-transparent text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 ease-in-out"
            >
              Try AI Assistant
              <Cpu className="ml-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Explore Our Tools</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Everything you need for quick calculations and conversions.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link key={tool.name} to={tool.link} className="flex flex-col items-start p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 ease-in-out group">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform duration-200">
                  <tool.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{tool.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

