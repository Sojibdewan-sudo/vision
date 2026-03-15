import React, { useState } from 'react';
import { Percent } from 'lucide-react';
import { SEOBlock } from './SEOBlock';
import { evaluate, format } from 'mathjs';

export function PercentageCalculator() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [result1, setResult1] = useState<string | null>(null);

  const [value3, setValue3] = useState('');
  const [value4, setValue4] = useState('');
  const [result2, setResult2] = useState<string | null>(null);

  const [value5, setValue5] = useState('');
  const [value6, setValue6] = useState('');
  const [result3, setResult3] = useState<string | null>(null);

  const formatResult = (res: any) => {
    if (typeof res === 'number') {
      return format(res, { precision: 14 });
    }
    return String(res);
  };

  const calculate1 = () => {
    try {
      if (!value1 || !value2) return;
      const res = evaluate(`(${value1} / 100) * ${value2}`);
      setResult1(formatResult(res));
    } catch (e) {
      setResult1('Error');
    }
  };

  const calculate2 = () => {
    try {
      if (!value3 || !value4) return;
      const res = evaluate(`(${value3} / ${value4}) * 100`);
      setResult2(formatResult(res));
    } catch (e) {
      setResult2('Error');
    }
  };

  const calculate3 = () => {
    try {
      if (!value5 || !value6) return;
      const res = evaluate(`((${value6} - ${value5}) / abs(${value5})) * 100`);
      setResult3(formatResult(res));
    } catch (e) {
      setResult3('Error');
    }
  };

  return (
    <section id="percentage" className="py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Percent size={24} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Percentage Calculator</h1>
        </div>
        
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-3xl">
          Calculate percentages instantly with our free Percentage Calculator. Easily find percentage increase, decrease, and percentage of numbers quickly online. Perfect for students, professionals, and everyday calculations like discounts, tips, and taxes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Calculator 1 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">What is X% of Y?</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 dark:text-slate-400">What is</span>
                <input
                  type="number"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                  className="w-20 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
                <span className="text-slate-600 dark:text-slate-400">% of</span>
                <input
                  type="number"
                  value={value2}
                  onChange={(e) => setValue2(e.target.value)}
                  className="w-24 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
                <span className="text-slate-600 dark:text-slate-400">?</span>
              </div>
              <button
                onClick={calculate1}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Calculate
              </button>
              {result1 !== null && (
                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Result: </span>
                  <span className="text-xl font-bold text-indigo-700 dark:text-indigo-400">{result1}</span>
                </div>
              )}
            </div>
          </div>

          {/* Calculator 2 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">X is what % of Y?</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={value3}
                  onChange={(e) => setValue3(e.target.value)}
                  className="w-20 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
                <span className="text-slate-600 dark:text-slate-400">is what % of</span>
                <input
                  type="number"
                  value={value4}
                  onChange={(e) => setValue4(e.target.value)}
                  className="w-24 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
                <span className="text-slate-600 dark:text-slate-400">?</span>
              </div>
              <button
                onClick={calculate2}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Calculate
              </button>
              {result2 !== null && (
                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Result: </span>
                  <span className="text-xl font-bold text-indigo-700 dark:text-indigo-400">{result2}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Calculator 3 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Percentage Change</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 dark:text-slate-400">From</span>
                <input
                  type="number"
                  value={value5}
                  onChange={(e) => setValue5(e.target.value)}
                  className="w-20 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
                <span className="text-slate-600 dark:text-slate-400">to</span>
                <input
                  type="number"
                  value={value6}
                  onChange={(e) => setValue6(e.target.value)}
                  className="w-24 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
              <button
                onClick={calculate3}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Calculate
              </button>
              {result3 !== null && (
                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Result: </span>
                  <span className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
                    {Number(result3) > 0 ? '+' : ''}{result3}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <SEOBlock
          title="Percentage Calculator"
          description={[
            "Our online Percentage Calculator is a versatile tool designed to solve everyday percentage problems quickly and accurately.",
            "Whether you need to calculate what X% of Y is, find out what percentage X is of Y, or determine the percentage increase or decrease between two numbers, this tool provides instant answers."
          ]}
          howToUse={[
            "Select the specific type of percentage calculation you need from the three options above.",
            "Enter your numbers into the provided input fields.",
            "Click the 'Calculate' button to instantly see your result.",
            "Use the results for your homework, financial planning, or shopping discounts."
          ]}
          formulas={[
            { title: "What is X% of Y?", formula: "Result = (X / 100) × Y" },
            { title: "X is what % of Y?", formula: "Result = (X / Y) × 100" },
            { title: "Percentage Change", formula: "Result = ((New - Old) / |Old|) × 100" }
          ]}
          examples={[
            { question: "What is 20% of 500?", calculation: "(20 / 100) × 500 = 100" },
            { question: "50 is what % of 200?", calculation: "(50 / 200) × 100 = 25%" },
            { question: "Percentage change from 40 to 50?", calculation: "((50 - 40) / 40) × 100 = +25%" }
          ]}
          benefits={[
            "Quick & Accurate: Get instant results without manual calculations.",
            "Multiple Tools: Three different percentage calculators in one convenient place.",
            "Easy to Use: Simple, intuitive interface designed for everyday use.",
            "Mobile Friendly: Works perfectly on your phone for on-the-go calculations."
          ]}
          faq={[
            {
              question: "How do I calculate percentage of a number?",
              answer: "Divide the percentage by 100 and multiply it by the number. For example, to find 15% of 200: (15 / 100) × 200 = 30."
            },
            {
              question: "How do I calculate a percentage increase?",
              answer: "Use the 'Percentage Change' calculator. Enter the original value in the 'From' field and the new value in the 'to' field. The formula is ((New Value - Old Value) / Old Value) × 100."
            },
            {
              question: "What is 15% of 200?",
              answer: "(15 / 100) × 200 = 30."
            }
          ]}
          relatedTools={[
            { name: "Age Calculator", link: "/age" },
            { name: "Loan Calculator", link: "/loan" },
            { name: "Scientific Calculator", link: "/scientific" },
            { name: "Interest Calculator", link: "/interest" }
          ]}
        />
      </div>
    </section>
  );
}
