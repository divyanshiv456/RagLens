import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import PipelineVisualizer from '../components/PipelineVisualizer';
import DiagnosisCard from '../components/DiagnosisCard';
import DiagnosticScannerModal from '../components/DiagnosticScannerModal';
import { useToast } from '../components/ToastContext';
import { Stethoscope, Play, AlertTriangle, Sliders, RefreshCw, CheckCircle2, HelpCircle } from 'lucide-react';

export default function TestRAG() {
  const location = useLocation();
  const { addToast } = useToast();

  const [question, setQuestion] = useState('');
  const [topK, setTopK] = useState(3);
  const [forceRetrievalFailure, setForceRetrievalFailure] = useState(false);
  
  const [isScanningModalOpen, setIsScanningModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [error, setError] = useState(null);

  // Preset sample questions
  const samplePresets = [
    {
      title: "🟢 Healthy Test",
      q: "What is the refund period?",
      fail: false,
      desc: "Tests standard refund policy retrieval"
    },
    {
      title: "🟢 Leave Policy",
      q: "How many leaves can an employee take?",
      fail: false,
      desc: "Tests leave policy document retrieval"
    },
    {
      title: "🔴 Force Retrieval Failure",
      q: "What is the refund policy?",
      fail: true,
      desc: "Forces wrong document retrieval to trigger 🔴 Retrieval Failure"
    },
    {
      title: "🟡 Groundedness Check",
      q: "Can I get a refund after 60 days?",
      fail: false,
      desc: "Checks if LLM respects 30-day refund limit"
    }
  ];

  useEffect(() => {
    if (location.state?.presetQuestion) {
      setQuestion(location.state.presetQuestion);
      if (location.state.forceFailure) {
        setForceRetrievalFailure(true);
      }
    }
  }, [location.state]);

  const executeDiagnosis = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.askQuestion(question.trim(), topK, forceRetrievalFailure);
      setDiagnosisResult(data.diagnosis);
      addToast('Diagnosis completed successfully!', 'success');
    } catch (err) {
      console.error('Error running RAG diagnosis:', err);
      const errMsg = err.response?.data?.error || 'Unable to generate diagnosis. Please try again.';
      setError(errMsg);
      addToast(errMsg, 'error');
    } finally {
      setLoading(false);
      setIsScanningModalOpen(false);
    }
  };

  const handleStartDiagnose = (e) => {
    if (e) e.preventDefault();

    if (!question || question.trim().length === 0) {
      setError('Please enter a question to diagnose.');
      addToast('Please enter a question to diagnose.', 'warning');
      return;
    }

    setIsScanningModalOpen(true);
  };

  const applyPreset = (preset) => {
    setQuestion(preset.q);
    setForceRetrievalFailure(preset.fail);
    setError(null);
    addToast(`Preset selected: "${preset.q}"`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2.5">
          <div className="p-2 bg-sky-500/10 text-sky-500 rounded-xl border border-sky-500/20">
            <Stethoscope className="w-6 h-6" />
          </div>
          <span>Test & Diagnose RAG Pipeline</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Ask any question to execute a complete diagnostic inspection across Retrieval, Relevance, Groundedness, and Evidence.
        </p>
      </div>

      {/* Input & Parameters Form Card */}
      <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 space-y-5 backdrop-blur-md">
        
        {/* Preset Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Select Preset Sample Scenario:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {samplePresets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                  question === p.q && forceRetrievalFailure === p.fail
                    ? 'border-sky-500 bg-sky-500/10 ring-2 ring-sky-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40'
                }`}
              >
                <span className="text-xs font-bold block mb-1 text-slate-900 dark:text-white">{p.title}</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-1">"{p.q}"</p>
                <span className="text-[10px] text-slate-400 mt-1 block">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question Text Area Input */}
        <form onSubmit={handleStartDiagnose} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Enter User Question:
            </label>
            <textarea
              rows={3}
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                setError(null);
              }}
              placeholder="e.g. What is the company's refund policy?"
              className="w-full p-3.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium transition"
            />
          </div>

          {/* Configuration Controls Bar */}
          <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center space-x-6">
              {/* Top-K Slider */}
              <div className="flex items-center space-x-3">
                <Sliders className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Top-K Chunks: {topK}</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={topK}
                  onChange={(e) => setTopK(Number(e.target.value))}
                  className="w-24 accent-sky-500"
                />
              </div>

              {/* Force Retrieval Failure Checkbox */}
              <label className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={forceRetrievalFailure}
                  onChange={(e) => setForceRetrievalFailure(e.target.checked)}
                  className="rounded text-sky-500 focus:ring-sky-500 w-4 h-4"
                />
                <span className={forceRetrievalFailure ? 'text-rose-400 font-bold' : ''}>
                  Force Failure Demo 🧪
                </span>
              </label>
            </div>

            {/* Diagnose Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Diagnosing...</span>
                </>
              ) : (
                <>
                  <Stethoscope className="w-4 h-4" />
                  <span>Diagnose RAG</span>
                </>
              )}
            </button>

          </div>
        </form>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-500/10 text-rose-300 rounded-xl border border-rose-500/20 text-xs font-semibold flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

      </div>

      {/* Diagnostic Scanning Modal Overlay */}
      <DiagnosticScannerModal
        isOpen={isScanningModalOpen}
        onClose={() => setIsScanningModalOpen(false)}
        onComplete={executeDiagnosis}
      />

      {/* Diagnostic Results Section */}
      {diagnosisResult && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Pipeline Visualizer */}
          <PipelineVisualizer
            pipelineStatus={diagnosisResult.pipelineStatus}
            details={{
              question: diagnosisResult.question,
              retrievalInfo: `Retrieved ${diagnosisResult.retrievedChunks?.length || 0} chunks. Top chunk score: ${
                diagnosisResult.retrievedChunks?.[0]?.similarityScore
                  ? (diagnosisResult.retrievedChunks[0].similarityScore * 100).toFixed(0) + '%'
                  : 'N/A'
              }`,
              contextInfo: `Context size: ${diagnosisResult.retrievedChunks?.reduce((acc, c) => acc + c.content.length, 0) || 0} chars.`,
              llmInfo: `LLM model responded with grounded text.`,
              answerInfo: diagnosisResult.generatedAnswer
            }}
          />

          {/* Detailed Diagnosis Report Card */}
          <DiagnosisCard diagnosis={diagnosisResult} />

        </div>
      )}

    </div>
  );
}
