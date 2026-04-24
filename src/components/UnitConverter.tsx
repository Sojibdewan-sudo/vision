import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Settings2 } from 'lucide-react';
import { SEOBlock } from './SEOBlock';

const conversionData: Record<string, Record<string, number>> = {
  Length: {
    km: 1000,
    m: 1,
    cm: 0.01,
    mm: 0.001,
    mi: 1609.34,
    yd: 0.9144,
    ft: 0.3048,
    in: 0.0254,
  },
  Area: {
    'sq km': 1000000,
    'sq m': 1,
    'sq cm': 0.0001,
    'sq mm': 0.000001,
    ha: 10000,
    acre: 4046.86,
    'sq mi': 2589988.11,
    'sq yd': 0.836127,
    'sq ft': 0.092903,
    'sq in': 0.00064516,
  },
  Volume: {
    'cu m': 1,
    'cu cm': 0.000001,
    L: 0.001,
    mL: 0.000001,
    gal: 0.00378541,
    qt: 0.000946353,
    pt: 0.000473176,
    cup: 0.000236588,
    'fl oz': 0.0000295735,
  },
  Mass: {
    t: 1000,
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.453592,
    oz: 0.0283495,
  },
  Time: {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hr: 3600,
    min: 60,
    s: 1,
    ms: 0.001,
  },
  Temperature: {
    C: 1,
    F: 1,
    K: 1,
  },
  Speed: {
    'm/s': 1,
    'km/h': 0.277778,
    mph: 0.44704,
    knot: 0.514444,
  },
  Pressure: {
    Pa: 1,
    kPa: 1000,
    bar: 100000,
    psi: 6894.76,
    atm: 101325,
  },
  Energy: {
    J: 1,
    kJ: 1000,
    cal: 4.184,
    kcal: 4184,
    Wh: 3600,
    kWh: 3600000,
  },
  Power: {
    W: 1,
    kW: 1000,
    hp: 745.7,
  },
  Voltage: {
    V: 1,
    kV: 1000,
    mV: 0.001,
  },
  Density: {
    'kg/m³': 1,
    'g/cm³': 1000,
    'lb/ft³': 16.0185,
  },
  'Data Storage': {
    B: 1,
    KB: 1024,
    MB: 1048576,
    GB: 1073741824,
    TB: 1099511627776,
    PB: 1125899906842624,
  },
};

