import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Wrench } from 'lucide-react';

export default function SmartSummary({ summary = {}, healthScore = 0, healthStatus = 'Healthy', primaryProblem = '' }) {
  const {
    headline = 'RAG Pipeline Operating',
    explanation = 'Document retrieval and answer generation evaluated.',
    severity = '🟢 Low',
    recommendedAction = 'Maintain current index settings.'
  } = summary;

  const isFailed = healthScore < 70 || healthStatus === 'Critical' || healthStatus === 'Problem Detected';

  return (
    <div className={`rounded-2xl p-5 sm:p-6 border shadow-sm transition-all ${
      isFailed
        ? 'bg-gradient-to-r from-rose-900/90 via-slate-900 to-slate-900 text-white border-rose-800'
        : 'bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 text-white border-slate-800'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl ${isFailed ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'}`}>
            <span className="text-2xl select-none">🩺</span>
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              RAG Doctor Plain-English Summary
            </span>
            <h2 className="text-lg font-black tracking-tight text-white mt-0.5">
              {headline}
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10 shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">Health Score</span>
            <span className={`text-xl font-black ${healthScore >= 90 ? 'text-emerald-400' : (healthScore >= 70 ? 'text-amber-300' : 'text-rose-400')}`}>
              {healthScore}/100
            </span>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-black/30 border border-white/10">
            {severity}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="md:col-span-2 space-y-1">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Diagnosis Details</span>
          <p className="text-slate-200 leading-relaxed text-sm font-medium">
            {explanation}
          </p>
        </div>

        <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 flex flex-col justify-between">
          <div>
            <span className="font-bold text-sky-300 uppercase tracking-wider text-[10px] flex items-center space-x-1">
              <Wrench className="w-3.5 h-3.5" />
              <span>Recommended Action</span>
            </span>
            <p className="text-white font-semibold mt-1 text-xs leading-snug">
              {recommendedAction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
