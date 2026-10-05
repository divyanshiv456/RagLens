import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import BeforeAfterComparison from '../components/BeforeAfterComparison';
import RecommendedFix from '../components/RecommendedFix';
import PipelineVisualizer from '../components/PipelineVisualizer';
import SmartSummary from '../components/SmartSummary';
import { Wrench, Play, RefreshCw, Sparkles, ArrowRight, Sliders, AlertTriangle } from 'lucide-react';

export default function RepairLab() {
  const location = useLocation();

  const [question, setQuestion] = useState("What is the refund policy?");
  const [initialTopK, setInitialTopK] = useState(2);
  const [initialForceFail, setInitialForceFail] = useState(true);
  const [suggestedTopK, setSuggestedTopK] = useState(5);
  
  const [step, setStep] = useState(1); // 1: Initial, 2: Diagnosed, 3: Repaired
  const [loading, setLoading] = useState(false);
  const [initialDiagnosis, setInitialDiagnosis] = useState(null);
  const [repairedDiagnosis, setRepairedDiagnosis] = useState(null);
  const [repairResults, setRepairResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.question) {
      setQuestion(location.state.question);
    }
  }, [location.state]);

  // Step 1: Run Initial RAG
  const handleRunInitial = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setRepairedDiagnosis(null);
    setRepairResults(null);

    try {
      const data = await api.askQuestion(question.trim(), initialTopK, initialForceFail);
      setInitialDiagnosis(data.diagnosis);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to run initial RAG diagnosis.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Apply Fix & Run RAG Again
  const handleApplyFixAndRun = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.repairPipeline(
        question.trim(),
        { topK: initialTopK, forceRetrievalFailure: initialForceFail },
        { topK: suggestedTopK, forceRetrievalFailure: false },
        `Increase Top-K from K=${initialTopK} to K=${suggestedTopK} & Restore Dense Vector Retrieval`
      );

      setInitialDiagnosis(data.beforeDiagnosis);
      setRepairedDiagnosis(data.afterDiagnosis);
      setRepairResults(data);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to execute RAG repair iteration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl border border-amber-500/20">
              <Wrench className="w-6 h-6" />
            </div>
            <span>Smart RAG Repair Lab 🩺</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Diagnose pipeline failures, apply recommended engineering fixes, rerun queries, and verify score improvements.
          </p>
        </div>

        {/* Workflow Breadcrumb Indicator */}
        <div className="flex items-center space-x-2 text-xs font-bold bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
          <span className={`px-2.5 py-1 rounded-lg ${step >= 1 ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
            1. Ask Question
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          <span className={`px-2.5 py-1 rounded-lg ${step >= 2 ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
            2. Diagnose
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          <span className={`px-2.5 py-1 rounded-lg ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
            3. Apply Fix & Compare
          </span>
        </div>
      </div>

      {/* Step 1 Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <form onSubmit={handleRunInitial} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              User Question to Diagnose & Repair:
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What is the refund policy?"
              className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                <Sliders className="w-4 h-4 text-slate-500" />
                <span>Initial Top-K:</span>
                <select
                  value={initialTopK}
                  onChange={(e) => setInitialTopK(Number(e.target.value))}
                  className="p-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                >
                  <option value={1}>1</option>
                  <option value={2}>2 (Low K)</option>
                  <option value={3}>3</option>
                </select>
              </div>

              <label className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={initialForceFail}
                  onChange={(e) => setInitialForceFail(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className={initialForceFail ? 'text-rose-600 font-bold' : ''}>
                  Simulate Initial Retrieval Problem 🧪
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Diagnosing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run Initial RAG</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs font-semibold flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Step 2: Initial Diagnosis & Fix Suggestion */}
      {initialDiagnosis && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Smart Plain-English Summary Banner */}
          <SmartSummary
            summary={initialDiagnosis.summary}
            healthScore={initialDiagnosis.healthScore}
            healthStatus={initialDiagnosis.healthStatus}
            primaryProblem={initialDiagnosis.primaryProblem}
          />

          {/* Interactive Recommended Fix Component */}
          <RecommendedFix
            diagnosis={initialDiagnosis}
            onTryFix={() => handleApplyFixAndRun()}
          />

          {/* Action Trigger Card */}
          <div className="bg-gradient-to-r from-slate-900 to-sky-950 p-6 rounded-2xl border border-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Ready to Apply Suggested Fix?</h3>
              </div>
              <p className="text-xs text-slate-300">
                Change Top-K from {initialTopK} → {suggestedTopK} and rerun query to evaluate performance gain.
              </p>
            </div>

            <button
              onClick={handleApplyFixAndRun}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl shadow-lg transition disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Applying Fix & Rerunning RAG...</span>
                </>
              ) : (
                <>
                  <Wrench className="w-5 h-5" />
                  <span>Apply Fix & Compare Results</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* Step 3: Repaired Diagnosis & Before vs After Comparison */}
      {repairedDiagnosis && repairResults && (
        <div className="space-y-6 animate-fadeIn">
          
          <BeforeAfterComparison
            beforeDiagnosis={initialDiagnosis}
            afterDiagnosis={repairedDiagnosis}
            appliedFix={repairResults.appliedFix}
          />

          {/* Repaired Flow Visualizer */}
          <PipelineVisualizer
            pipelineStatus={repairedDiagnosis.pipelineStatus}
            details={{
              question: repairedDiagnosis.question,
              retrievalInfo: `Retrieved ${repairedDiagnosis.retrievedChunks?.length || 0} chunks (Top-K=5). Top chunk score: ${(repairedDiagnosis.retrievedChunks?.[0]?.similarityScore * 100 || 0).toFixed(0)}%`,
              contextInfo: `Context size: ${repairedDiagnosis.retrievedChunks?.reduce((acc, c) => acc + c.content.length, 0) || 0} chars.`,
              llmInfo: `LLM responded with grounded answer text.`,
              answerInfo: repairedDiagnosis.generatedAnswer
            }}
          />

        </div>
      )}

    </div>
  );
}
