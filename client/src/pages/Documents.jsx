import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import ChunkViewerModal from '../components/ChunkViewerModal';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/ToastContext';
import { Upload, FileText, Trash2, Eye, RefreshCw, CheckCircle2, AlertCircle, Plus, Play, ArrowRight, FileCheck } from 'lucide-react';

export default function Documents() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDocDetails, setSelectedDocDetails] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await api.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const processFile = async (file) => {
    if (!file) return;

    setUploading(true);
    setUploadStep('Uploading file payload...');

    try {
      setTimeout(() => setUploadStep('Parsing document text & creating chunks...'), 400);
      setTimeout(() => setUploadStep('Generating embeddings & vector index...'), 800);

      const res = await api.uploadDocument(file);
      setUploadStep('✓ Document ready for RAG!');

      addToast(`Document "${file.name}" uploaded and indexed into ${res.document.chunkCount} chunks!`, 'success');
      fetchDocuments();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to upload document', 'error');
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadStep('');
      }, 1000);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    processFile(file);
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSeedDocs = async () => {
    setLoading(true);
    try {
      await api.seedSampleDocuments();
      addToast('Sample documents seeded successfully! (refund_policy.txt, employee_policy.txt, leave_policy.txt)', 'success');
      fetchDocuments();
    } catch (err) {
      addToast('Failed to seed sample documents.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deleteDocument(id);
      addToast(`Deleted "${name}"`, 'success');
      fetchDocuments();
    } catch (err) {
      addToast('Failed to delete document', 'error');
    }
  };

  const handleViewChunks = async (id) => {
    try {
      const doc = await api.getDocumentById(id);
      setSelectedDocDetails(doc);
    } catch (err) {
      console.error('Error getting doc details:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>📄</span>
            <span>Document Repository</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload PDF or TXT files to chunk and index into the RAG vector database.
          </p>
        </div>

        <button
          onClick={handleSeedDocs}
          className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 shadow-sm transition hover:scale-105 active:scale-95 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Seed 3 Sample Docs</span>
        </button>
      </div>

      {/* Interactive Drag & Drop File Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-8 rounded-3xl border-2 border-dashed text-center transition-all duration-300 ${
          isDragging
            ? 'border-sky-500 bg-sky-500/10 scale-[1.01] ring-4 ring-sky-500/20'
            : 'border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 hover:border-sky-500/60'
        }`}
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center transition-transform ${
            isDragging ? 'scale-110 bg-sky-500 text-white' : 'bg-sky-500/10 text-sky-500 border border-sky-500/20'
          }`}>
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Drop your document here or Browse Files
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Supported formats: .pdf, .txt (Max 15MB per file)
            </p>
          </div>

          {uploading ? (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-center space-x-2 text-xs font-bold text-sky-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{uploadStep}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          ) : (
            <label className="inline-flex items-center space-x-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-extrabold cursor-pointer transition shadow-md hover:scale-105 active:scale-95">
              <Plus className="w-4 h-4" />
              <span>Select Document File</span>
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Indexed Documents Table */}
      <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden backdrop-blur-md">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
            Indexed Documents ({documents.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">Vector Repository</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">Loading document repository...</div>
        ) : documents.length === 0 ? (
          <EmptyState type="documents" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Document Name</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Upload Date</th>
                  <th className="px-5 py-3">Chunks</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3 font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-sky-500 shrink-0" />
                      <span className="truncate">{doc.filename}</span>
                      {doc.isSample && (
                        <span className="bg-sky-500/20 text-sky-300 text-[10px] px-1.5 py-0.5 rounded font-bold border border-sky-500/30 shrink-0">
                          Sample
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-mono font-semibold uppercase text-slate-400">{doc.fileType}</td>
                    <td className="px-5 py-3 text-slate-400">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 font-bold text-slate-800 dark:text-slate-200">{doc.chunkCount} chunks</td>
                    <td className="px-5 py-3 font-bold">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[11px]">
                        🟢 Ready
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right space-x-2">
                      <button
                        onClick={() => navigate('/test', { state: { selectedDocId: doc._id, docName: doc.filename } })}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-semibold rounded-lg border border-sky-500/30 transition shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Test RAG</span>
                      </button>
                      <button
                        onClick={() => handleViewChunks(doc._id)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                      <button
                        onClick={() => handleDelete(doc._id, doc.filename)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold rounded-lg border border-rose-500/30 transition"
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

      {/* Modal for Inspecting Chunks */}
      {selectedDocDetails && (
        <ChunkViewerModal
          document={selectedDocDetails}
          onClose={() => setSelectedDocDetails(null)}
        />
      )}

    </div>
  );
}
