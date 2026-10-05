import React from 'react';
import { Stethoscope, FileText, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EmptyState({ type = 'diagnosis' }) {
  const navigate = useNavigate();

  if (type === 'documents') {
    return (
      <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl p-10 text-center space-y-4 max-w-md mx-auto my-8">
        <div className="w-16 h-16 bg-sky-500/10 text-sky-400 rounded-2xl border border-sky-500/20 flex items-center justify-center mx-auto">
          <FileText className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-extrabold text-white text-base">No documents uploaded</h3>
          <p className="text-xs text-slate-400">
            Upload your PDF or text policy files to begin indexing and diagnosing RAG retrieval.
          </p>
        </div>
        <button
          onClick={() => navigate('/documents')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl p-10 text-center space-y-4 max-w-md mx-auto my-8">
      <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 flex items-center justify-center mx-auto">
        <Stethoscope className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h3 className="font-extrabold text-white text-base">No diagnosis yet</h3>
        <p className="text-xs text-slate-400">
          Run your first RAG test and let RAG Doctor examine your pipeline health.
        </p>
      </div>
      <button
        onClick={() => navigate('/test')}
        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md transition"
      >
        <Stethoscope className="w-4 h-4" />
        <span>Diagnose RAG</span>
      </button>
    </div>
  );
}
