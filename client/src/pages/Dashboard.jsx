import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import HealthScoreBadge from '../components/HealthScoreBadge';
import { FileText, Stethoscope, CheckCircle2, AlertTriangle, ArrowRight, Play, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    documentsCount: 0,
    questionsTested: 0,
    healthyCount: 0,
    issuesCount: 0,
    avgHealthScore: 0,
    recentDiagnoses: []
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await api.getStats();
      setStats(data);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🩺</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">RAG Doctor</h1>
            </div>
            <p className="text-sky-200 text-sm sm:text-base leading-relaxed">
              Diagnostic and debugging platform for Retrieval-Augmented Generation (RAG) pipelines.
              Identify retrieval failures, context irrelevance, hallucinations, and missing citations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => navigate('/test')}
              className="flex items-center justify-center space-x-2 px-5 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow-md transition"
            >
              <Stethoscope className="w-5 h-5" />
              <span>Run Diagnostic Test</span>
            </button>
            <button
              onClick={() => navigate('/documents')}
              className="flex items-center justify-center space-x-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition"
            >
              <FileText className="w-5 h-5" />
              <span>Manage Documents</span>
            </button>
          </div>

        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Documents Uploaded */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Documents Uploaded</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.documentsCount}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Repository files</p>
          </div>
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl border border-sky-100">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Questions Tested */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Questions Tested</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.questionsTested}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Total pipeline runs</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Healthy Runs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Healthy Runs</p>
            <h3 className="text-3xl font-black text-emerald-600 mt-1">{stats.healthyCount}</h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Passing all 4 checks</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Issues Detected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Issues Detected</p>
            <h3 className="text-3xl font-black text-rose-600 mt-1">{stats.issuesCount}</h3>
            <p className="text-[11px] text-rose-600 font-medium mt-1">Retrieval & grounding bugs</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* RAG Health Gauge & Quick Demo Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Overall Health Score Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Overall Pipeline Health Score</h3>
          <HealthScoreBadge
            score={stats.avgHealthScore || 0}
            status={stats.avgHealthScore >= 90 ? 'Healthy' : (stats.avgHealthScore >= 70 ? 'Needs Attention' : 'Problem Detected')}
          />
          <p className="text-xs text-slate-500 mt-3 max-w-xs">
            Average score calculated across all recent diagnostic runs.
          </p>
        </div>

        {/* Quick Demo Test Presets */}
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
                <p className="text-[11px] text-slate-400 mt-1">Expected: 🟢 Healthy RAG (2-second check)</p>
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
                  <tr key={diag._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3 font-bold">
                      {diag.healthStatus === 'Healthy' ? (
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">🟢 Healthy</span>
                      ) : (
                        <span className="text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-200">🔴 {diag.healthStatus}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-900">{diag.question}</td>
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
