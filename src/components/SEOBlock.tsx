import React from 'react';
import { Link } from 'react-router-dom';

interface SEOBlockProps {
  title: string;
  description: string[];
  howToUse: string[];
  formulas?: { title: string; formula: string }[];
  examples?: { question: string; calculation: string }[];
  benefits: string[];
  faq: { question: string; answer: string }[];
  relatedTools?: { name: string; link: string }[];
}

export function SEOBlock({ title, description, howToUse, formulas, examples, benefits, faq, relatedTools }: SEOBlockProps) {
  return (
    <div className="mt-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-6 sm:p-8 prose prose-slate dark:prose-invert max-w-none">
        
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-0">What is the {title}?</h2>
        {description.map((p, i) => <p key={i}>{p}</p>)}
        
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">How to Use the {title}</h2>
        <ul>
          {howToUse.map((item, i) => <li key={i}>{item}</li>)}
        </ul>

        {formulas && formulas.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title} Formula</h2>
            <div className="not-prose space-y-4 mb-8">
              {formulas.map((item, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <strong className="block text-slate-900 dark:text-white mb-2">{item.title}</strong>
                  <code className="text-indigo-600 dark:text-indigo-400 font-mono text-lg">{item.formula}</code>
                </div>
              ))}
            </div>
          </>
        )}

        {examples && examples.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Example Calculations</h2>
            <div className="not-prose space-y-4 mb-8">
              {examples.map((item, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <strong className="block text-slate-900 dark:text-white mb-2">{item.question}</strong>
                  <p className="text-slate-600 dark:text-slate-400 font-mono">{item.calculation}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Benefits of Using This Calculator</h2>
        <ul>
          {benefits.map((item, i) => <li key={i}>{item}</li>)}
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
        <div className="space-y-4 not-prose mb-8">
          {faq.map((item, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <strong className="block text-slate-900 dark:text-white mb-2">{item.question}</strong>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>

        {relatedTools && relatedTools.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">You may also like:</h2>
            <div className="not-prose flex flex-wrap gap-3">
              {relatedTools.map((tool, i) => (
                <Link 
                  key={i} 
                  to={tool.link}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors font-medium text-sm"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
