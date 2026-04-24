import React from 'react';

export function AboutUs() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">About Us</h1>
      <div className="prose dark:prose-invert text-slate-600 dark:text-slate-300 space-y-4">
        <p>Welcome to Vision Tools, your all-in-one platform for precise calculations and comprehensive unit conversions.</p>
        <p>Our mission is to simplify complex mathematical and everyday calculations by providing a clean, fast, and accessible tool for everyone—from students and professionals to everyday users.</p>
        <p>We aim to make math more intuitive and accessible through our collection of powerful calculators and converters.</p>
      </div>
    </div>
  );
}

export function TermsConditions() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Terms & Conditions</h1>
      <div className="prose dark:prose-invert text-slate-600 dark:text-slate-300 space-y-4">
        <p>By accessing and using Vision Tools, you accept and agree to be bound by the terms and provision of this agreement.</p>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-6">Use of Service</h2>
        <p>Our tools are provided "as is" for informational and educational purposes. While we strive for accuracy, we do not guarantee the absolute correctness of any calculation or conversion.</p>
      </div>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Privacy Policy</h1>
      <div className="prose dark:prose-invert text-slate-600 dark:text-slate-300 space-y-4">
        <p>Your privacy is important to us. This policy explains how we handle your data when you use Vision Tools.</p>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-6">Data Collection</h2>
        <p>We do not require user accounts or authentication. We do not log any user queries or activities.</p>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-6">Cookies and Ads</h2>
        <p>We use third-party advertising partners (like Google AdSense) who may use cookies to serve ads based on your prior visits to our website or other websites.</p>
      </div>
    </div>
  );
}