export function UnitConverter() {
  const categories = Object.keys(conversionData);
  const [category, setCategory] = useState(categories[0]);
  const [fromUnit, setFromUnit] = useState(Object.keys(conversionData[categories[0]])[0]);
  const [toUnit, setToUnit] = useState(Object.keys(conversionData[categories[0]])[1]);
  const [inputValue, setInputValue] = useState('1');
  const [result, setResult] = useState('');
  const [chain, setChain] = useState('');

  useEffect(() => {
    const units = Object.keys(conversionData[category]);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  }, [category]);

  useEffect(() => {
    calculate();
  }, [inputValue, fromUnit, toUnit, category]);

  const calculate = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      setResult('');
      setChain('');
      return;
    }

    const val = parseFloat(inputValue);
    let res = 0;

    if (category === 'Temperature') {
      if (fromUnit === 'C' && toUnit === 'F') res = (val * 9) / 5 + 32;
      else if (fromUnit === 'F' && toUnit === 'C') res = ((val - 32) * 5) / 9;
      else if (fromUnit === 'C' && toUnit === 'K') res = val + 273.15;
      else if (fromUnit === 'K' && toUnit === 'C') res = val - 273.15;
      else if (fromUnit === 'F' && toUnit === 'K') res = ((val - 32) * 5) / 9 + 273.15;
      else if (fromUnit === 'K' && toUnit === 'F') res = ((val - 273.15) * 9) / 5 + 32;
      else res = val;
    } else {
      const fromFactor = conversionData[category][fromUnit];
      const toFactor = conversionData[category][toUnit];
      // Convert to base unit, then to target unit
      const baseValue = val * fromFactor;
      res = baseValue / toFactor;
    }

    // Format result
    const formattedRes = Number.isInteger(res) ? res.toString() : res.toPrecision(7).replace(/\.?0+$/, '');
    setResult(formattedRes);

    // Generate chain
    if (category !== 'Temperature') {
      const units = Object.keys(conversionData[category]);
      const fromIdx = units.indexOf(fromUnit);
      const toIdx = units.indexOf(toUnit);
      
      if (fromIdx !== -1 && toIdx !== -1) {
        const stepUnits = [];
        const start = Math.min(fromIdx, toIdx);
        const end = Math.max(fromIdx, toIdx);
        
        for (let i = start; i <= end; i++) {
            stepUnits.push(units[i]);
        }
        
        if (fromIdx > toIdx) {
            stepUnits.reverse();
        }

        const chainStr = `${inputValue} ${fromUnit} → ${stepUnits.slice(1, -1).join(' → ')}${stepUnits.length > 2 ? ' → ' : ''}${toUnit}`;
        setChain(`${chainStr}\n${inputValue} ${fromUnit} = ${formattedRes} ${toUnit}`);
      } else {
          setChain(`${inputValue} ${fromUnit} = ${formattedRes} ${toUnit}`);
      }
    } else {
        setChain(`${inputValue} ${fromUnit} = ${formattedRes} ${toUnit}`);
    }
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <section id="converter" className="py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Settings2 size={24} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Unit Converter</h1>
        </div>
        
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-3xl">
          Instantly convert between hundreds of units of measurement with our free online Unit Converter. Support for length, weight, temperature, volume, area, speed, time, and more. Perfect for students, engineers, and everyday use.
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 p-6 sm:p-8 transition-all duration-200">
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
            {/* From */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">From</label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                >
                  {Object.keys(conversionData[category]).map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-2xl font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                placeholder="0.00"
              />
            </div>

            {/* Swap Button */}
            <div className="flex justify-center mt-6 md:mt-0 relative group">
              <button
                onClick={handleSwap}
                className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                aria-label="Swap units"
              >
                <ArrowRightLeft size={24} />
              </button>
              
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-md">
                Swap units
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 dark:border-t-slate-700"></div>
              </div>
            </div>

            {/* To */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">To</label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                >
                  {Object.keys(conversionData[category]).map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 min-h-[60px] flex items-center overflow-x-auto">
                <span className="text-2xl font-mono text-slate-900 dark:text-white whitespace-nowrap">
                  {result || '0'}
                </span>
              </div>
            </div>
          </div>

          {/* Chain Output */}
          {chain && (
            <div className="mt-8 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
              <p className="text-sm font-mono text-indigo-800 dark:text-indigo-300 whitespace-pre-line">
                {chain}
              </p>
            </div>
          )}
        </div>

        <SEOBlock
          title="Unit Converter"
          description={[
            "Our online Unit Converter is a versatile tool designed to help you quickly and accurately convert between various units of measurement. Whether you're dealing with length, weight, temperature, or volume, this tool provides instant conversions without the need for complex formulas.",
            "It's an essential utility for students, professionals, and anyone who frequently works with different measurement systems, such as metric and imperial."
          ]}
          howToUse={[
            "Select the Category of measurement (e.g., Length, Mass, Temperature).",
            "Enter the Value you want to convert.",
            "Choose the unit you are converting From and the unit you are converting To.",
            "The result will be displayed instantly. You can also use the swap button to reverse the conversion."
          ]}
          formulas={[
            { title: "Temperature (C to F)", formula: "°F = (°C × 9/5) + 32" },
            { title: "Length (km to mi)", formula: "mi = km / 1.60934" }
          ]}
          examples={[
            { question: "Convert 100 Celsius to Fahrenheit", calculation: "(100 × 9/5) + 32 = 212 °F" },
            { question: "Convert 5 kilometers to miles", calculation: "5 / 1.60934 ≈ 3.1068 mi" }
          ]}
          benefits={[
            "Comprehensive: Covers all common measurement categories in one place.",
            "Instant Results: Conversions happen in real-time as you type.",
            "User-Friendly: Clean interface with an easy-to-use swap function.",
            "Accurate: Uses precise conversion factors for reliable results."
          ]}
          faq={[
            {
              question: "Which units are supported?",
              answer: "We currently support conversions for Length, Area, Volume, Mass, Time, Temperature, Speed, Pressure, Energy, Power, Voltage, Density, and Data Storage."
            },
            {
              question: "Is the conversion accurate for scientific use?",
              answer: "Yes, our converter uses standard, highly precise conversion factors suitable for most general and scientific applications."
            },
            {
              question: "Can I convert metric to imperial units?",
              answer: "Absolutely. The tool seamlessly converts between metric and imperial systems across all supported categories."
            }
          ]}
          relatedTools={[
            { name: "Scientific Calculator", link: "/scientific" },
            { name: "Percentage Calculator", link: "/percentage" }
          ]}
        />
      </div>
    </section>
  );
}
