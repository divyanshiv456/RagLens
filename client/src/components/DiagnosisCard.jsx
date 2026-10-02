import React from 'react';
import HealthScoreBadge from './HealthScoreBadge';
import CheckResultCard from './CheckResultCard';
import { Lightbulb, FileText, AlertOctagon, CheckCircle2, Bookmark, ExternalLink } from 'lucide-react';
export default function DiagnosisCard({ diagnosis = {} }) {
  const {
    question,
    generatedAnswer,
    healthScore = 0,
    healthStatus = 'Healthy',
    primaryProblem = 'None - Pipeline Healthy',
    checks = {},
    evidence = {},
    suggestedFixes = [],
    retrievedChunks = []
  } = diagnosis;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden mb-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🩺</span>
              <h2 className="text-xl font-extrabold tracking-tight">RAG DIAGNOSIS REPORT</h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Question: <span className="text-sky-300 font-sans font-medium">"{question}"</span>
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Primary Diagnosis</span>
              <span className={`text-sm font-bold ${
                primaryProblem.includes('Healthy') ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {primaryProblem}
              </span>
            </div>
            <HealthScoreBadge score={healthScore} status={healthStatus} size="small" />
          </div>

        </div>
      </div>

      {/* Diagnosis Content Body */}
      <div className="p-5 sm:p-6 space-y-6">

        {/* 1. Generated AI Answer Section */}
        <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-sky-900">
              <span className="text-lg">🤖</span>
              <h3 className="font-bold text-sm">Generated AI Answer</h3>
            </div>
            <span className="text-[11px] font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
              RAG Pipeline Output
            </span>
          </div>
          <p className="text-slate-800 text-sm leading-relaxed font-medium">
            "{generatedAnswer}"
          </p>

          {/* Evidence snippet if available */}
          {evidence && evidence.hasEvidence && (
            <div className="mt-3 pt-3 border-t border-sky-200/60 flex items-start space-x-2 text-xs text-sky-800">
              <Bookmark className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Supporting Citation: </span>
                <span>📄 {evidence.docName} (Page {evidence.pageNumber}, Chunk {evidence.chunkId})</span>
                <p className="italic text-sky-950 mt-1 bg-white/80 p-2 rounded border border-sky-200/80 font-mono text-[11px]">
                  "{evidence.snippet}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 2. Diagnostic Checks 4-Grid */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
            <span>🔎</span>
            <span>Diagnostic Checks Breakdown</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checks.retrieval && <CheckResultCard check={checks.retrieval} />}
            {checks.relevance && <CheckResultCard check={checks.relevance} />}
            {checks.groundedness && <CheckResultCard check={checks.groundedness} />}
            {checks.evidence && <CheckResultCard check={checks.evidence} />}
          </div>
        </div>

        {/* 3. Retrieved Chunks Table / Inspector */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Retrieved Chunks Inspection ({retrievedChunks.length})</span>
            </span>
          </h3>

          {retrievedChunks.length === 0 ? (
            <div className="p-4 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
              ❌ No chunks retrieved from document repository.
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {retrievedChunks.map((chunk, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                  <div className="flex items-center justify-between mb-1.5 font-mono">
                    <span className="font-bold text-slate-700">
                      📄 {chunk.docName} (Chunk #{chunk.chunkIndex + 1})
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500">Score: {(chunk.similarityScore * 100).toFixed(0)}%</span>
                      <span className="font-semibold">{chunk.status}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 line-clamp-2 bg-white p-2 rounded border border-slate-100 italic">
                    "{chunk.content}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Suggested Fixes Recommendation Card */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2 text-amber-900">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-sm">Suggested Fixes & Actionable Recommendations</h3>
          </div>
          <ul className="space-y-1.5 text-xs text-amber-950 font-medium pl-1">
            {suggestedFixes.map((fix, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>{fix}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
