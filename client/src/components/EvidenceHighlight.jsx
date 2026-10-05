import React from 'react';
import { Bookmark, FileText, CheckCircle2, AlertTriangle, Quote } from 'lucide-react';

export default function EvidenceHighlight({ generatedAnswer = '', evidence = {} }) {
  const {
    docName,
    pageNumber = 1,
    chunkId,
    snippet,
    matchedSentence,
    hasEvidence = false
  } = evidence;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Bookmark className="w-5 h-5 text-sky-600" />
          <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
            EVIDENCE & SOURCE CITATION INSPECTOR
          </h3>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
          Stage 4 Verification
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Left: AI Answer */}
        <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">🤖</span>
              <span className="font-bold text-xs uppercase tracking-wider text-sky-900">Generated AI Answer</span>
            </div>
            <p className="text-slate-800 text-sm font-medium leading-relaxed bg-white p-3 rounded-lg border border-sky-200/70">
              "{generatedAnswer}"
            </p>
          </div>
          <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-sky-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
            <span>LLM Response Output</span>
          </div>
        </div>

        {/* Right: Source Evidence */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900">Source Evidence</span>
              </div>
              {hasEvidence && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  📄 {docName || 'Document'} (Page {pageNumber})
                </span>
              )}
            </div>

            {hasEvidence ? (
              <div className="space-y-2">
                <div className="bg-emerald-50/80 border border-emerald-200 p-3 rounded-lg text-xs">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                    Exact Supporting Sentence:
                  </span>
                  <p className="text-emerald-950 font-bold bg-white p-2 rounded border border-emerald-200 font-sans leading-relaxed">
                    "{matchedSentence || snippet || 'Matching citation confirmed in text.'}"
                  </p>
                </div>
                {snippet && (
                  <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded border border-slate-200 line-clamp-2">
                    Full Chunk Context: "{snippet}"
                  </p>
                )}
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs font-semibold flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>⚠️ No supporting evidence found in document repository.</span>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Chunk ID: {chunkId || 'N/A'}</span>
            <span>Citation Match: {hasEvidence ? '100% Verified' : 'Unverified'}</span>
          </div>

        </div>

      </div>
    </div>
  );
}
