import React, { useEffect, useState } from 'react';
import { ArrowRightLeft, Settings2 } from 'lucide-react';
import { SEOBlock } from './SEOBlock';
import { CopyResultButton } from './CopyResultButton';
import { getToolContent } from '../lib/toolContent';

const conversionData: Record<string, Record<string, number>> = {
  Length: { km: 1000, m: 1, cm: 0.01, mm: 0.001, mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254 },
  Area: { 'sq km': 1000000, 'sq m': 1, 'sq cm': 0.0001, 'sq mm': 0.000001, ha: 10000, acre: 4046.86, 'sq mi': 2589988.11, 'sq yd': 0.836127, 'sq ft': 0.092903, 'sq in': 0.00064516 },
  Volume: { 'cu m': 1, 'cu cm': 0.000001, L: 0.001, mL: 0.000001, gal: 0.00378541, qt: 0.000946353, pt: 0.000473176, cup: 0.000236588, 'fl oz': 0.0000295735 },
  Mass: { t: 1000, kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 },
  Time: { year: 31536000, month: 2592000, week: 604800, day: 86400, hr: 3600, min: 60, s: 1, ms: 0.001 },
  Temperature: { C: 1, F: 1, K: 1 },
  Speed: { 'm/s': 1, 'km/h': 0.277778, mph: 0.44704, knot: 0.514444 },
  Pressure: { Pa: 1, kPa: 1000, bar: 100000, psi: 6894.76, atm: 101325 },
  Energy: { J: 1, kJ: 1000, cal: 4.184, kcal: 4184, Wh: 3600, kWh: 3600000 },
  Power: { W: 1, kW: 1000, hp: 745.7 },
  Voltage: { V: 1, kV: 1000, mV: 0.001 },
  Density: { 'kg/m3': 1, 'g/cm3': 1000, 'lb/ft3': 16.0185 },
  'Data Storage': { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776, PB: 1125899906842624 },
};

export function UnitConverter() {
  const categories = Object.keys(conversionData);
  const [category, setCategory] = useState(categories[0]);
  const [fromUnit, setFromUnit] = useState(Object.keys(conversionData[categories[0]])[0]);
  const [toUnit, setToUnit] = useState(Object.keys(conversionData[categories[0]])[1]);
  const [inputValue, setInputValue] = useState('1');
  const [result, setResult] = useState('');
  const [chain, setChain] = useState('');

  const content = getToolContent('converter');

  useEffect(() => {
    const units = Object.keys(conversionData[category]);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  }, [category]);

  useEffect(() => {
    calculate();
  }, [inputValue, fromUnit, toUnit, category]);

  const calculate = () => {
    if (!inputValue || Number.isNaN(Number(inputValue))) {
      setResult('');
      setChain('');
      return;
    }

    const value = Number(inputValue);
    let converted = 0;

    if (category === 'Temperature') {
      if (fromUnit === 'C' && toUnit === 'F') converted = (value * 9) / 5 + 32;
      else if (fromUnit === 'F' && toUnit === 'C') converted = ((value - 32) * 5) / 9;
      else if (fromUnit === 'C' && toUnit === 'K') converted = value + 273.15;
      else if (fromUnit === 'K' && toUnit === 'C') converted = value - 273.15;
      else if (fromUnit === 'F' && toUnit === 'K') converted = ((value - 32) * 5) / 9 + 273.15;
      else if (fromUnit === 'K' && toUnit === 'F') converted = ((value - 273.15) * 9) / 5 + 32;
      else converted = value;
    } else {
      converted = (value * conversionData[category][fromUnit]) / conversionData[category][toUnit];
    }

    const formatted = Number.isInteger(converted)
      ? converted.toString()
      : converted.toPrecision(8).replace(/\.?0+$/, '');

    setResult(formatted);
    setChain(`${inputValue} ${fromUnit} = ${formatted} ${toUnit}`);
  };

  return (
    <section id="converter" className="py-16 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            <Settings2 size={24} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Unit Converter</h1>
        </div>

        <p className="mb-8 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Use this unit converter online for length, weight, temperature, speed, pressure, storage, and more with instant results and clean mobile-friendly inputs.
        </p>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <label className="mb-6 block">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">From</span>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  {Object.keys(conversionData[category]).map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </label>

              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-2xl font-mono text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                placeholder="0"
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  setFromUnit(toUnit);
                  setToUnit(fromUnit);
                }}
                className="rounded-full bg-indigo-50 p-4 text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                aria-label="Swap units"
              >
                <ArrowRightLeft size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">To</span>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  {Object.keys(conversionData[category]).map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-800/40 dark:bg-indigo-900/30">
                <div className="text-sm text-slate-600 dark:text-slate-400">Converted Result</div>
                <div className="mt-1 overflow-x-auto text-3xl font-bold text-indigo-700 dark:text-indigo-400">{result || '0'}</div>
                <div className="mt-3">
                  <CopyResultButton value={chain || `${inputValue} ${fromUnit} = ${result || '0'} ${toUnit}`} />
                </div>
              </div>
            </div>
          </div>

          {chain && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-mono text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
              {chain}
            </div>
          )}
        </div>

        {content && <SEOBlock content={content} />}
      </div>
    </section>
  );
}
