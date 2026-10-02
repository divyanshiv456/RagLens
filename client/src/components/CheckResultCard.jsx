import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, FileSearch, HelpCircle, ShieldCheck, Bookmark } from 'lucide-react';

export default function CheckResultCard({ check = {} }) {
  const { name, status, score = 0, explanation } = check;

  let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
  let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let barColor = 'bg-emerald-500';
  let cardBorder = 'border-slate-200';
  let statusEmoji = '🟢';

  if (status === 'Passed') {
    statusEmoji = '🟢';
    badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    barColor = 'bg-emerald-500';
  } else if (status === 'Warning') {
    statusEmoji = '🟡';
    icon = <AlertTriangle className="w-5 h-5 text-amber-600" />;
    badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
    barColor = 'bg-amber-500';
    cardBorder = 'border-amber-200';
  } else {
    statusEmoji = '🔴';
    icon = <XCircle className="w-5 h-5 text-rose-600" />;
    badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
    barColor = 'bg-rose-500';
    cardBorder = 'border-rose-200';
  }

  const getHeaderIcon = (checkName) => {
    switch (checkName) {
      case 'Retrieval Check': return <FileSearch className="w-4 h-4 text-sky-600" />;
      case 'Context Relevance Check': return <HelpCircle className="w-4 h-4 text-indigo-600" />;
      case 'Groundedness Check': return <ShieldCheck className="w-4 h-4 text-teal-600" />;
      case 'Evidence / Citation Check': return <Bookmark className="w-4 h-4 text-purple-600" />;
      default: return null;
    }
  };

  return (
    <div className={`bg-white rounded-xl border ${cardBorder} p-4 shadow-2xs hover:shadow-xs transition-shadow`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getHeaderIcon(name)}
          <h4 className="font-bold text-slate-800 text-sm tracking-tight">{name}</h4>
        </div>
        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeClass}`}>
          <span>{statusEmoji}</span>
          <span>{status}</span>
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
          <span>Check Score</span>
          <span className="font-semibold text-slate-700">{score} / 25 pts</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${barColor} transition-all duration-500`}
            style={{ width: `${(score / 25) * 100}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
        {explanation || 'No detailed explanation provided.'}
      </p>
    </div>
  );
}
