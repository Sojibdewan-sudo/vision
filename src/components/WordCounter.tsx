import React, { useState, useEffect } from 'react';
import { Copy, Trash2, FileText, Type, Hash, AlignLeft, AlignJustify, Clock } from 'lucide-react';
import { SEOBlock } from './SEOBlock';

export function WordCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0
  });

  useEffect(() => {
    // Calculate stats
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length : 0;
    const paragraphs = text.trim() ? text.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
    const readingTime = Math.ceil(words / 200); // Average reading speed is 200 wpm

    setStats({
      words,
      characters,
      charactersNoSpaces,
      sentences: sentences === 0 && text.trim() ? 1 : sentences,
      paragraphs,
      readingTime
    });
  }, [text]);

  const handleClear = () => {
    setText('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section id="word-counter" className="py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
            <FileText size={24} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Word Counter</h1>
        </div>
        
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-3xl">
          Count words, characters, sentences, and paragraphs instantly with our free online Word Counter. Perfect for writers, students, and professionals who need to meet strict word count limits or estimate reading times.
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
              <FileText size={18} />
              <span>Text Input</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                title="Copy text"
              >
                <Copy size={16} />
                <span className="hidden sm:inline">Copy</span>
              </button>
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Clear text"
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
            className="w-full h-64 p-6 bg-transparent border-none focus:ring-0 text-slate-800 dark:text-slate-200 resize-y placeholder-slate-400 dark:placeholder-slate-500"
            spellCheck="false"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          <StatCard icon={<Type size={20} />} label="Words" value={stats.words} />
          <StatCard icon={<Hash size={20} />} label="Characters" value={stats.characters} />
          <StatCard icon={<Hash size={20} />} label="Characters (No Spaces)" value={stats.charactersNoSpaces} />
          <StatCard icon={<AlignLeft size={20} />} label="Sentences" value={stats.sentences} />
          <StatCard icon={<AlignJustify size={20} />} label="Paragraphs" value={stats.paragraphs} />
          <StatCard icon={<Clock size={20} />} label="Reading Time" value={`${stats.readingTime} min`} />
        </div>

        <SEOBlock
          title="Word Counter"
          description={[
            "Our online Word Counter is an essential tool for anyone who writes. Whether you are crafting an essay, writing a blog post, or preparing a tweet, keeping track of your text length is crucial.",
            "This tool goes beyond simple word counting. It provides a comprehensive analysis of your text, including character counts (with and without spaces), sentence and paragraph counts, and even an estimated reading time."
          ]}
          howToUse={[
            "Simply start typing in the large text box provided.",
            "Alternatively, you can copy text from your document and paste it directly into the box.",
            "The statistics above the text box will update instantly as you type or paste.",
            "Use the 'Copy' button to quickly copy your text, or the 'Clear' button to start over."
          ]}
          formulas={[
            { title: "Reading Time", formula: "Estimated Reading Time = Total Words / 200 (average words per minute)" }
          ]}
          examples={[
            { question: "How many characters in a tweet?", calculation: "Twitter allows up to 280 characters. Use the 'Characters' stat to ensure you stay within the limit." }
          ]}
          benefits={[
            "Real-Time Updates: See your stats change instantly as you type.",
            "Comprehensive Metrics: Get more than just word counts; track sentences, paragraphs, and reading time.",
            "Privacy Assured: Your text is processed entirely within your browser and is never sent to our servers.",
            "Clean Interface: A distraction-free writing environment."
          ]}
          faq={[
            {
              question: "Does it count spaces as characters?",
              answer: "Yes, the standard 'Characters' metric includes spaces. However, we also provide a 'Characters (No Spaces)' metric for specific requirements."
            },
            {
              question: "How is reading time calculated?",
              answer: "Reading time is estimated based on an average reading speed of 200 words per minute. It divides your total word count by 200 to give an approximate time in minutes."
            },
            {
              question: "Is there a word limit?",
              answer: "No, there is no strict word limit. The tool can handle large documents, though extremely massive texts might slow down your browser."
            }
          ]}
          relatedTools={[
            { name: "Typing Test", link: "/typing" },
            { name: "AI Text Calculator", link: "/ai" }
          ]}
        />
      </div>
    </section>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center transition-transform hover:scale-105">
      <div className="text-indigo-500 dark:text-indigo-400 mb-2">
        {icon}
      </div>
      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </div>
    </div>
  );
}
