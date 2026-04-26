import React, { useEffect, useState } from 'react';
import { AlignJustify, AlignLeft, Clock, Copy, FileText, Hash, Trash2, Type } from 'lucide-react';
import { SEOBlock } from './SEOBlock';
import { getToolContent } from '../lib/toolContent';

export function WordCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  });

  const content = getToolContent('word-counter');

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length : 0;
    const paragraphs = text.trim() ? text.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;
    const readingTime = Math.ceil(words / 200);

    setStats({
      words,
      characters,
      charactersNoSpaces,
      sentences: sentences === 0 && text.trim() ? 1 : sentences,
      paragraphs,
      readingTime,
    });
  }, [text]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <section id="word-counter" className="py-16 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            <FileText size={24} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Word Counter</h1>
        </div>

        <p className="mb-8 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Use this word counter online to count words, characters, sentences, paragraphs, and reading time instantly while you write, paste, or edit content.
        </p>

        <div className="mb-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900/40">
            <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
              <FileText size={18} />
              <span>Text Input</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300"
              >
                <Copy size={16} />
                <span className="hidden sm:inline">Copy</span>
              </button>
              <button
                onClick={() => setText('')}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="h-72 w-full resize-y border-none bg-transparent p-6 text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
            spellCheck="false"
          />
        </div>

        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          <StatCard icon={<Type size={20} />} label="Words" value={stats.words} />
          <StatCard icon={<Hash size={20} />} label="Characters" value={stats.characters} />
          <StatCard icon={<Hash size={20} />} label="No Spaces" value={stats.charactersNoSpaces} />
          <StatCard icon={<AlignLeft size={20} />} label="Sentences" value={stats.sentences} />
          <StatCard icon={<AlignJustify size={20} />} label="Paragraphs" value={stats.paragraphs} />
          <StatCard icon={<Clock size={20} />} label="Reading Time" value={`${stats.readingTime} min`} />
        </div>

        {content && <SEOBlock content={content} />}
      </div>
    </section>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-2 flex justify-center text-indigo-500 dark:text-indigo-400">{icon}</div>
      <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
      <div className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}
