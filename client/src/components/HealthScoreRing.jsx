import React, { useEffect, useState } from 'react';

export default function HealthScoreRing({ score = 0, status = 'Healthy', size = 'normal' }) {
  const [displayScore, setDisplayScore] = useState(0);

  // Counter animation from 0 to score
  useEffect(() => {
    let start = 0;
    const end = Math.min(100, Math.max(0, Number(score) || 0));
    if (end === 0) {
      setDisplayScore(0);
      return;
    }
    const duration = 1000;
    const stepTime = Math.max(10, Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;
      setDisplayScore(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Color schemes
  let strokeColor = '#10b981'; // Green
  let glowColor = 'shadow-emerald-500/30';
  let badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

  if (score < 40 || status === 'Critical') {
    strokeColor = '#f43f5e'; // Red
    glowColor = 'shadow-rose-500/30';
    badgeStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  } else if (score < 70 || status === 'Problem Detected' || status === 'Needs Attention') {
    strokeColor = '#f59e0b'; // Yellow/Amber
    glowColor = 'shadow-amber-500/30';
    badgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  }

  const radius = size === 'small' ? 28 : 45;
  const strokeWidth = size === 'small' ? 5 : 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  const svgSize = size === 'small' ? 70 : 110;

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className={`relative flex items-center justify-center rounded-full p-2 ${glowColor} shadow-lg transition-all`}>
        <svg width={svgSize} height={svgSize} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-800"
            fill="transparent"
          />
          {/* Progress ring stroke */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-black tracking-tight ${size === 'small' ? 'text-lg' : 'text-3xl'} text-slate-900 dark:text-white`}>
            {displayScore}
          </span>
          <span className="text-[9px] font-bold text-slate-400 -mt-1 uppercase">/100</span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-2.5">
        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold border transition-all ${badgeStyle}`}>
          <span>{score >= 90 ? '🟢' : (score >= 70 ? '🟡' : '🔴')}</span>
          <span>{status}</span>
        </span>
      </div>
    </div>
  );
}
