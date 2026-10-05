import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Play, Pause, RotateCcw, CheckCircle2, AlertTriangle, XCircle, Info, ArrowRight, HelpCircle, Search, Database, FileText, Cpu, Stethoscope } from 'lucide-react';

export default function PipelineReplayPage() {
  const [question, setQuestion] = useState("What is the refund policy?");
  const [forceRetrievalFailure, setForceRetrievalFailure] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [replayData, setReplayData] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);

  const fetchReplay = async () => {
    setLoading(true);
    try {
      const data = await api.getPipelineReplay(question, forceRetrievalFailure);
      setReplayData(data);
      setCurrentStepIndex(0);
      setIsPlaying(false);
    } catch (err) {
      console.error('Error fetching replay:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReplay();
  }, []);

  // Timer for step-by-step playback
  useEffect(() => {
    let interval = null;
    if (isPlaying && replayData && replayData.replaySteps) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < replayData.replaySteps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, replayData]);

  const handlePlay = () => {
    if (currentStepIndex >= (replayData?.replaySteps?.length || 1) - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const getStatusBadge = (status) => {
    if (status === 'Passed') return <span className="text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">🟢 Passed</span>;
    if (status === 'Warning') return <span className="text-amber-600 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]">🟡 Warning</span>;
    return <span className="text-rose-600 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px]">🔴 Failed</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl border border-indigo-500/20">
            <Play className="w-6 h-6" />
          </div>
          <span>Interactive Pipeline Replay 🔄</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Visually step through every stage of the RAG journey from raw query to similarity matching, LLM generation, and diagnostic checks.
        </p>
      </div>

      {/* Query Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 p-2.5 text-sm rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-indigo-500"
          />
          <label className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-700 select-none shrink-0">
            <input
              type="checkbox"
              checked={forceRetrievalFailure}
              onChange={(e) => setForceRetrievalFailure(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span className={forceRetrievalFailure ? 'text-rose-600 font-bold' : ''}>
              Force Failure Demo 🧪
            </span>
          </label>
        </div>

        <button
          onClick={fetchReplay}
          disabled={loading}
          className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition shrink-0"
        >
          {loading ? 'Running...' : 'Replay Question'}
        </button>
      </div>

      {/* Replay Controls & Animated Progress */}
      {replayData && (
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            
            <div className="flex items-center space-x-3">
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className="flex items-center space-x-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition shadow"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>▶ Replay</span>
                  </>
                )}
              </button>

              <button
                onClick={handleRestart}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart</span>
              </button>
            </div>

            <div className="text-xs font-mono text-slate-300">
              Step <span className="text-sky-400 font-bold">{currentStepIndex + 1}</span> of {replayData.replaySteps.length}
            </div>

          </div>

          {/* 7-Step Horizontal Timeline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {replayData.replaySteps.map((stepItem, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              const isSelected = selectedStep === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedStep(isSelected ? null : idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-400 shadow-md scale-105'
                      : (isPast ? 'bg-white border-slate-300 opacity-90' : 'bg-slate-50 border-slate-200 opacity-60')
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Step {stepItem.step}
                    </span>
                    <span className="text-sm">{stepItem.badge}</span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1 mb-1">
                    {stepItem.name}
                  </h4>

                  <div className="mt-2">
                    {getStatusBadge(stepItem.status)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Step Detailed Card */}
          {replayData.replaySteps[currentStepIndex] && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{replayData.replaySteps[currentStepIndex].badge}</span>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {replayData.replaySteps[currentStepIndex].title}
                  </h3>
                </div>
                {getStatusBadge(replayData.replaySteps[currentStepIndex].status)}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono leading-relaxed text-slate-800">
                <p className="font-semibold">{replayData.replaySteps[currentStepIndex].content || replayData.replaySteps[currentStepIndex].description}</p>
              </div>

              {currentStepIndex === 2 && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs space-y-2">
                  <span className="font-bold text-amber-900 block">Retrieval Inspection payload:</span>
                  <p className="text-amber-950 font-medium">
                    Retrieved Documents: {(replayData.replaySteps[2].retrieved || []).join(', ') || 'None'}
                  </p>
                  <p className="text-amber-800">
                    Correct Document Required: <strong>{replayData.replaySteps[2].correctDocument}</strong>
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
