import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, RotateCcw, Share2 } from 'lucide-react';
import { SEOBlock } from './SEOBlock';

const EN_WORDS = {
  easy: ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me'],
  medium: ['people', 'history', 'way', 'art', 'world', 'information', 'map', 'two', 'family', 'government', 'health', 'system', 'computer', 'meat', 'year', 'thanks', 'music', 'person', 'reading', 'method', 'data', 'food', 'understanding', 'theory', 'law', 'bird', 'literature', 'problem', 'software', 'control', 'knowledge', 'power', 'ability', 'economics', 'love', 'internet', 'television', 'science', 'library', 'nature', 'fact', 'product', 'idea', 'temperature', 'investment', 'area', 'society', 'activity', 'story', 'industry'],
  hard: ['phenomenon', 'characteristic', 'responsibility', 'organization', 'international', 'development', 'understanding', 'extraordinary', 'philosophical', 'psychological', 'environmental', 'communication', 'unprecedented', 'comprehensive', 'infrastructure', 'revolutionary', 'sophisticated', 'institutional', 'technological', 'contemporary', 'simultaneously', 'architecture', 'investigation', 'representative', 'administrative', 'circumstances', 'interpretation', 'transformation', 'championship', 'vulnerability']
};

const BN_WORDS = {
  easy: ['আমি', 'তুমি', 'সে', 'আমরা', 'তারা', 'কি', 'কেন', 'কবে', 'কোথায়', 'কিভাবে', 'হ্যাঁ', 'না', 'ভাল', 'খারাপ', 'বড়', 'ছোট', 'নতুন', 'পুরানো', 'দিন', 'রাত', 'আজ', 'কাল', 'জল', 'খাবার', 'বই', 'কলম', 'মা', 'বাবা', 'ভাই', 'বোন', 'হাত', 'পা', 'চোখ', 'মুখ', 'মাথা', 'চুল', 'গাছ', 'ফুল', 'ফল', 'পাখি', 'মাছ', 'গরু', 'কুকুর', 'বিড়াল', 'ঘর', 'বাড়ি', 'রাস্তা', 'গাড়ি', 'দোকান', 'বাজার'],
  medium: ['মানুষ', 'ইতিহাস', 'পথ', 'শিল্প', 'পৃথিবী', 'তথ্য', 'মানচিত্র', 'দুই', 'পরিবার', 'সরকার', 'স্বাস্থ্য', 'ব্যবস্থা', 'কম্পিউটার', 'মাংস', 'বছর', 'ধন্যবাদ', 'সঙ্গীত', 'ব্যক্তি', 'পড়া', 'পদ্ধতি', 'উপাত্ত', 'খাদ্য', 'বোঝা', 'তত্ত্ব', 'আইন', 'পাখি', 'সাহিত্য', 'সমস্যা', 'সফটওয়্যার', 'নিয়ন্ত্রণ', 'জ্ঞান', 'ক্ষমতা', 'সক্ষমতা', 'অর্থনীতি', 'ভালোবাসা', 'ইন্টারনেট', 'টেলিভিশন', 'বিজ্ঞান', 'গ্রন্থাগার', 'প্রকৃতি'],
  hard: ['অভূতপূর্ব', 'বৈশিষ্ট্য', 'দায়িত্ব', 'সংগঠন', 'আন্তর্জাতিক', 'উন্নয়ন', 'বোঝাপড়া', 'অসাধারণ', 'দার্শনিক', 'মনস্তাত্ত্বিক', 'পরিবেশগত', 'যোগাযোগ', 'অভূতপূর্ব', 'ব্যাপক', 'অবকাঠামো', 'বিপ্লবী', 'অত্যাধুনিক', 'প্রাতিষ্ঠানিক', 'প্রযুক্তিগত', 'সমসাময়িক', 'একইসাথে', 'স্থাপত্য', 'তদন্ত', 'প্রতিনিধি', 'প্রশাসনিক', 'পরিস্থিতি', 'ব্যাখ্যা', 'রূপান্তর', 'চ্যাম্পিয়নশিপ', 'দুর্বলতা']
};

const generateWords = (lang: 'en' | 'bn', diff: 'easy' | 'medium' | 'hard', count: number) => {
  const source = lang === 'en' ? EN_WORDS[diff] : BN_WORDS[diff];
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(source[Math.floor(Math.random() * source.length)]);
  }
  return result;
};

