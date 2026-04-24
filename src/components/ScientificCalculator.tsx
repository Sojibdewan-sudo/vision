import React, { useState, useEffect, useRef } from 'react';
import { evaluate, format } from 'mathjs';
import { Calculator as CalcIcon } from 'lucide-react';
import { SEOBlock } from './SEOBlock';

type ButtonType = 'number' | 'operator' | 'function' | 'action' | 'memory' | 'constant';

interface CalcButton {
  label: string;
  value: string;
  type: ButtonType;
}

const buttons: CalcButton[] = [
  { label: 'sin', value: 'sin(', type: 'function' },
  { label: 'cos', value: 'cos(', type: 'function' },
  { label: 'tan', value: 'tan(', type: 'function' },
  { label: 'log', value: 'log10(', type: 'function' },
  { label: 'ln', value: 'log(', type: 'function' },

  { label: '(', value: '(', type: 'function' },
  { label: ')', value: ')', type: 'function' },
  { label: '√', value: 'sqrt(', type: 'function' },
  { label: 'x^y', value: '^', type: 'operator' },
  { label: 'x!', value: '!', type: 'function' },

  { label: 'MC', value: 'MC', type: 'memory' },
  { label: 'MR', value: 'MR', type: 'memory' },
  { label: 'M+', value: 'M+', type: 'memory' },
  { label: 'M-', value: 'M-', type: 'memory' },
  { label: '%', value: '%', type: 'operator' },

  { label: '7', value: '7', type: 'number' },
  { label: '8', value: '8', type: 'number' },
  { label: '9', value: '9', type: 'number' },
  { label: 'DEL', value: 'DEL', type: 'action' },
  { label: 'AC', value: 'AC', type: 'action' },

  { label: '4', value: '4', type: 'number' },
  { label: '5', value: '5', type: 'number' },
  { label: '6', value: '6', type: 'number' },
  { label: '×', value: '*', type: 'operator' },
  { label: '÷', value: '/', type: 'operator' },

  { label: '1', value: '1', type: 'number' },
  { label: '2', value: '2', type: 'number' },
  { label: '3', value: '3', type: 'number' },
  { label: '+', value: '+', type: 'operator' },
  { label: '-', value: '-', type: 'operator' },

  { label: '0', value: '0', type: 'number' },
  { label: '.', value: '.', type: 'number' },
  { label: 'π', value: 'pi', type: 'constant' },
  { label: 'e', value: 'e', type: 'constant' },
  { label: '=', value: '=', type: 'action' },
];

const formatResult = (res: any) => {
  if (typeof res === 'number') {
    return format(res, { precision: 14 });
  }
  if (res && res.toString) {
    return res.toString();
  }
  return String(res);
};

