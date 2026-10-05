import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, CheckCircle2, ArrowRight, AlertTriangle, Lightbulb } from 'lucide-react';

export default function RecommendedFix({ diagnosis = {}, onTryFix }) {
  const navigate = useNavigate();
  const {
    question = '',
    primaryProblem = '',
    checks = {},
    simulationFlags = {}
  } = diagnosis;

  const currentTopK = simulationFlags.topK || 2;
  const isRetrievalFail = primaryProblem.includes('Retrieval') || checks.retrieval?.status === 'Failed';
  const isContextFail = primaryProblem.includes('Context') || checks.relevance?.status === 'Failed';
  const isGroundingFail = primaryProblem.includes('Hallucination') || primaryProblem.includes('Grounding') || checks.groundedness?.status === 'Failed';
  const isEvidenceFail = primaryProblem.includes('Evidence') || primaryProblem.includes('Citation') || checks.evidence?.status === 'Failed';

  const handleApplyFix = () => {
    if (onTryFix) {
      onTryFix({
        question,
        newTopK: 5,
        appliedFixName: "Increase Top-K to 5 & Restore Document Retrieval"
      });
    } else {
      navigate('/repair', {
        state: {
          question,
          initialTopK: currentTopK,
          suggestedTopK: 5,
          forceFailure: false
        }
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50/40 to-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-200/80">
        <div className="flex items-center space-x-2.5 text-amber-900">
          <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base tracking-tight">RECOMMENDED FIX</h3>
            <p className="text-xs text-amber-700">RAG Doctor automated solution strategy</p>
          </div>
        </div>

        <button
          onClick={handleApplyFix}
          className="flex items-center space-x-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition shrink-0"
        >
          <span>Try This Fix</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Specific Solution Card according to Problem Type */}
      {isRetrievalFail && (
        <div className="space-y-4">
          <div className="bg-rose-100/80 text-rose-900 p-3.5 rounded-xl border border-rose-200 text-xs font-semibold">
            <div className="font-bold flex items-center space-x-1.5 text-rose-700 mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>🔴 RETRIEVAL FAILURE DETECTED</span>
            </div>
            <p className="font-medium text-rose-800">
              Problem: The relevant document was not retrieved in top search results.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-white/90 p-4 rounded-xl border border-amber-200">
              <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px] block mb-2">
                Possible Causes
              </span>
              <ul className="space-y-1.5 text-amber-950 font-medium">
                <li className="flex items-center space-x-1.5">
                  <span className="text-rose-500">•</span>
                  <span>Poor embeddings score</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="text-rose-500">•</span>
                  <span>Incorrect chunking size/overlap</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="text-rose-500">•</span>
                  <span>Low Top-K parameter (Current: {currentTopK})</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="text-rose-500">•</span>
                  <span>Irrelevant metadata filters</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/90 p-4 rounded-xl border border-amber-200">
              <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px] block mb-2">
                Suggested Fixes
              </span>
              <ul className="space-y-1.5 text-amber-950 font-medium">
                <li className="flex items-center space-x-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Increase Top-K (Current: {currentTopK} → Suggested: 5)</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Improve chunk size & overlap</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Try Gemini text-embedding-004 model</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Add metadata filtering</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {isContextFail && (
        <div className="space-y-3">
          <div className="bg-amber-100 text-amber-900 p-3.5 rounded-xl border border-amber-300 text-xs">
            <span className="font-bold text-amber-950 block mb-1">🟠 LOW CONTEXT RELEVANCE</span>
            <p>Problem: Retrieved chunks do not contain enough information to answer the question.</p>
          </div>
          <div className="bg-white/90 p-4 rounded-xl border border-amber-200 text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block mb-2">Recommended Fix:</span>
            <ul className="grid grid-cols-2 gap-2 font-medium text-slate-800">
              <li className="flex items-center space-x-1.5"><span>• Improve chunking</span></li>
              <li className="flex items-center space-x-1.5"><span>• Increase retrieved chunks</span></li>
              <li className="flex items-center space-x-1.5"><span>• Use semantic search</span></li>
              <li className="flex items-center space-x-1.5"><span>• Add reranking</span></li>
            </ul>
          </div>
        </div>
      )}

      {isGroundingFail && (
        <div className="space-y-3">
          <div className="bg-rose-100 text-rose-900 p-3.5 rounded-xl border border-rose-300 text-xs">
            <span className="font-bold text-rose-950 block mb-1">🔴 GROUNDEDNESS FAILURE</span>
            <p>Problem: The generated answer is not fully supported by the retrieved context.</p>
          </div>
          <div className="bg-white/90 p-4 rounded-xl border border-amber-200 text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block mb-2">Recommended Fix:</span>
            <ul className="grid grid-cols-2 gap-2 font-medium text-slate-800">
              <li className="flex items-center space-x-1.5"><span>• Reduce hallucination</span></li>
              <li className="flex items-center space-x-1.5"><span>• Improve prompt instructions</span></li>
              <li className="flex items-center space-x-1.5"><span>• Require evidence</span></li>
              <li className="flex items-center space-x-1.5"><span>• Answer ONLY from context</span></li>
            </ul>
          </div>
        </div>
      )}

      {isEvidenceFail && (
        <div className="space-y-3">
          <div className="bg-amber-100 text-amber-900 p-3.5 rounded-xl border border-amber-300 text-xs">
            <span className="font-bold text-amber-950 block mb-1">🟡 MISSING EVIDENCE</span>
            <p>Problem: The answer cannot be traced to a source document.</p>
          </div>
          <div className="bg-white/90 p-4 rounded-xl border border-amber-200 text-xs font-semibold text-slate-800">
            <span>Recommended Fix: Require explicit source citations in the final LLM prompt.</span>
          </div>
        </div>
      )}

      {!isRetrievalFail && !isContextFail && !isGroundingFail && !isEvidenceFail && (
        <div className="bg-emerald-50 text-emerald-900 p-4 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center justify-between">
          <span>🟢 Pipeline is operating at target parameters. Maintain current configuration.</span>
          <button
            onClick={handleApplyFix}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
          >
            Run Comparison Test
          </button>
        </div>
      )}
    </div>
  );
}
