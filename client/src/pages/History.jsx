import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import DiagnosisCard from '../components/DiagnosisCard';
import { History as HistoryIcon, Trash2, Eye, X, Filter, Stethoscope } from 'lucide-react';

export default function History() {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getDiagnoses();
      setDiagnoses(data);
    } catch (err) {
      console.error('Error fetching diagnosis history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this diagnosis record?')) return;
    try {
      await api.deleteDiagnosis(id);
      fetchHistory();
    } catch (err) {
      console.error('Error deleting record:', err);
    }
  };

  const filteredDiagnoses = diagnoses.filter(d => {
    if (filter === 'HEALTHY') return d.healthStatus === 'Healthy';
    if (filter === 'ISSUES') return d.healthStatus !== 'Healthy';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <HistoryIcon className="w-7 h-7 text-sky-600" />
            <span>Diagnosis History Log</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Historical audit log of all RAG pipeline tests saved in MongoDB.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Runs ({diagnoses.length})
          </button>
          <button
            onClick={() => setFilter('HEALTHY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'HEALTHY' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Healthy 🟢
          </button>
          <button
            onClick={() => setFilter('ISSUES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'ISSUES' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Issues Detected 🔴
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">Loading history logs...</div>
        ) : filteredDiagnoses.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-2">
            <Stethoscope className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm text-slate-500 font-medium">No diagnosis history records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Health</th>
                  <th className="px-5 py-3">Question</th>
                  <th className="px-5 py-3">Retrieval</th>
                  <th className="px-5 py-3">Relevance</th>
                  <th className="px-5 py-3">Groundedness</th>
                  <th className="px-5 py-3">Evidence</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDiagnoses.map((diag) => (
                  <tr key={diag._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-extrabold ${
                        diag.healthScore >= 90
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {diag.healthScore >= 90 ? '🟢 ' : '🔴 '}{diag.healthScore}/100
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-900 max-w-xs truncate">
                      {diag.question}
                    </td>
                    <td className="px-5 py-3 font-medium">
                      {diag.checks?.retrieval?.status === 'Passed' ? '🟢 Passed' : '🔴 Failed'}
                    </td>
                    <td className="px-5 py-3 font-medium">
                      {diag.checks?.relevance?.status === 'Passed' ? '🟢 Passed' : '🔴 Failed'}
                    </td>
                    <td className="px-5 py-3 font-medium">
                      {diag.checks?.groundedness?.status === 'Passed' ? '🟢 Passed' : '🔴 Failed'}
                    </td>
                    <td className="px-5 py-3 font-medium">
                      {diag.checks?.evidence?.status === 'Passed' ? '🟢 Found' : '🔴 Missing'}
                    </td>
                    <td className="px-5 py-3 text-slate-400">
                      {new Date(diag.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedDiagnosis(diag)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                      <button
                        onClick={() => handleDelete(diag._id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Viewing Full Diagnosis Report */}
      {selectedDiagnosis && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-100 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-fadeIn">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <span className="font-bold text-sm">Full Diagnosis Record</span>
              <button
                onClick={() => setSelectedDiagnosis(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <DiagnosisCard diagnosis={selectedDiagnosis} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
