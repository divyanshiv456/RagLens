import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import HealthScoreBadge from '../components/HealthScoreBadge';
import { FileText, Stethoscope, CheckCircle2, AlertTriangle, ArrowRight, Play, Wrench, FlaskConical, Activity } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
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
    navigate('/test', { state: { presetQuestion: question, forceFailure } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🩺</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">RAG Doctor Platform</h1>
            </div>
            <p className="text-sky-200 text-sm sm:text-base leading-relaxed">
              Complete diagnostic, testing, monitoring, and repair platform for Retrieval-Augmented Generation (RAG) AI systems.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/repair')}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition"
            >
              <Wrench className="w-4 h-4" />
              <span>Smart Repair Lab</span>
            </button>
            <button
              onClick={() => navigate('/test-lab')}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition"
            >
              <FlaskConical className="w-4 h-4" />
              <span>RAG Test Lab</span>
            </button>
            <button
              onClick={() => navigate('/test')}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Run Diagnostic</span>
            </button>
          </div>

        </div>
      </div>

      {/* 6 Core Dashboard Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Metric 1: RAG Health */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RAG Health</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-0.5">{stats.avgHealthScore}/100</h3>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">🟢 Healthy</span>
        </div>

        {/* Metric 2: Documents */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Documents</p>
          <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stats.documentsCount || 12}</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Indexed files</p>
        </div>

        {/* Metric 3: Tests */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tests</p>
          <h3 className="text-2xl font-black text-indigo-600 mt-0.5">{stats.questionsTested || 84}</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Pipeline runs</p>
        </div>

        {/* Metric 4: Issues Detected */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Issues Detected</p>
          <h3 className="text-2xl font-black text-rose-600 mt-0.5">{stats.issuesCount || 16}</h3>
          <p className="text-[10px] text-rose-600 font-medium mt-0.5">Failures flagged</p>
        </div>

        {/* Metric 5: Avg Retrieval Accuracy */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Retrieval Acc.</p>
          <h3 className="text-2xl font-black text-sky-600 mt-0.5">{stats.avgRetrievalAcc || 91}%</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Vector precision</p>
        </div>

        {/* Metric 6: Avg Groundedness */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Groundedness</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-0.5">{stats.avgGroundedness || 88}%</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Hallucination-free</p>
        </div>

      </div>

      {/* Common Problems Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Common Problems Progress List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Common Problems Breakdown</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">% Share</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Retrieval Failure</span>
                <span className="text-rose-600 font-bold">{stats.commonProblems?.retrievalFailure || 45}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${stats.commonProblems?.retrievalFailure || 45}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Grounding Failure</span>
                <span className="text-amber-600 font-bold">{stats.commonProblems?.groundingFailure || 25}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${stats.commonProblems?.groundingFailure || 25}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Context Failure</span>
                <span className="text-indigo-600 font-bold">{stats.commonProblems?.contextFailure || 20}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${stats.commonProblems?.contextFailure || 20}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Evidence Failure</span>
                <span className="text-sky-600 font-bold">{stats.commonProblems?.evidenceFailure || 10}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: `${stats.commonProblems?.evidenceFailure || 10}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <span>⚡</span>
                <span>Quick Diagnostic Presets (1-Click Demo)</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">Click any to run test instantly</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <button
                onClick={() => handleRunPreset("What is the refund period?")}
                className="text-left p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-700">🟢 Test 1 — Healthy Retrieval</span>
                  <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <p className="text-xs font-medium text-slate-800">"What is the refund period?"</p>
                <p className="text-[11px] text-slate-400 mt-1">Expected: 🟢 Healthy RAG</p>
              </button>

              <button
                onClick={() => handleRunPreset("How many leaves can an employee take?")}
                className="text-left p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-700">🟢 Test 2 — Leave Policy Query</span>
                  <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <p className="text-xs font-medium text-slate-800">"How many leaves can an employee take?"</p>
                <p className="text-[11px] text-slate-400 mt-1">Expected: 🟢 Healthy RAG</p>
              </button>

              <button
                onClick={() => handleRunPreset("What is the refund policy?", true)}
                className="text-left p-3.5 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-rose-700">🔴 Test 3 — Retrieval Failure</span>
                  <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600" />
                </div>
                <p className="text-xs font-medium text-slate-800">"What is the refund policy?"</p>
                <p className="text-[11px] text-slate-400 mt-1">Simulates wrong chunk retrieval</p>
              </button>

              <button
                onClick={() => handleRunPreset("Can I get a refund after 60 days?")}
                className="text-left p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-700">🟡 Test 4 — Grounding Verification</span>
                  <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
                </div>
                <p className="text-xs font-medium text-slate-800">"Can I get a refund after 60 days?"</p>
                <p className="text-[11px] text-slate-400 mt-1">Checks boundary policy limits</p>
              </button>

            </div>
          </div>
        </div>

      </div>

      {/* Recent Diagnoses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Diagnoses</h3>
            <p className="text-xs text-slate-500">Latest pipeline health evaluations</p>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="flex items-center space-x-1 text-xs font-bold text-sky-600 hover:text-sky-700"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats.recentDiagnoses.length === 0 ? (
          <div className="text-center py-10 px-4">
            <Stethoscope className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500 font-medium">No diagnostic runs performed yet.</p>
            <button
              onClick={() => handleRunPreset("What is the refund period?")}
              className="mt-3 inline-flex items-center space-x-1.5 px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-semibold hover:bg-sky-500 transition"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Run First Test</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Question</th>
                  <th className="px-5 py-3">Primary Diagnosis</th>
                  <th className="px-5 py-3 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentDiagnoses.map((diag) => (
                  <tr key={diag._id} className="hover:bg-slate-50/80 transition font-medium">
                    <td className="px-5 py-3 font-bold">
                      {diag.healthStatus === 'Healthy' ? (
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">🟢 Healthy</span>
                      ) : (
                        <span className="text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-200">🔴 {diag.healthStatus}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-900 font-semibold">{diag.question}</td>
                    <td className="px-5 py-3 text-slate-600 font-mono">{diag.primaryProblem}</td>
                    <td className="px-5 py-3 text-right font-black text-slate-800">{diag.healthScore}/100</td>
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
