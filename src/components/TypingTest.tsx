import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, RotateCcw, Share2 } from 'lucide-react';
import { SEOBlock } from './SEOBlock';
import { getToolContent } from '../lib/toolContent';

const WORD_BANK = {
  en: {
    easy: ['time', 'work', 'light', 'water', 'music', 'paper', 'green', 'table', 'smart', 'clear'],
    medium: ['product', 'system', 'science', 'finance', 'network', 'problem', 'history', 'insight', 'process', 'traffic'],
    hard: ['architecture', 'transformation', 'psychology', 'communication', 'engineering', 'infrastructure', 'investigation', 'extraordinary'],
  },
  bn: {
    easy: ['ami', 'tumi', 'bhalo', 'kaj', 'din', 'rat', 'boi', 'ghor', 'jal', 'bazar'],
    medium: ['manush', 'itihash', 'poribar', 'swasthyo', 'shikkha', 'biggan', 'projukti', 'tottho', 'shomossa', 'somadhan'],
    hard: ['unnoyon', 'poribesh', 'jogajog', 'protisthan', 'proshashon', 'byakkha', 'rupantor', 'dayitto'],
  },
} as const;

const generateWords = (language: 'en' | 'bn', difficulty: 'easy' | 'medium' | 'hard', count: number) => {
  const source = WORD_BANK[language][difficulty];
  return Array.from({ length: count }, () => source[Math.floor(Math.random() * source.length)]);
};

