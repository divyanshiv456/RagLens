import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import PipelineVisualizer from '../components/PipelineVisualizer';
import DiagnosisCard from '../components/DiagnosisCard';
import { Stethoscope, Play, AlertTriangle, Sliders, RefreshCw, CheckCircle2, HelpCircle, FileText } from 'lucide-react';

export default function TestRAG() {
  const location = useLocation();

  const [question, setQuestion] = useState('');
  const [topK, setTopK] = useState(3);
  const [forceRetrievalFailure, setForceRetrievalFailure] = useState(false);
  const [loading, setLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('all');

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
      desc: "Forces system to retrieve employee policy instead of refund policy to trigger 🔴 Retrieval Failure"
    },
    {
      title: "🟡 Groundedness Check",
      q: "Can I get a refund after 60 days?",
      fail: false,
      desc: "Checks if LLM correctly respects 30-day refund limit"
    }
  ];

  // Fetch available documents
  useEffect(() => {
    api.getDocuments()
      .then(data => setDocuments(data || []))
      .catch(err => console.error('Error fetching documents in TestRAG:', err));
  }, []);

  useEffect(() => {
    if (location.state?.presetQuestion) {
      setQuestion(location.state.presetQuestion);
      if (location.state.forceFailure) {
        setForceRetrievalFailure(true);
      }
    }
    if (location.state?.selectedDocId) {
      setSelectedDocId(location.state.selectedDocId);
    }
  }, [location.state]);

  const handleDiagnose = async (e) => {
    if (e) e.preventDefault();

    if (!question || question.trim().length === 0) {
      setError('Please enter a question to diagnose.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await api.askQuestion(question.trim(), topK, forceRetrievalFailure, selectedDocId);
      setDiagnosisResult(data.diagnosis);
    } catch (err) {
      console.error('Error running RAG diagnosis:', err);
      setError(err.response?.data?.error || 'Unable to generate diagnosis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset) => {
    setQuestion(preset.q);
    setForceRetrievalFailure(preset.fail);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
          <Stethoscope className="w-7 h-7 text-sky-600" />
          <span>Test & Diagnose RAG Pipeline</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Ask any question to execute a complete diagnostic inspection across Retrieval, Relevance, Groundedness, and Evidence.
        </p>
      </div>

      {/* Input & Parameters Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        
        {/* Preset Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Preset Sample Scenario:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {samplePresets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className={`p-3 rounded-xl border text-left transition ${
                  question === p.q && forceRetrievalFailure === p.fail
                    ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-300'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <span className="text-xs font-bold block mb-1">{p.title}</span>
                <p className="text-xs text-slate-800 font-medium line-clamp-1">"{p.q}"</p>
                <span className="text-[10px] text-slate-400 mt-1 block">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Target Knowledge Document Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center space-x-2 text-slate-800">
            <FileText className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Target Knowledge Scope:</span>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-800"
            >
              <option value="all">📁 All Documents ({documents.length} indexed)</option>
              {documents.map((d) => (
                <option key={d._id} value={d._id}>
                  📄 {d.filename} ({d.chunkCount} chunks)
                </option>
              ))}
            </select>
            {selectedDocId !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedDocId('all')}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 underline px-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Question Text Area Input */}
        <form onSubmit={handleDiagnose} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Enter User Question:
            </label>
            <textarea
              rows={3}
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                setError(null);
              }}
              placeholder="e.g. What is the company's refund policy, or ask anything about your uploaded document..."
              className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-medium"
            />
          </div>

          {/* Configuration Controls Bar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center space-x-6">
              {/* Top-K Slider */}
              <div className="flex items-center space-x-3">
                <Sliders className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-700">Top-K Chunks: {topK}</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={topK}
                  onChange={(e) => setTopK(Number(e.target.value))}
                  className="w-24 accent-sky-600"
                />
              </div>

              {/* Force Retrieval Failure Checkbox */}
              <label className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={forceRetrievalFailure}
                  onChange={(e) => setForceRetrievalFailure(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span className={forceRetrievalFailure ? 'text-rose-600 font-bold' : ''}>
                  Force Retrieval Failure Demo 🧪
                </span>
              </label>
            </div>

            {/* Diagnose Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Diagnosing Pipeline...</span>
                </>
              ) : (
                <>
                  <Stethoscope className="w-5 h-5" />
                  <span>Diagnose RAG</span>
                </>
              )}
            </button>

          </div>
        </form>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs font-semibold flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

      </div>

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
