import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { LayoutDashboard, FileText, Stethoscope, History, Wrench, Play, FlaskConical, Activity, Sun, Moon, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/documents', label: 'Documents', icon: FileText },
    { to: '/test', label: 'Test RAG', icon: Stethoscope },
    { to: '/history', label: 'Diagnosis', icon: History },
    { to: '/test-lab', label: 'Test Lab', icon: FlaskConical },
    { to: '/repair', label: 'Repair Lab', icon: Wrench },
    { to: '/replay', label: 'Replay', icon: Play },
    { to: '/performance', label: 'Performance', icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/90 dark:bg-slate-950/90 border-b border-slate-800/80 text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Pulse Glow */}
          <NavLink to="/" className="flex items-center space-x-3 shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-sky-500/30 blur-sm group-hover:blur-md transition-all animate-pulse" />
              <div className="relative bg-slate-900 dark:bg-slate-900 p-2 rounded-xl border border-sky-400/30 flex items-center justify-center">
                <span className="text-xl select-none group-hover:scale-110 transition-transform">🩺</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg tracking-tight text-white dark:text-white">RAG Doctor</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  v2.0 Pro
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block font-medium">Diagnostic & Debugging Suite</p>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-900/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Controls: Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-3">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-sky-400" />
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Responsive Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-1 animate-fadeUp">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
}