export function TypingTest({ initialLanguage = 'en' }: { initialLanguage?: 'en' | 'bn' }) {
  const [language, setLanguage] = useState<'en' | 'bn'>(initialLanguage);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [timeLimit, setTimeLimit] = useState(60);
  const [words, setWords] = useState<string[]>(() => generateWords(initialLanguage, 'medium', 50));
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, cpm: 0, accuracy: 100, mistakes: 0 });

  const inputRef = useRef<HTMLInputElement>(null);
  const content = getToolContent('typing');

  useEffect(() => {
    resetTest();
  }, [language, difficulty, timeLimit]);

  useEffect(() => {
    if (!isActive || isFinished) return;
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isActive, isFinished]);

  const performanceLevel = useMemo(() => {
    if (stats.wpm < 30) return 'Beginner';
    if (stats.wpm < 50) return 'Intermediate';
    if (stats.wpm < 70) return 'Advanced';
    return 'Pro';
  }, [stats.wpm]);

  const resetTest = () => {
    setWords(generateWords(language, difficulty, 50));
    setTypedWords([]);
    setCurrentInput('');
    setTimeLeft(timeLimit);
    setIsActive(false);
    setIsFinished(false);
    setStats({ wpm: 0, cpm: 0, accuracy: 100, mistakes: 0 });
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const updateStats = (nextTypedWords: string[], nextInput: string, final = false) => {
    let correctChars = 0;
    let totalChars = 0;
    let mistakes = 0;

    nextTypedWords.forEach((typedWord, index) => {
      const targetWord = words[index] || '';
      totalChars += typedWord.length + 1;

      for (let i = 0; i < Math.max(typedWord.length, targetWord.length); i++) {
        if (typedWord[i] === targetWord[i]) correctChars++;
        else mistakes++;
      }
    });

    if (!final && nextInput) {
      const targetWord = words[nextTypedWords.length] || '';
      totalChars += nextInput.length;
      for (let i = 0; i < nextInput.length; i++) {
        if (nextInput[i] === targetWord[i]) correctChars++;
        else mistakes++;
      }
    }

    const minutes = Math.max((timeLimit - timeLeft) / 60, final ? timeLimit / 60 : 1 / 60);
    const wpm = Math.round((correctChars / 5) / minutes);
    const cpm = Math.round(totalChars / minutes);
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

    setStats({ wpm, cpm, accuracy, mistakes });
  };

  const finishTest = () => {
    setIsActive(false);
    setIsFinished(true);
    updateStats(typedWords, currentInput, true);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const value = event.target.value;
    if (!isActive && value.length > 0) setIsActive(true);

    if (value.endsWith(' ')) {
      const nextTypedWords = [...typedWords, value.trim()];
      setTypedWords(nextTypedWords);
      setCurrentInput('');

      if (nextTypedWords.length + 10 >= words.length) {
        setWords((prev) => [...prev, ...generateWords(language, difficulty, 20)]);
      }

      updateStats(nextTypedWords, '');
      return;
    }

    setCurrentInput(value);
    updateStats(typedWords, value);
  };

  return (
    <section id={`typing-${language}`} className="py-16 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            <Keyboard size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {language === 'en' ? 'English' : 'Bangla'} Typing Test
          </h1>
        </div>

        <p className="mb-8 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Use this typing speed test online to check WPM, CPM, accuracy, and mistakes in real time. Practice in English or Bangla with adjustable difficulty and timed sessions.
        </p>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-700">
            <div className="flex flex-wrap gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'bn')}
                disabled={isActive}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value="en">English</option>
                <option value="bn">Bangla</option>
              </select>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                disabled={isActive}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                disabled={isActive}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value={30}>30s</option>
                <option value={60}>1 min</option>
                <option value={120}>2 min</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Time Left</div>
                <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                  {timeLeft}s
                </div>
              </div>
              <button
                onClick={resetTest}
                className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-indigo-300"
                title="Restart Test"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>

          {!isFinished ? (
            <>
              <div
                className="mb-6 flex h-44 flex-wrap content-start overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5 text-2xl leading-relaxed dark:border-slate-700 dark:bg-slate-900/60"
                onClick={() => inputRef.current?.focus()}
              >
                {words.map((word, index) => {
                  const typedWord = typedWords[index];
                  const isCurrent = index === typedWords.length;
                  const isTyped = index < typedWords.length;

                  let className = 'mx-1 my-1 rounded px-1 ';
                  if (isCurrent) className += 'bg-slate-200 dark:bg-slate-700';
                  else if (isTyped && typedWord === word) className += 'text-emerald-600 dark:text-emerald-400';
                  else if (isTyped) className += 'text-red-600 line-through dark:text-red-400';
                  else className += 'text-slate-400 dark:text-slate-500';

                  return (
                    <span key={`${word}-${index}`} className={className}>
                      {word}
                    </span>
                  );
                })}
              </div>

              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={handleInput}
                className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-4 text-center text-xl text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                placeholder="Type here..."
                spellCheck={false}
                autoFocus
              />

              <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                <div className="flex gap-6">
                  <span>WPM: <strong className="text-indigo-600 dark:text-indigo-400">{stats.wpm}</strong></span>
                  <span>Accuracy: <strong className="text-emerald-600 dark:text-emerald-400">{stats.accuracy}%</strong></span>
                </div>
                <span className="hidden sm:block">Start typing to begin the test</span>
              </div>
            </>
          ) : (
            <div className="rounded-[1.75rem] border border-indigo-100 bg-indigo-50 p-8 text-center dark:border-indigo-800/50 dark:bg-indigo-900/20">
              <h2 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">Test Complete</h2>
              <div className="mb-8 inline-flex rounded-full bg-indigo-100 px-5 py-1.5 text-sm font-bold tracking-wide text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                {performanceLevel} Level
              </div>

              <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                <ResultCard label="WPM" value={stats.wpm} accent />
                <ResultCard label="CPM" value={stats.cpm} />
                <ResultCard label="Accuracy" value={`${stats.accuracy}%`} success />
                <ResultCard label="Mistakes" value={stats.mistakes} danger />
              </div>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <button
                  onClick={resetTest}
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-indigo-700"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Restart Test
                </button>
                <button
                  onClick={() => alert('Share functionality coming soon!')}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-base font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share Result
                </button>
              </div>
            </div>
          )}
        </div>

        {content && <SEOBlock content={content} />}
      </div>
    </section>
  );
}

function ResultCard({
  label,
  value,
  accent = false,
  success = false,
  danger = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
  success?: boolean;
  danger?: boolean;
}) {
  const color = accent
    ? 'text-indigo-600 dark:text-indigo-400'
    : success
      ? 'text-emerald-500 dark:text-emerald-400'
      : danger
        ? 'text-red-500 dark:text-red-400'
        : 'text-slate-900 dark:text-white';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className={`text-5xl font-black ${color}`}>{value}</div>
      <div className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}