export function TypingTest({ initialLanguage = 'en' }: { initialLanguage?: 'en' | 'bn' }) {
  const [language, setLanguage] = useState<'en' | 'bn'>(initialLanguage);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [timeLimit, setTimeLimit] = useState<number>(60);
  const [words, setWords] = useState<string[]>([]);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const [stats, setStats] = useState({ wpm: 0, cpm: 0, accuracy: 100, mistakes: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resetTest();
  }, [language, difficulty, timeLimit]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      endTest();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Auto-scroll logic
  useEffect(() => {
    if (containerRef.current) {
      const activeWord = containerRef.current.querySelector('.active-word');
      if (activeWord) {
        activeWord.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [typedWords.length]);

  const resetTest = () => {
    setWords(generateWords(language, difficulty, 50));
    setTypedWords([]);
    setCurrentInput('');
    setTimeLeft(timeLimit);
    setIsActive(false);
    setIsFinished(false);
    setStats({ wpm: 0, cpm: 0, accuracy: 100, mistakes: 0 });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const endTest = () => {
    setIsActive(false);
    setIsFinished(true);
    calculateStats(true);
  };

  const calculateStats = (final = false) => {
    let correctChars = 0;
    let totalChars = 0;
    let mistakes = 0;

    typedWords.forEach((typed, i) => {
      const target = words[i];
      totalChars += typed.length + 1; // +1 for space
      if (typed === target) {
        correctChars += target.length + 1;
      } else {
        mistakes++;
        for (let j = 0; j < Math.max(typed.length, target.length); j++) {
          if (typed[j] === target[j]) correctChars++;
        }
      }
    });

    // Add current input to stats if not final
    if (!final && currentInput.length > 0) {
      totalChars += currentInput.length;
      const target = words[typedWords.length];
      for (let j = 0; j < currentInput.length; j++) {
        if (currentInput[j] === target[j]) correctChars++;
        else mistakes++;
      }
    }

    const timeSpent = final ? timeLimit / 60 : (timeLimit - timeLeft) / 60;
    const wpm = timeSpent > 0 ? Math.round((correctChars / 5) / timeSpent) : 0;
    const cpm = timeSpent > 0 ? Math.round(totalChars / timeSpent) : 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

    setStats({ wpm, cpm, accuracy, mistakes });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    if (!isActive && e.target.value.length > 0) {
      setIsActive(true);
    }

    const val = e.target.value;
    
    if (val.endsWith(' ')) {
      const newTyped = val.trim();
      if (newTyped.length > 0 || currentInput.length > 0) {
        setTypedWords([...typedWords, newTyped]);
        setCurrentInput('');
        
        // Append more words if getting close to the end
        if (typedWords.length + 10 >= words.length) {
          setWords([...words, ...generateWords(language, difficulty, 20)]);
        }
      }
    } else {
      setCurrentInput(val);
    }
    
    calculateStats();
  };

  const getPerformanceLevel = (wpm: number) => {
    if (wpm < 30) return 'Beginner';
    if (wpm < 50) return 'Intermediate';
    if (wpm < 70) return 'Advanced';
    return 'Pro';
  };

  const renderWord = (word: string, index: number) => {
    const isCurrent = index === typedWords.length;
    const isTyped = index < typedWords.length;
    const typedWord = typedWords[index];

    let wordClass = 'mx-1 my-1 px-1 rounded transition-colors duration-100 ';
    
    if (isCurrent) {
      wordClass += 'bg-slate-200 dark:bg-slate-700 border-b-2 border-indigo-500 active-word';
    } else if (isTyped) {
      if (typedWord === word) {
        wordClass += 'text-emerald-600 dark:text-emerald-400';
      } else {
        wordClass += 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 line-through decoration-red-400/50';
      }
    } else {
      wordClass += 'text-slate-500 dark:text-slate-400';
    }

    return (
      <span key={index} className={wordClass}>
        {word.split('').map((char, charIndex) => {
          let charClass = '';
          if (isCurrent && charIndex < currentInput.length) {
            charClass = currentInput[charIndex] === char 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
          }
          return <span key={charIndex} className={charClass}>{char}</span>;
        })}
        {/* Render extra typed characters in red */}
        {isCurrent && currentInput.length > word.length && (
          <span className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30">
            {currentInput.slice(word.length)}
          </span>
        )}
      </span>
    );
  };

  return (
    <section id={`typing-${language}`} className="py-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Keyboard size={28} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {language === 'en' ? 'English' : 'Bangla'} Typing Test
          </h1>
        </div>
        
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-3xl">
          Test and improve your typing speed with our free online Typing Test. Measure your Words Per Minute (WPM), accuracy, and keystrokes in real-time. Available in both English and Bangla with multiple difficulty levels.
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 p-6 sm:p-8 transition-all duration-200">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'bn')}
                disabled={isActive}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50 transition-all"
              >
                <option value="en">English</option>
                <option value="bn">Bangla</option>
              </select>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                disabled={isActive}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50 transition-all"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                disabled={isActive}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50 transition-all"
              >
                <option value={30}>30s</option>
                <option value={60}>1 min</option>
                <option value={120}>2 min</option>
              </select>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Time Left</div>
                <div className={`text-2xl font-bold tabular-nums ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
                  {timeLeft}s
                </div>
              </div>
              <button
                onClick={resetTest}
                className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-indigo-400 transition-all"
                title="Restart Test"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>

          {/* Main Panel */}
          {!isFinished ? (
            <div className="relative mb-6">
              <div 
                ref={containerRef}
                className="text-2xl leading-relaxed font-medium font-sans text-slate-400 dark:text-slate-500 select-none h-40 overflow-hidden flex flex-wrap content-start"
                onClick={() => inputRef.current?.focus()}
              >
                {words.map((word, index) => renderWord(word, index))}
              </div>
              
              <div className="mt-6 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={handleInput}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-xl text-slate-900 dark:text-white focus:ring-0 focus:border-indigo-500 transition-all outline-none text-center"
                  placeholder="Type here..."
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  autoFocus
                />
              </div>
            </div>
          ) : (
            /* End Result Card */
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-800/50 text-center animate-in zoom-in duration-300">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Test Complete!</h2>
              <div className="inline-block px-5 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold text-sm tracking-wide mb-8">
                {getPerformanceLevel(stats.wpm)} Level
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform">
                  <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 mb-2">{stats.wpm}</div>
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">WPM</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform">
                  <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">{stats.cpm}</div>
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">CPM</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform">
                  <div className="text-5xl font-black text-emerald-500 dark:text-emerald-400 mb-2">{stats.accuracy}%</div>
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Accuracy</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform">
                  <div className="text-5xl font-black text-red-500 dark:text-red-400 mb-2">{stats.mistakes}</div>
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mistakes</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={resetTest}
                  className="inline-flex items-center justify-center rounded-xl py-3.5 px-8 text-base font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Restart Test
                </button>
                <button
                  onClick={() => alert('Share functionality coming soon!')}
                  className="inline-flex items-center justify-center rounded-xl py-3.5 px-8 text-base font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm hover:shadow-md"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share Result
                </button>
              </div>
            </div>
          )}

          {/* Bottom Stats Bar (During Test) */}
          {!isFinished && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex gap-6">
                <span>WPM: <span className="font-bold text-indigo-600 dark:text-indigo-400">{stats.wpm}</span></span>
                <span>Accuracy: <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.accuracy}%</span></span>
              </div>
              <div className="hidden sm:block">
                Start typing to begin the test
              </div>
            </div>
          )}
        </div>

        <SEOBlock
          title="Typing Speed Test"
          description={[
            "Our typing speed test online is a dynamic tool designed to help you measure and improve your typing skills. Whether you want to check your typing speed free of charge or practice for a professional assessment, this WPM test provides real-time feedback on your performance.",
            "With support for both English and Bangla languages, and multiple difficulty levels, you can challenge yourself with an infinite stream of words to truly gauge your typing proficiency."
          ]}
          howToUse={[
            "Select your preferred Language (English or Bangla).",
            "Select your preferred Difficulty (Easy, Medium, or Hard).",
            "Choose a Time Limit (30s, 1 min, or 2 min).",
            "Start typing the highlighted word in the text box. The timer begins automatically on your first keystroke.",
            "Press the Spacebar to move to the next word.",
            "Review your WPM, accuracy, and mistakes at the end of the test."
          ]}
          formulas={[
            { title: "WPM (Words Per Minute)", formula: "WPM = (Correct Characters / 5) / Time in Minutes" },
            { title: "Accuracy", formula: "Accuracy = (Correct Characters / Total Typed Characters) × 100" }
          ]}
          examples={[
            { question: "If you type 250 correct characters in 1 minute:", calculation: "WPM = (250 / 5) / 1 = 50 WPM" }
          ]}
          benefits={[
            "Real-Time Feedback: See your WPM and accuracy update as you type.",
            "Dynamic Content: Never type the same paragraph twice with our infinite word generation engine.",
            "Bilingual Support: Practice typing in both English and Bangla.",
            "Skill Tracking: Identify areas for improvement by reviewing your mistake count and accuracy percentage."
          ]}
          faq={[
            {
              question: "How is WPM calculated?",
              answer: "WPM (Words Per Minute) is calculated by dividing the total number of correctly typed characters by 5 (the standard length of a word) and then dividing by the time elapsed in minutes."
            },
            {
              question: "What is considered a good typing speed?",
              answer: "An average typing speed is around 40 WPM. Speeds above 60 WPM are considered good, and anything over 80 WPM is excellent or professional level."
            },
            {
              question: "Does accuracy matter?",
              answer: "Yes, accuracy is crucial. A high WPM with low accuracy means you spend more time correcting mistakes. Our test factors in accuracy to give you a true measure of your typing proficiency."
            }
          ]}
          relatedTools={[
            { name: "Word Counter", link: "/word-counter" }
          ]}
        />
      </div>
    </section>
  );
}
