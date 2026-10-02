import React from 'react';

export default function HealthScoreBadge({ score = 0, status = 'Healthy', size = 'normal' }) {
  let colorTheme = {
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    text: 'text-emerald-700',
    ring: 'text-emerald-500',
    icon: '🟢',
    badge: 'bg-emerald-100 text-emerald-800'
  };

  if (score >= 90 || status === 'Healthy') {
    colorTheme = {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      ring: 'stroke-emerald-500',
      icon: '🟢',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };
  } else if (score >= 70 || status === 'Needs Attention') {
    colorTheme = {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      ring: 'stroke-amber-500',
      icon: '🟡',
      badge: 'bg-amber-100 text-amber-800 border-amber-300'
    };
  } else if (score >= 40 || status === 'Problem Detected') {
    colorTheme = {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      ring: 'stroke-orange-500',
      icon: '🟠',
      badge: 'bg-orange-100 text-orange-800 border-orange-300'
    };
  } else {
    colorTheme = {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-700',
      ring: 'stroke-rose-500',
      icon: '🔴',
      badge: 'bg-rose-100 text-rose-800 border-rose-300'
    };
  }

  if (size === 'small') {
    return (
      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorTheme.badge}`}>
        <span>{colorTheme.icon}</span>
        <span>{score}/100</span>
        <span>({status})</span>
      </span>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border ${colorTheme.bg} ${colorTheme.border}`}>
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-slate-200"
            strokeWidth="3.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={`${colorTheme.ring} transition-all duration-1000 ease-out`}
            strokeDasharray={`${score}, 100`}
            strokeWidth="3.5"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-black ${colorTheme.text}`}>{score}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">/ 100</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold border ${colorTheme.badge}`}>
          {colorTheme.icon} {status}
        </span>
      </div>
    </div>
  );
}
