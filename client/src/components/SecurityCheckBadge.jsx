import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function SecurityCheckBadge({ securityCheck = {} }) {
  const {
    isSafe = true,
    detectedTriggers = [],
    warningMessage = 'No prompt injection vectors detected.'
  } = securityCheck;

  return (
    <div className={`p-4 rounded-xl border text-xs transition-all ${
      isSafe
        ? 'bg-slate-900 text-slate-200 border-slate-800'
        : 'bg-rose-950 text-rose-100 border-rose-700 shadow-md animate-pulse'
    }`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center space-x-2">
          {isSafe ? (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          )}
          <span className="font-extrabold uppercase tracking-wider text-xs">
            RAG SECURITY DOCTOR
          </span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
          isSafe
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            : 'bg-rose-500/30 text-rose-200 border border-rose-400/40'
        }`}>
          {isSafe ? '🟢 SAFE' : '🛡️ SECURITY WARNING'}
        </span>
      </div>

      <p className="font-medium text-xs leading-relaxed">
        {warningMessage}
      </p>

      {!isSafe && detectedTriggers.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-rose-800/60 text-[11px]">
          <span className="font-bold text-rose-300">Flagged Injection Phrases: </span>
          <span className="font-mono text-rose-200">{detectedTriggers.join(', ')}</span>
        </div>
      )}

      <p className="mt-2 text-[10px] text-slate-400 italic">
        * Basic RAG security scanner for prompt injection detection.
      </p>
    </div>
  );
}
