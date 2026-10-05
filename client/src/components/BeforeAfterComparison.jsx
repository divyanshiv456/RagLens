import React from 'react';
import { ArrowUpRight, CheckCircle2, XCircle, AlertTriangle, Sparkles, TrendingUp } from 'lucide-react';

export default function BeforeAfterComparison({ beforeDiagnosis = {}, afterDiagnosis = {}, appliedFix = '' }) {
  const beforeScore = beforeDiagnosis.healthScore || 46;
  const afterScore = afterDiagnosis.healthScore || 89;
  const improvement = afterScore - beforeScore;

  const renderStatusIcon = (status) => {
    if (status === 'Passed') return <span className="text-emerald-600 font-black text-base">✅</span>;
    if (status === 'Warning') return <span className="text-amber-500 font-black text-base">⚠️</span>;
    return <span className="text-rose-600 font-black text-base">❌</span>;
  };

  const checksBefore = beforeDiagnosis.checks || {};
  const checksAfter = afterDiagnosis.checks || {};

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6">
      
      {/* Header Banner with Net Improvement Highlight */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-lg tracking-tight">RAG REPAIR COMPARISON RESULT</h3>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Applied Fix: <span className="text-sky-300 font-semibold">{appliedFix || 'Increase Top-K parameter from 2 to 5'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-emerald-500/20 px-4 py-2.5 rounded-xl border border-emerald-500/30 text-emerald-300 shrink-0">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">Score Improvement</span>
            <span className="text-2xl font-black text-white">
              +{improvement > 0 ? improvement : 0} points
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Before vs After Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* BEFORE Column */}
        <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-rose-200 pb-3">
            <span className="font-black text-xs uppercase tracking-widest text-rose-800">BEFORE FIX</span>
            <span className="text-xl font-black text-rose-700">{beforeScore}/100</span>
          </div>

          {/* Score Progress Bar */}
          <div>
            <div className="flex justify-between text-xs text-rose-800 font-bold mb-1">
              <span>Health Score</span>
              <span>{beforeScore}%</span>
            </div>
            <div className="w-full bg-rose-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, beforeScore))}%` }}
              />
            </div>
          </div>

          {/* Checks Matrix */}
          <div className="space-y-2.5 text-xs font-semibold text-slate-700 bg-white p-3.5 rounded-lg border border-rose-200/80">
            <div className="flex items-center justify-between">
              <span>Retrieval Check:</span>
              {renderStatusIcon(checksBefore.retrieval?.status || 'Failed')}
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-2">
              <span>Context Relevance:</span>
              {renderStatusIcon(checksBefore.relevance?.status || 'Failed')}
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-2">
              <span>Groundedness Check:</span>
              {renderStatusIcon(checksBefore.groundedness?.status || 'Warning')}
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-2">
              <span>Evidence Citation:</span>
              {renderStatusIcon(checksBefore.evidence?.status || 'Failed')}
            </div>
          </div>
        </div>

        {/* AFTER Column */}
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
            <span className="font-black text-xs uppercase tracking-widest text-emerald-800">AFTER FIX</span>
            <span className="text-xl font-black text-emerald-700">{afterScore}/100</span>
          </div>

          {/* Score Progress Bar */}
          <div>
            <div className="flex justify-between text-xs text-emerald-800 font-bold mb-1">
              <span>Health Score</span>
              <span>{afterScore}%</span>
            </div>
            <div className="w-full bg-emerald-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, afterScore))}%` }}
              />
            </div>
          </div>

          {/* Checks Matrix */}
          <div className="space-y-2.5 text-xs font-semibold text-slate-700 bg-white p-3.5 rounded-lg border border-emerald-200/80">
            <div className="flex items-center justify-between">
              <span>Retrieval Check:</span>
              {renderStatusIcon(checksAfter.retrieval?.status || 'Passed')}
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-2">
              <span>Context Relevance:</span>
              {renderStatusIcon(checksAfter.relevance?.status || 'Passed')}
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-2">
              <span>Groundedness Check:</span>
              {renderStatusIcon(checksAfter.groundedness?.status || 'Passed')}
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-2">
              <span>Evidence Citation:</span>
              {renderStatusIcon(checksAfter.evidence?.status || 'Passed')}
            </div>
          </div>
        </div>

      </div>

      {/* Final Outcome Banner */}
      <div className="bg-emerald-100 text-emerald-900 p-4 rounded-xl border border-emerald-300 text-xs font-bold text-center">
        🎉 Your RAG pipeline improved by +{improvement > 0 ? improvement : 0} points after applying the suggested fix.
      </div>
    </div>
  );
}
