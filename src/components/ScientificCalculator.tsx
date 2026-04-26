import React, { useEffect, useRef, useState } from 'react';
import { evaluate, format } from 'mathjs';
import { Calculator as CalcIcon } from 'lucide-react';
import { SEOBlock } from './SEOBlock';
import { CopyResultButton } from './CopyResultButton';
import { getToolContent } from '../lib/toolContent';

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
  { label: 'sqrt', value: 'sqrt(', type: 'function' },
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
  { label: '*', value: '*', type: 'operator' },
  { label: '/', value: '/', type: 'operator' },
  { label: '1', value: '1', type: 'number' },
  { label: '2', value: '2', type: 'number' },
  { label: '3', value: '3', type: 'number' },
  { label: '+', value: '+', type: 'operator' },
  { label: '-', value: '-', type: 'operator' },
  { label: '0', value: '0', type: 'number' },
  { label: '.', value: '.', type: 'number' },
  { label: 'pi', value: 'pi', type: 'constant' },
  { label: 'e', value: 'e', type: 'constant' },
  { label: '=', value: '=', type: 'action' },
];

const formatResult = (value: unknown) => {
  if (typeof value === 'number') return format(value, { precision: 14 });
  if (value && typeof value === 'object' && 'toString' in value) return value.toString();
  return String(value);
};

export function ScientificCalculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [memory, setMemory] = useState<number>(0);

  const calculatedRef = useRef(false);
  const lastResultRef = useRef('');
  const content = getToolContent('scientific');

  const handleInput = (value: string) => {
    if (calculatedRef.current) {
      if (['+', '-', '*', '/', '^', '%'].includes(value)) {
        setExpression(`${lastResultRef.current}${value}`);
      } else {
        setExpression(value);
      }
      setResult('');
      lastResultRef.current = '';
      calculatedRef.current = false;
      return;
    }

    setExpression((prev) => prev + value);
  };

  const calculate = () => {
    try {
      if (!expression) return;
      const evaluated = evaluate(expression);
      const formatted = formatResult(evaluated);
      setResult(formatted);
      lastResultRef.current = formatted;
      calculatedRef.current = true;
    } catch {
      setResult('Error');
      lastResultRef.current = 'Error';
      calculatedRef.current = true;
    }
  };

  const clearAll = () => {
    setExpression('');
    setResult('');
    lastResultRef.current = '';
    calculatedRef.current = false;
  };

  const backspace = () => {
    if (calculatedRef.current) {
      clearAll();
      return;
    }
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleMemory = (action: string) => {
    if (action === 'MC') {
      setMemory(0);
      return;
    }
    if (action === 'MR') {
      handleInput(memory.toString());
      return;
    }

    const source = calculatedRef.current ? lastResultRef.current : expression;
    if (!source || source === 'Error') return;

    try {
      const evaluated = evaluate(source);
      if (typeof evaluated === 'number') {
        setMemory((prev) => (action === 'M+' ? prev + evaluated : prev - evaluated));
      }
    } catch {
      return;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

      if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculate();
        return;
      }
      if (event.key === 'Backspace') {
        event.preventDefault();
        backspace();
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        clearAll();
        return;
      }
      if ('0123456789+-*/().%^!'.includes(event.key)) {
        event.preventDefault();
        handleInput(event.key);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [expression]);

  return (
    <section id="scientific" className="py-16 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            <CalcIcon size={24} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Scientific Calculator</h1>
        </div>

        <p className="mb-8 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Use this scientific calculator online for trigonometry, logarithms, roots, powers, constants, and longer expressions with keyboard support and copyable results.
        </p>

        <div className="mx-auto max-w-md rounded-[2rem] border border-slate-800 bg-slate-900 p-5 shadow-2xl">
          <div className="mb-5 rounded-2xl border border-slate-700 bg-[#b5c1b2] p-4 shadow-inner">
            <div className="mb-3 min-h-[1.5rem] overflow-x-auto text-right font-mono text-sm text-slate-800/80">
              {expression || ' '}
            </div>
            <div className="overflow-x-auto text-right font-mono text-4xl font-bold text-slate-900">
              {result || '0'}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                {memory !== 0 ? `Memory: ${memory}` : 'Ready'}
              </span>
              <CopyResultButton value={result || expression || '0'} />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {buttons.map((button) => (
              <button
                key={`${button.label}-${button.value}`}
                onClick={() => {
                  if (button.type === 'memory') handleMemory(button.value);
                  else if (button.value === 'AC') clearAll();
                  else if (button.value === 'DEL') backspace();
                  else if (button.value === '=') calculate();
                  else handleInput(button.value);
                }}
                className={getButtonClass(button.type, button.label)}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>

        {content && <SEOBlock content={content} />}
      </div>
    </section>
  );
}

function getButtonClass(type: ButtonType, label: string) {
  const base =
    'flex min-h-[52px] items-center justify-center rounded-xl border-b-4 px-2 text-sm font-semibold transition active:translate-y-0.5';

  if (label === 'DEL' || label === 'AC') {
    return `${base} border-red-700 bg-red-500 text-white hover:bg-red-400`;
  }
  if (label === '=') {
    return `${base} border-indigo-700 bg-indigo-600 text-white hover:bg-indigo-500`;
  }
  if (type === 'number' || type === 'constant') {
    return `${base} border-slate-300 bg-slate-100 text-slate-900 hover:bg-white`;
  }
  if (type === 'operator') {
    return `${base} border-slate-500 bg-slate-300 text-slate-900 hover:bg-slate-200`;
  }
  if (type === 'memory') {
    return `${base} border-indigo-900 bg-indigo-800 text-indigo-100 hover:bg-indigo-700`;
  }
  return `${base} border-slate-800 bg-slate-700 text-slate-100 hover:bg-slate-600`;
}
