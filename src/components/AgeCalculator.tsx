import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { SEOBlock } from './SEOBlock';

export function AgeCalculator() {
  const [dob, setDob] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{ years: number; months: number; days: number; totalDays: number; nextBirthdayDays: number } | null>(null);

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

    const diffTime = Math.abs(targetDate.getTime() - birthDate.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Next birthday
    const nextBirthday = new Date(birthDate);
    nextBirthday.setFullYear(targetDate.getFullYear());
    if (nextBirthday < targetDate) {
      nextBirthday.setFullYear(targetDate.getFullYear() + 1);
    }
    const nextBirthdayDiff = Math.ceil((nextBirthday.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));

    setResult({ years, months, days, totalDays, nextBirthdayDays: nextBirthdayDiff });
  };

  return (
    <section id="age" className="py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Calendar size={28} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Age Calculator</h1>
        </div>
        
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-3xl">
          Instantly calculate your exact age in years, months, and days with our free online Age Calculator. Find out how many total days you've lived and get a countdown to your next birthday. Perfect for filling out official forms or just satisfying your curiosity.
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 p-6 sm:p-8 transition-all duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Date</label>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
            </div>
          </div>

          {result && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800/50 animate-in zoom-in duration-300">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 text-center">Your Exact Age</h2>
              <div className="grid grid-cols-3 gap-4 text-center mb-6">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm hover:-translate-y-1 transition-transform">
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{result.years}</div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Years</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm hover:-translate-y-1 transition-transform">
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{result.months}</div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Months</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm hover:-translate-y-1 transition-transform">
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{result.days}</div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Days</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm hover:-translate-y-1 transition-transform">
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Days Lived</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{result.totalDays.toLocaleString()}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm hover:-translate-y-1 transition-transform">
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Next Birthday In</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{result.nextBirthdayDays} days</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <SEOBlock
          title="FreeAge Calculator"
          description={[
            "Our online Age Calculator is a precise tool designed to help you calculate your exact age from your date of birth. Whether you need to know your age in years, months, and days for official documents, or you're simply curious about the total number of days you've lived, this tool provides instant and accurate results.",
            "Using an exact age calculator eliminates the need for manual calculations, ensuring you get error-free results every time. It's perfect for calculating age for admission forms, passport applications, or tracking milestones."
          ]}
          howToUse={[
            "Select your Date of Birth using the calendar input.",
            "The Current Date is automatically selected, but you can change it to calculate age at a specific point in the past or future.",
            "The calculator will instantly display your exact age in years, months, and days.",
            "You can also view your total days lived and the countdown to your next birthday."
          ]}
          formulas={[
            { title: "Age Calculation Logic", formula: "Current Date - Date of Birth (accounting for leap years and varying month lengths)" }
          ]}
          examples={[
            { question: "If born on Jan 1, 2000, what is the age on Jan 1, 2024?", calculation: "24 Years, 0 Months, 0 Days" }
          ]}
          benefits={[
            "100% Free and Online: Calculate age online without downloading any software.",
            "High Precision: Get your exact age down to the day.",
            "Instant Results: No waiting or page reloads required.",
            "Privacy Focused: Your data is processed locally in your browser and never stored on our servers."
          ]}
          faq={[
            {
              question: "How is my exact age calculated?",
              answer: "The calculator determines the difference between your date of birth and the current date, accounting for leap years and varying month lengths to provide an exact breakdown in years, months, and days."
            },
            {
              question: "Can I calculate my age on a future date?",
              answer: "Yes, simply change the \"Current Date\" field to any future date to see how old you will be at that specific time."
            },
            {
              question: "Is this tool free to use?",
              answer: "Absolutely. Our age calculator is completely free to use as many times as you need."
            }
          ]}
          relatedTools={[
            { name: "Percentage Calculator", link: "/percentage" },
            { name: "Loan Calculator", link: "/loan" },
            { name: "Unit Converter", link: "/converter" }
          ]}
        />
      </div>
    </section>
  );
}
