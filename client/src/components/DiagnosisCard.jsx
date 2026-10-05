import React from 'react';
import HealthScoreBadge from './HealthScoreBadge';
import CheckResultCard from './CheckResultCard';
import SmartSummary from './SmartSummary';
import RecommendedFix from './RecommendedFix';
import EvidenceHighlight from './EvidenceHighlight';
import SecurityCheckBadge from './SecurityCheckBadge';
import ExportReportButton from './ExportReportButton';
import { Lightbulb, FileText, Bookmark, ExternalLink } from 'lucide-react';

export default function DiagnosisCard({ diagnosis = {} }) {
  const {
    _id,
    question,
    generatedAnswer,
    healthScore = 0,
    healthStatus = 'Healthy',
    primaryProblem = 'None - Pipeline Healthy',
    checks = {},
    evidence = {},
    securityCheck = {},
    summary = {},
    suggestedFixes = [],
    retrievedChunks = []
  } = diagnosis;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. FEATURE 9 — Smart Diagnosis Plain-English Summary */}
      {summary && summary.headline && (
        <SmartSummary
          summary={summary}
          healthScore={healthScore}
          healthStatus={healthStatus}
          primaryProblem={primaryProblem}
        />
      )}

      {/* Main Report Container */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-slate-900/90 text-white p-5 sm:p-6 border-b border-slate-800">
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

            <div className="flex items-center space-x-3">
              {/* Download Report Button */}
              <ExportReportButton diagnosisId={_id} />
              <HealthScoreBadge score={healthScore} status={healthStatus} size="small" />
            </div>

          </div>
        </div>

        {/* Diagnosis Body */}
        <div className="p-5 sm:p-6 space-y-6">

          {/* 2. FEATURE 7 — Basic RAG Security Doctor Check */}
          {securityCheck && (
            <SecurityCheckBadge securityCheck={securityCheck} />
          )}

          {/* 3. FEATURE 6 — Evidence Highlighting Inspector */}
          <EvidenceHighlight
            generatedAnswer={generatedAnswer}
            evidence={evidence}
          />

          {/* 4. Diagnostic Checks 4-Grid */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
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

          {/* 5. Retrieved Chunks Table / Inspector */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Retrieved Chunks Inspection ({retrievedChunks.length})</span>
              </span>
            </h3>

            {retrievedChunks.length === 0 ? (
              <div className="p-4 bg-rose-500/10 text-rose-300 text-xs rounded-xl border border-rose-500/20">
                ❌ No chunks retrieved from document repository.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {retrievedChunks.map((chunk, idx) => (
                  <div key={idx} className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-xs">
                    <div className="flex items-center justify-between mb-1.5 font-mono">
                      <span className="font-bold text-slate-300">
                        📄 {chunk.docName} (Chunk #{chunk.chunkIndex + 1})
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400">Score: {(chunk.similarityScore * 100).toFixed(0)}%</span>
                        <span className="font-semibold text-emerald-400">{chunk.status}</span>
                      </div>
                    </div>
                    <p className="text-slate-300 line-clamp-2 bg-slate-900 p-2 rounded border border-slate-800/80 italic font-mono text-[11px]">
                      "{chunk.content}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 6. Recommended Fix Component */}
          <RecommendedFix diagnosis={diagnosis} />

        </div>
      </div>
    </div>
  );
}
