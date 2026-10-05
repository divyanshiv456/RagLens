import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Stethoscope, History, Wrench, Play, FlaskConical, Activity } from 'lucide-react';

export default function Navbar() {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/documents', label: 'Documents', icon: FileText },
    { to: '/test', label: 'Test RAG', icon: Stethoscope },
    { to: '/history', label: 'Diagnosis History', icon: History },
    { to: '/test-lab', label: 'RAG Test Lab', icon: FlaskConical },
    { to: '/repair', label: 'Repair Lab', icon: Wrench },
    { to: '/replay', label: 'Pipeline Replay', icon: Play },
    { to: '/performance', label: 'Performance', icon: Activity },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <NavLink to="/" className="flex items-center space-x-3 shrink-0">
            <div className="bg-sky-500/20 p-2 rounded-xl border border-sky-400/30 flex items-center justify-center">
              <span className="text-2xl select-none">🩺</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">RAG Doctor</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  v2.0 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Diagnostic, Repair & Monitoring Suite</p>
            </div>
          </NavLink>

          {/* Responsive Scrollable Navigation Links */}
          <nav className="flex space-x-1 sm:space-x-1.5 overflow-x-auto py-2 ml-4 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-sm shadow-sky-950'
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
        </div>
      </div>
    </header>
  );
}
