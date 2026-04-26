import React from 'react';
import { Link } from 'react-router-dom';
import { FAQAccordion } from './FAQAccordion';
import type { ToolContent } from '../lib/toolContent';

interface SEOBlockProps {
  content: ToolContent;
}

export function SEOBlock({ content }: SEOBlockProps) {
  return (
    <div className="mt-16 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50/70 px-6 py-8 dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 sm:px-8">
        <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
          Quick Answer
        </span>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {content.title}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
          {content.shortAnswer}
        </p>
      </div>

      <div className="space-y-10 px-6 py-8 sm:px-8 sm:py-10">
        <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Explanation</h3>
          <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
            {content.explanation.map((paragraph) => (
              <p key={paragraph} className="leading-7">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Formula</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {content.formulas.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-950 p-5 shadow-sm dark:border-slate-700"
              >
                <div className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
                  {item.title}
                </div>
                <pre className="overflow-x-auto text-sm text-cyan-300">
                  <code>{item.formula}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Example Calculation</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {content.examples.map((item) => (
              <article
                key={item.question}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
              >
                <h4 className="text-base font-semibold text-slate-900 dark:text-white">{item.question}</h4>
                <p className="mt-3 font-mono text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.calculation}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Common Mistakes</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {content.commonMistakes.map((mistake) => (
              <div
                key={mistake}
                className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100"
              >
                {mistake}
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Search-intent focused questions with direct answers.
              </p>
            </div>
          </div>
          <FAQAccordion items={content.faq} />
        </section>

        <section>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Related Tools</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Explore related calculators and utilities in the same SEO cluster.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {content.relatedTools.map((tool) => (
              <Link
                key={tool.link}
                to={tool.link}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-indigo-500/40 dark:hover:bg-slate-900"
              >
                <div className="text-lg font-semibold text-slate-900 transition group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">
                  {tool.name}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
