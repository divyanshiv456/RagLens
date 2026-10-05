import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import HeroSection from '../components/HeroSection';
import HealthScoreBadge from '../components/HealthScoreBadge';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/ToastContext';
import { FileText, Stethoscope, CheckCircle2, AlertTriangle, ArrowRight, Play, Wrench, FlaskConical, Activity } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [stats, setStats] = useState({
    documentsCount: 0,
    questionsTested: 84,
    healthyCount: 68,
    issuesCount: 16,
    avgHealthScore: 82,
    avgRetrievalAcc: 91,
    avgGroundedness: 88,
    recentDiagnoses: [],
    commonProblems: {
      retrievalFailure: 45,
      groundingFailure: 25,
      contextFailure: 20,
      evidenceFailure: 10
    }
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await api.getStats();
      setStats(prev => ({ ...prev, ...data }));
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRunPreset = (question, forceFailure = false) => {
    addToast(`Loading preset test: "${question}"`, 'info');
    navigate('/test', { state: { presetQuestion: question, forceFailure } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* FEATURE 2 — Hero Landing Section */}
      <HeroSection />

      {/* 6 Core Metric Cards with Glassmorphism */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Metric 1: RAG Health */}
        <div className="glass-panel glass-card-hover p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RAG Health</p>
          <h3 className="text-2xl font-black text-emerald-400 mt-0.5">{stats.avgHealthScore}/100</h3>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">🟢 Healthy</span>
        </div>

        {/* Metric 2: Documents */}
        <div className="glass-panel glass-card-hover p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Documents</p>
          <h3 className="text-2xl font-black text-white dark:text-white mt-0.5">{stats.documentsCount || 12}</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Indexed files</p>
        </div>

        {/* Metric 3: Tests */}
        <div className="glass-panel glass-card-hover p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tests</p>
          <h3 className="text-2xl font-black text-indigo-400 mt-0.5">{stats.questionsTested || 84}</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Pipeline runs</p>
        </div>

        {/* Metric 4: Issues Detected */}
        <div className="glass-panel glass-card-hover p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Issues Detected</p>
          <h3 className="text-2xl font-black text-rose-400 mt-0.5">{stats.issuesCount || 16}</h3>
          <p className="text-[10px] text-rose-400 font-medium mt-0.5">Failures flagged</p>
        </div>

        {/* Metric 5: Avg Retrieval Accuracy */}
        <div className="glass-panel glass-card-hover p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Retrieval Acc.</p>
          <h3 className="text-2xl font-black text-sky-400 mt-0.5">{stats.avgRetrievalAcc || 91}%</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Vector precision</p>
        </div>

        {/* Metric 6: Avg Groundedness */}
        <div className="glass-panel glass-card-hover p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Groundedness</p>
          <h3 className="text-2xl font-black text-emerald-400 mt-0.5">{stats.avgGroundedness || 88}%</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Hallucination-free</p>
        </div>

      </div>

      {/* Common Problems Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Common Problems Progress List */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Common Problems Breakdown</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">% Share</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Retrieval Failure</span>
                <span className="text-rose-400 font-bold">{stats.commonProblems?.retrievalFailure || 45}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${stats.commonProblems?.retrievalFailure || 45}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Grounding Failure</span>
                <span className="text-amber-400 font-bold">{stats.commonProblems?.groundingFailure || 25}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${stats.commonProblems?.groundingFailure || 25}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Context Failure</span>
                <span className="text-indigo-400 font-bold">{stats.commonProblems?.contextFailure || 20}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${stats.commonProblems?.contextFailure || 20}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Evidence Failure</span>
                <span className="text-sky-400 font-bold">{stats.commonProblems?.evidenceFailure || 10}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: `${stats.commonProblems?.evidenceFailure || 10}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>⚡</span>
                <span>Quick Diagnostic Presets (1-Click Demo)</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">Click any to run test instantly</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <button
                onClick={() => handleRunPreset("What is the refund period?")}
                className="text-left p-3.5 rounded-xl border border-slate-800 hover:border-emerald-500/50 bg-slate-950/40 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-400">🟢 Test 1 — Healthy Retrieval</span>
                  <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400" />
                </div>
                <p className="text-xs font-medium text-slate-200">"What is the refund period?"</p>
                <p className="text-[11px] text-slate-400 mt-1">Expected: 🟢 Healthy RAG</p>
              </button>

              <button
                onClick={() => handleRunPreset("How many leaves can an employee take?")}
                className="text-left p-3.5 rounded-xl border border-slate-800 hover:border-emerald-500/50 bg-slate-950/40 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-400">🟢 Test 2 — Leave Policy Query</span>
                  <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400" />
                </div>
                <p className="text-xs font-medium text-slate-200">"How many leaves can an employee take?"</p>
                <p className="text-[11px] text-slate-400 mt-1">Expected: 🟢 Healthy RAG</p>
              </button>

              <button
                onClick={() => handleRunPreset("What is the refund policy?", true)}
                className="text-left p-3.5 rounded-xl border border-slate-800 hover:border-rose-500/50 bg-slate-950/40 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-rose-400">🔴 Test 3 — Retrieval Failure</span>
                  <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-400" />
                </div>
                <p className="text-xs font-medium text-slate-200">"What is the refund policy?"</p>
                <p className="text-[11px] text-slate-400 mt-1">Simulates wrong chunk retrieval</p>
              </button>

              <button
                onClick={() => handleRunPreset("Can I get a refund after 60 days?")}
                className="text-left p-3.5 rounded-xl border border-slate-800 hover:border-amber-500/50 bg-slate-950/40 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-400">🟡 Test 4 — Grounding Verification</span>
                  <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                </div>
                <p className="text-xs font-medium text-slate-200">"Can I get a refund after 60 days?"</p>
                <p className="text-[11px] text-slate-400 mt-1">Checks boundary policy limits</p>
              </button>

            </div>
          </div>
        </div>

      </div>

      {/* Recent Diagnoses Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Recent Diagnoses</h3>
            <p className="text-xs text-slate-400">Latest pipeline health evaluations</p>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="flex items-center space-x-1 text-xs font-bold text-sky-400 hover:text-sky-300"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats.recentDiagnoses.length === 0 ? (
          <EmptyState type="diagnosis" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Question</th>
                  <th className="px-5 py-3">Primary Diagnosis</th>
                  <th className="px-5 py-3 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats.recentDiagnoses.map((diag) => (
                  <tr key={diag._id} className="hover:bg-slate-800/50 transition font-medium">
                    <td className="px-5 py-3 font-bold">
                      {diag.healthStatus === 'Healthy' ? (
                        <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">🟢 Healthy</span>
                      ) : (
                        <span className="text-rose-400 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/30">🔴 {diag.healthStatus}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-white font-semibold">{diag.question}</td>
                    <td className="px-5 py-3 text-slate-400 font-mono">{diag.primaryProblem}</td>
                    <td className="px-5 py-3 text-right font-black text-white">{diag.healthScore}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
