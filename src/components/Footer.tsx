import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 transition-colors duration-200 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <Link to="/" className="flex items-center gap-2 mb-6 cursor-pointer">
          <div className="bg-indigo-600 text-white p-1.5 rounded-xl">
            <Calculator size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Vision <span className="text-indigo-400">AI</span> Tools
          </span>
        </Link>
        
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <Link to="/about" className="text-sm hover:text-white transition-colors duration-200 relative group">
            About Us
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-400 transform origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
          </Link>
          <Link to="/terms" className="text-sm hover:text-white transition-colors duration-200 relative group">
            Terms & Conditions
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-400 transform origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
          </Link>
          <Link to="/privacy" className="text-sm hover:text-white transition-colors duration-200 relative group">
            Privacy Policy
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-400 transform origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
          </Link>
        </div>
        
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Vision AI Tools. All rights reserved.
        </p>
      </div>
    </footer>
  );
}


