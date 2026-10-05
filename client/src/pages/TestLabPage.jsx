import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FlaskConical, Play, RefreshCw, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TestLabPage() {
  const navigate = useNavigate();

  const defaultSuiteText = `1. What is the refund period?
2. What is the cancellation policy?
3. How many leaves are allowed?
4. What is the employee notice period?
5. How can I request a refund?`;

  const [questionsInput, setQuestionsInput] = useState(defaultSuiteText);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [error, setError] = useState(null);

  const handleRunAllTests = async (e) => {
    if (e) e.preventDefault();

    const questionsList = questionsInput
      .split('\n')
      .map(q => q.replace(/^\d+\.\s*/, '').trim())
      .filter(q => q.length > 0);

    if (questionsList.length === 0) {
      setError('Please enter at least one question to run.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await api.runTestSuite(questionsList);
      setTestResults(data);
    } catch (err) {
      console.error('Error running test suite:', err);
      setError(err.response?.data?.error || 'Failed to execute automated test suite.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl border border-emerald-500/20">
            <FlaskConical className="w-6 h-6" />
          </div>
          <span>RAG Test Lab (Automated Suite) 🧪</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Execute batch evaluation test suites across multiple queries to continuously monitor retrieval and grounding health.
        </p>
      </div>

      {/* Input Questions Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Enter Test Questions (One per line):
          </label>
          <textarea
            rows={5}
            value={questionsInput}
            onChange={(e) => setQuestionsInput(e.target.value)}
            className="w-full p-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            Clicking "Run All Tests" will diagnose each question sequentially.
          </span>

          <button
            onClick={handleRunAllTests}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Test Suite...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run All Tests</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs font-semibold">
            {error}
          </div>
        )}
      </div>

      {/* Test Suite Summary Banner & Results Table */}
      {testResults && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Summary Box */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Tests</span>
                <span className="text-2xl font-black text-white">{testResults.summary.totalTests}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Passed</span>
                <span className="text-2xl font-black text-emerald-400">{testResults.summary.passedCount}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Warnings</span>
                <span className="text-2xl font-black text-amber-400">{testResults.summary.warningCount}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Failed</span>
                <span className="text-2xl font-black text-rose-400">{testResults.summary.failedCount}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">Avg Health Score</span>
                <span className="text-2xl font-black text-sky-400">{testResults.summary.averageScore}/100</span>
              </div>
            </div>
          </div>

          {/* Itemized Results Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Batch Test Results Breakdown</h3>
              <span className="text-xs text-slate-400">Click any row to inspect full diagnosis</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Question</th>
                    <th className="px-5 py-3 text-center">Retrieval</th>
                    <th className="px-5 py-3 text-center">Groundedness</th>
                    <th className="px-5 py-3 text-right">Health Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {testResults.results.map((res, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition font-medium">
                      <td className="px-5 py-3">
                        <span className="text-base">{res.status}</span>
                      </td>
                      <td className="px-5 py-3 font-semibold text-slate-900">
                        "{res.question}"
                      </td>
                      <td className="px-5 py-3 text-center text-sm">{res.retrieval}</td>
                      <td className="px-5 py-3 text-center text-sm">{res.groundedness}</td>
                      <td className="px-5 py-3 text-right font-black text-slate-800 text-sm">
                        {res.score}/100
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
