import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calculator, Moon, Sun, Menu, X, ChevronDown } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const activePage = location.pathname;

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTestDropdownOpen, setIsTestDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const testDropdownRef = useRef<HTMLDivElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (testDropdownRef.current && !testDropdownRef.current.contains(event.target as Node)) {
        setIsTestDropdownOpen(false);
      }
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsTestDropdownOpen(false);
    setIsToolsDropdownOpen(false);
  };

  const testPages = ['/percentage', '/age', '/loan', '/typing-test'];

  return (
    <nav className="sticky top-0 z-50 w-full h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800 transition-all duration-200 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" onClick={closeMenus} className="flex items-center gap-2 flex-shrink-0 group">
            <div className="bg-indigo-600 text-white p-1.5 rounded-xl transition-transform duration-300 group-hover:scale-110">
              <Calculator size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              Vision Tools
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-6 lg:space-x-8">
            <NavLink to="/" activePage={activePage}>Home</NavLink>
            
            {/* Calculators Dropdown */}
            <div className="relative" ref={testDropdownRef}>
              <button
                onClick={() => setIsTestDropdownOpen(!isTestDropdownOpen)}
                className={`relative group flex items-center gap-1 text-sm font-medium transition-all duration-200 ease-in-out hover:scale-105 ${['/scientific', '/percentage', '/age', '/loan', '/interest'].includes(activePage) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'}`}
              >
                Calculators <ChevronDown size={16} className={`transition-transform duration-200 ${isTestDropdownOpen ? 'rotate-180' : ''}`} />
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 transform origin-left transition-transform duration-300 ease-out ${['/scientific', '/percentage', '/age', '/loan', '/interest'].includes(activePage) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </button>
              
              {isTestDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/scientific" onClick={closeMenus} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">Scientific Calculator</Link>
                  <Link to="/percentage" onClick={closeMenus} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">Percentage Calculator</Link>
                  <Link to="/age" onClick={closeMenus} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">Age Calculator</Link>
                  <Link to="/loan" onClick={closeMenus} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">Loan Calculator</Link>
                  <Link to="/interest" onClick={closeMenus} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">Interest Calculator</Link>
                </div>
              )}
            </div>

            {/* Tools Dropdown */}
            <div className="relative" ref={toolsDropdownRef}>
              <button
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className={`relative group flex items-center gap-1 text-sm font-medium transition-all duration-200 ease-in-out hover:scale-105 ${['/converter', '/word-counter', '/typing-test'].includes(activePage) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'}`}
              >
                Tools <ChevronDown size={16} className={`transition-transform duration-200 ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 transform origin-left transition-transform duration-300 ease-out ${['/converter', '/word-counter', '/typing-test'].includes(activePage) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </button>
              
              {isToolsDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/converter" onClick={closeMenus} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">Unit Converter</Link>
                  <Link to="/word-counter" onClick={closeMenus} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">Word Counter</Link>
                  <Link to="/typing-test" onClick={closeMenus} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">Typing Test</Link>
                </div>
              )}
            </div>
            
            <NavLink to="/about" activePage={activePage}>About</NavLink>
          </div>

          {/* Right side controls */}
          <div className="hidden md:flex items-center flex-shrink-0">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-12"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4 flex-shrink-0">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-12"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors duration-200 ease-in-out"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <MobileNavLink to="/" onClick={closeMenus} activePage={activePage}>Home</MobileNavLink>
            <MobileNavLink to="/scientific" onClick={closeMenus} activePage={activePage}>Scientific Calculator</MobileNavLink>
            <MobileNavLink to="/converter" onClick={closeMenus} activePage={activePage}>Unit Converter</MobileNavLink>
            <MobileNavLink to="/word-counter" onClick={closeMenus} activePage={activePage}>Word Counter</MobileNavLink>
            
            <div className="pt-2 pb-1">
              <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">More Tools</p>
            </div>
            <MobileNavLink to="/percentage" onClick={closeMenus} activePage={activePage}>Percentage Calculator</MobileNavLink>
            <MobileNavLink to="/age" onClick={closeMenus} activePage={activePage}>Age Calculator</MobileNavLink>
            <MobileNavLink to="/loan" onClick={closeMenus} activePage={activePage}>Loan Calculator</MobileNavLink>
            <MobileNavLink to="/interest" onClick={closeMenus} activePage={activePage}>Interest Calculator</MobileNavLink>
            <MobileNavLink to="/typing-test" onClick={closeMenus} activePage={activePage}>Typing Test</MobileNavLink>
            
            <MobileNavLink to="/about" onClick={closeMenus} activePage={activePage}>About</MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children, activePage }: { to: string, children: React.ReactNode, activePage: string }) {
  const isActive = activePage === to || (to !== '/' && activePage.startsWith(to));
  return (
    <Link
      to={to}
      className={`relative group text-sm font-medium transition-all duration-200 ease-in-out hover:scale-105 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'}`}
    >
      {children}
      <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 transform origin-left transition-transform duration-300 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
    </Link>
  );
}

function MobileNavLink({ to, onClick, children, activePage }: { to: string, onClick: () => void, children: React.ReactNode, activePage: string }) {
  const isActive = activePage === to || (to !== '/' && activePage.startsWith(to));
  return (
    <Link 
      to={to} 
      onClick={onClick} 
      className={`block w-full text-left px-3 py-2 rounded-xl text-base font-medium transition-colors duration-200 ${isActive ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-200 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
    >
      {children}
    </Link>
  );
}


