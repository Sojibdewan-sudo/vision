import React, { useState, useEffect } from 'react';
import { Landmark } from 'lucide-react';
import { SEOBlock } from './SEOBlock';

export function LoanCalculator() {
  const [principal, setPrincipal] = useState<number | ''>('');
  const [rate, setRate] = useState<number | ''>('');
  const [tenure, setTenure] = useState<number | ''>('');
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  const [result, setResult] = useState<{ emi: number; totalPayment: number; totalInterest: number; principalPercentage: number; interestPercentage: number } | null>(null);

  useEffect(() => {
    if (principal && rate && tenure) {
      calculateLoan();
    } else {
      setResult(null);
    }
  }, [principal, rate, tenure, tenureType]);

  const calculateLoan = () => {
    const P = Number(principal);
    const R = Number(rate) / 12 / 100;
    const N = tenureType === 'years' ? Number(tenure) * 12 : Number(tenure);

    if (P <= 0 || R <= 0 || N <= 0) return;

    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    const principalPercentage = (P / totalPayment) * 100;
    const interestPercentage = (totalInterest / totalPayment) * 100;

    setResult({ emi, totalPayment, totalInterest, principalPercentage, interestPercentage });
  };

  return (
    <section id="loan" className="py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Landmark size={28} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Loan Calculator</h1>
        </div>
        
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-3xl">
          Plan your finances effectively with our free online Loan Calculator. Calculate your Equated Monthly Installment (EMI), total interest payable, and the overall cost of your loan. Perfect for home loans, car loans, and personal loans.
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 p-6 sm:p-8 transition-all duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Loan Amount</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                placeholder="e.g. 1000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Interest Rate (% p.a.)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                placeholder="e.g. 9.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tenure</label>
              <div className="flex">
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-l-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  placeholder="e.g. 10"
                />
                <select
                  value={tenureType}
                  onChange={(e) => setTenureType(e.target.value as 'years' | 'months')}
                  className="bg-slate-100 dark:bg-slate-700 border border-l-0 border-slate-200 dark:border-slate-700 rounded-r-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
          </div>

          {result && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800/50 animate-in zoom-in duration-300">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 text-center">Loan Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:-translate-y-1 transition-transform">
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Monthly EMI</div>
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    {result.emi.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:-translate-y-1 transition-transform">
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Interest</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {result.totalInterest.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:-translate-y-1 transition-transform">
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Payable</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {result.totalPayment.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Breakdown</h3>
                <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex mb-4">
                  <div className="h-full bg-indigo-500" style={{ width: `${result.principalPercentage}%` }}></div>
                  <div className="h-full bg-amber-500" style={{ width: `${result.interestPercentage}%` }}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-slate-600 dark:text-slate-300">Principal ({result.principalPercentage.toFixed(1)}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-slate-600 dark:text-slate-300">Interest ({result.interestPercentage.toFixed(1)}%)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <SEOBlock
          title="Loan Calculator"
          description={[
            "Our comprehensive Loan Calculator is designed to give you a complete picture of your borrowing costs. Beyond just calculating your EMI, it provides a detailed breakdown of the total interest payable and visually represents the ratio of principal to interest over the life of your loan.",
            "Whether you are comparing different loan options or planning your long-term finances, this tool helps you understand exactly how much your loan will cost you in the long run."
          ]}
          howToUse={[
            "Enter the total Loan Amount you wish to borrow.",
            "Input the annual Interest Rate provided by your lender.",
            "Specify the loan Tenure in either years or months.",
            "Review your Monthly EMI, Total Interest, Total Payable amount, and the visual breakdown chart."
          ]}
          formulas={[
            { title: "EMI Calculation", formula: "E = P × r × (1 + r)^n / ((1 + r)^n - 1)" },
            { title: "Variables", formula: "E is EMI, P is Principal, r is monthly interest rate (annual rate/12/100), n is tenure in months" }
          ]}
          examples={[
            { question: "Loan of ₹1,00,000 at 10% for 1 year", calculation: "EMI = ₹8,792, Total Interest = ₹5,499" }
          ]}
          benefits={[
            "Visual Insights: The progress bar clearly shows how much of your payment goes towards interest versus the principal.",
            "Better Decisions: Compare different loan scenarios to find the most cost-effective option.",
            "Accurate Results: Uses the standard mathematical formula for precise calculations.",
            "Time-Saving: Avoid complex manual math and get instant answers."
          ]}
          faq={[
            {
              question: "Why is the total interest so high?",
              answer: "In the early years of a loan, a larger portion of your EMI goes towards paying off the interest rather than the principal. Over a long tenure, this can add up significantly."
            },
            {
              question: "How can I reduce my total interest?",
              answer: "You can reduce your total interest by choosing a shorter loan tenure, negotiating a lower interest rate, or making prepayments towards your principal amount."
            },
            {
              question: "Is this calculator suitable for mortgages?",
              answer: "Yes, this calculator is perfect for home loans (mortgages), car loans, and personal loans that use a reducing balance interest calculation."
            }
          ]}
          relatedTools={[
            { name: "Interest Calculator", link: "/interest" },
            { name: "Percentage Calculator", link: "/percentage" },
            { name: "Age Calculator", link: "/age" }
          ]}
        />
      </div>
    </section>
  );
}
