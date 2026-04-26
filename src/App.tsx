import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { AdPlaceholder } from './components/AdPlaceholder';
import { AboutUs, TermsConditions, PrivacyPolicy } from './components/LegalPages';
import { updateSEO } from './lib/seo';
import { ADS_ENABLED } from './config';

// Lazy load heavy components
const PercentageCalculator = React.lazy(() => import('./components/PercentageCalculator').then(m => ({ default: m.PercentageCalculator })));
const UnitConverter = React.lazy(() => import('./components/UnitConverter').then(m => ({ default: m.UnitConverter })));
const ScientificCalculator = React.lazy(() => import('./components/ScientificCalculator').then(m => ({ default: m.ScientificCalculator })));

const AgeCalculator = React.lazy(() => import('./components/AgeCalculator').then(m => ({ default: m.AgeCalculator })));
const LoanCalculator = React.lazy(() => import('./components/LoanCalculator').then(m => ({ default: m.LoanCalculator })));
const InterestCalculator = React.lazy(() => import('./components/InterestCalculator').then(m => ({ default: m.InterestCalculator })));
const TypingTest = React.lazy(() => import('./components/TypingTest').then(m => ({ default: m.TypingTest })));
const WordCounter = React.lazy(() => import('./components/WordCounter').then(m => ({ default: m.WordCounter })));

export default function App() {
  const location = useLocation();
  const gaId = import.meta.env.VITE_GA_ID;

  useEffect(() => {
    if (!gaId || typeof window === 'undefined') return;

    if (!(window as any).gtag) {
      const existingScript = document.querySelector(`script[data-ga="${gaId}"]`);
      if (!existingScript) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        script.dataset.ga = gaId;
        document.head.appendChild(script);
      }

      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function gtag(...args: unknown[]) {
        (window as any).dataLayer.push(args);
      };
      (window as any).gtag('js', new Date());
    }
  }, [gaId]);

  useEffect(() => {
    // Map pathnames to SEO keys
    const pathMap: Record<string, string> = {
      '/': 'home',
      '/percentage': 'percentage',
      '/converter': 'converter',
      '/scientific': 'scientific',
      '/age': 'age',
      '/loan': 'loan',
      '/interest': 'interest',
      '/typing-test': 'typing',
      '/word-counter': 'word-counter',
      '/about': 'about',
      '/terms': 'terms',
      '/privacy': 'privacy'
    };

    const pageKey = pathMap[location.pathname] || 'home';
    updateSEO(pageKey);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Track page view in GA
    if (typeof window !== 'undefined' && gaId && (window as any).gtag) {
      (window as any).gtag('config', gaId, {
        page_path: location.pathname + location.search
      });
    }
  }, [gaId, location]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 ease-in-out flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex flex-col">
        {ADS_ENABLED && (
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-4">
            <AdPlaceholder className="h-24" text="Top Banner Advertisement" />
          </div>
        )}

        <div className="flex-grow animate-in fade-in duration-500">
          <Suspense fallback={<div className="py-16 text-center">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Hero />} />
              
              {/* Tools */}
              <Route path="/percentage" element={<PercentageCalculator />} />
              <Route path="/converter" element={<UnitConverter />} />
              <Route path="/scientific" element={<ScientificCalculator />} />
              <Route path="/age" element={<AgeCalculator />} />
              <Route path="/loan" element={<LoanCalculator />} />
              <Route path="/interest" element={<InterestCalculator />} />
              <Route path="/typing-test" element={<TypingTest initialLanguage="en" />} />
              <Route path="/word-counter" element={<WordCounter />} />
              
              <Route path="/about" element={<AboutUs />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              
              {/* Fallback route */}
              <Route path="*" element={<Hero />} />
            </Routes>
          </Suspense>
        </div>
      </main>

      {ADS_ENABLED && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-4">
          <AdPlaceholder className="h-24" text="Footer Advertisement" />
        </div>
      )}

      <Footer />
    </div>
  );
}