const formatForDisplay = (expr: string) => {
  let formatted = expr;
  formatted = formatted.replace(/log10\(/g, 'log_base_10_temp');
  formatted = formatted.replace(/log\(/g, 'ln(');
  formatted = formatted.replace(/log_base_10_temp/g, 'log(');
  formatted = formatted.replace(/\*/g, '×');
  formatted = formatted.replace(/\//g, '÷');
  formatted = formatted.replace(/pi/g, 'π');
  formatted = formatted.replace(/sqrt\(/g, '√(');
  return formatted;
};

export function ScientificCalculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [memory, setMemory] = useState<number>(0);
  
  const isCalculatedRef = useRef(false);
  const resultRef = useRef('');

  const handleInput = (val: string) => {
    if (isCalculatedRef.current) {
      if (['+', '-', '*', '/', '^', '%'].includes(val)) {
        setExpression(resultRef.current + val);
      } else {
        setExpression(val);
      }
      isCalculatedRef.current = false;
      setResult('');
      resultRef.current = '';
    } else {
      setExpression(prev => prev + val);
    }
  };

  const calculate = () => {
    setExpression(prevExpr => {
      try {
        if (!prevExpr) return prevExpr;
        const res = evaluate(prevExpr);
        const formattedRes = formatResult(res);
        setResult(formattedRes);
        resultRef.current = formattedRes;
        isCalculatedRef.current = true;
        return prevExpr;
      } catch (err) {
        setResult('Error');
        resultRef.current = 'Error';
        isCalculatedRef.current = true;
        return prevExpr;
      }
    });
  };

  const backspace = () => {
    if (isCalculatedRef.current) {
      setExpression('');
      setResult('');
      isCalculatedRef.current = false;
      resultRef.current = '';
    } else {
      setExpression(prev => prev.slice(0, -1));
    }
  };

  const clearAll = () => {
    setExpression('');
    setResult('');
    isCalculatedRef.current = false;
    resultRef.current = '';
  };

  const handleMemory = (action: string) => {
    if (action === 'MC') {
      setMemory(0);
    } else if (action === 'MR') {
      handleInput(memory.toString());
    } else if (action === 'M+' || action === 'M-') {
      setExpression(prevExpr => {
        try {
          const exprToEval = isCalculatedRef.current ? resultRef.current : prevExpr;
          if (!exprToEval || exprToEval === 'Error') return prevExpr;
          const res = evaluate(exprToEval);
          if (typeof res === 'number') {
            setMemory(m => action === 'M+' ? m + res : m - res);
          }
          return prevExpr;
        } catch (e) {
          return prevExpr;
        }
      });
    }
  };

  const onButtonClick = (btn: CalcButton) => {
    if (btn.type === 'memory') {
      handleMemory(btn.value);
    } else if (btn.value === 'AC') {
      clearAll();
    } else if (btn.value === 'DEL') {
      backspace();
    } else if (btn.value === '=') {
      calculate();
    } else {
      handleInput(btn.value);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        backspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        clearAll();
      } else if ("0123456789+-*/().%!".includes(e.key)) {
        e.preventDefault();
        handleInput(e.key);
      } else {
        const keyMap: Record<string, string> = {
          's': 'sin(',
          'c': 'cos(',
          't': 'tan(',
          'l': 'log10(',
          'n': 'log(',
          'p': 'pi',
          'r': 'sqrt(',
          '^': '^'
        };
        if (keyMap[e.key]) {
          e.preventDefault();
          handleInput(keyMap[e.key]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getButtonClass = (type: ButtonType, label: string) => {
    const base = "rounded-xl font-semibold text-sm sm:text-base py-3 sm:py-4 transition-all active:scale-95 shadow-sm border-b-4 active:border-b-0 active:translate-y-1 flex items-center justify-center select-none";
    
    if (label === 'DEL' || label === 'AC') {
      return `${base} bg-red-500 text-white border-red-700 hover:bg-red-400 dark:bg-red-600 dark:border-red-800 dark:hover:bg-red-500`;
    }
    if (label === '=') {
      return `${base} bg-blue-500 text-white border-blue-700 hover:bg-blue-400 dark:bg-blue-600 dark:border-blue-800 dark:hover:bg-blue-500`;
    }
    if (type === 'number' || label === '.') {
      return `${base} bg-slate-100 text-slate-800 border-slate-300 hover:bg-white dark:bg-slate-200 dark:text-slate-900 dark:border-slate-400 dark:hover:bg-white text-lg`;
    }
    if (type === 'operator') {
      return `${base} bg-slate-300 text-slate-800 border-slate-400 hover:bg-slate-200 dark:bg-slate-600 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-500 text-lg`;
    }
    if (type === 'memory') {
      return `${base} bg-indigo-200 text-indigo-900 border-indigo-300 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-200 dark:border-indigo-950 dark:hover:bg-indigo-800/50 text-xs sm:text-sm`;
    }
    return `${base} bg-slate-700 text-slate-200 border-slate-800 hover:bg-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-950 dark:hover:bg-slate-700`;
  };

  return (
    <section id="scientific" className="py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
            <CalcIcon size={24} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Scientific Calculator</h1>
        </div>
        
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-3xl">
          Solve complex mathematical problems instantly with our free online Scientific Calculator. Featuring advanced functions like trigonometry, logarithms, and exponentiation, it's the perfect tool for students, engineers, and professionals needing precise calculations.
        </p>

        <div className="max-w-md mx-auto bg-slate-800 dark:bg-slate-900 p-4 sm:p-6 rounded-3xl shadow-2xl border-b-8 border-slate-900 dark:border-black transition-all duration-200">
          {/* Brand / Solar Panel Area */}
          <div className="flex justify-between items-center mb-4 px-2">
            <div className="text-slate-400 font-bold tracking-widest text-sm">SMARTCALC</div>
            <div className="flex gap-1">
              <div className="w-16 h-4 bg-slate-900 dark:bg-black rounded-sm border border-slate-700 flex">
                {[1,2,3,4].map(i => <div key={i} className="flex-1 border-r border-slate-800/50 last:border-0"></div>)}
              </div>
            </div>
          </div>

          {/* Display */}
          <div className="bg-[#a5b3a6] dark:bg-[#8a9a8b] p-3 sm:p-4 rounded-xl shadow-inner border-4 border-slate-700 dark:border-slate-800 flex flex-col items-end justify-between h-28 sm:h-32 mb-6 relative">
            <div className="text-[#1a1c1a] text-sm sm:text-base font-mono tracking-wider w-full text-right overflow-x-auto whitespace-nowrap scrollbar-hide opacity-80 min-h-[1.5rem]">
              {formatForDisplay(expression)}
            </div>
            <div className="text-[#1a1c1a] text-3xl sm:text-4xl font-bold font-mono tracking-tight w-full text-right overflow-x-auto whitespace-nowrap scrollbar-hide">
              {result || (expression ? '' : '0')}
            </div>
            {memory !== 0 && (
              <div className="absolute top-2 left-3 text-[#1a1c1a] text-xs font-bold opacity-70">M</div>
            )}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {buttons.map((btn, idx) => (
              <button
                key={idx}
                onClick={() => onButtonClick(btn)}
                className={getButtonClass(btn.type, btn.label)}
                title={btn.type === 'function' ? `Keyboard: ${btn.label[0]}` : undefined}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <SEOBlock
          title="Scientific Calculator"
          description={[
            "Our online Scientific Calculator is a powerful tool designed to solve complex mathematical problems that go beyond basic arithmetic.",
            "Whether you are a student tackling algebra and trigonometry, or a professional dealing with advanced equations, this calculator provides the precision and functions you need.",
            "It includes features like trigonometric functions (sine, cosine, tangent), logarithms, square roots, and exponentiation, making it an indispensable tool for science, engineering, and mathematics."
          ]}
          howToUse={[
            "Click or tap the buttons on the keypad to enter your mathematical expression, or use your computer keyboard.",
            "Use the AC button to clear the entire expression, or the DEL button to delete the last entry.",
            "For functions like sin( or log(, enter the function first, followed by the value, and close the parenthesis ).",
            "Press the = button or Enter key to evaluate the expression.",
            "Use M+, M-, MR, and MC to manage memory."
          ]}
          formulas={[
            { title: "Trigonometry", formula: "sin(x), cos(x), tan(x)" },
            { title: "Logarithms", formula: "log(x) [base 10], ln(x) [natural log]" },
            { title: "Exponentiation", formula: "x^y" }
          ]}
          examples={[
            { question: "Calculate the sine of 90 degrees (in radians):", calculation: "sin(pi/2) = 1" },
            { question: "Find the square root of 144:", calculation: "sqrt(144) = 12" },
            { question: "Calculate 2 to the power of 10:", calculation: "2^10 = 1024" }
          ]}
          benefits={[
            "Advanced Functions: Access a wide range of mathematical operations in one place.",
            "Clean Interface: The large, clear display makes it easy to read long expressions and results.",
            "Always Available: Use it anytime, anywhere, directly from your browser without needing a physical calculator.",
            "Keyboard Support: Quickly enter expressions using your computer keyboard."
          ]}
          faq={[
            {
              question: "Does it support trigonometric functions?",
              answer: "Yes, it fully supports sine (sin), cosine (cos), and tangent (tan) functions. Note that inputs are typically evaluated in radians by default depending on the math engine."
            },
            {
              question: "How do I calculate a square root?",
              answer: "Press the √ button, enter the number, close the parenthesis, and hit calculate. For example: sqrt(16) = 4."
            },
            {
              question: "Can I use keyboard input?",
              answer: "Yes, the calculator supports full keyboard input for numbers, operators, and advanced functions. You can type 's' for sin, 'c' for cos, 'p' for pi, etc."
            }
          ]}
          relatedTools={[
            { name: "Percentage Calculator", link: "/percentage" },
            { name: "Unit Converter", link: "/converter" }
          ]}
        />
      </div>
    </section>
  );
}
