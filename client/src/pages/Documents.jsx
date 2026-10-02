import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import ChunkViewerModal from '../components/ChunkViewerModal';
import { Upload, FileText, Trash2, Eye, RefreshCw, CheckCircle2, AlertCircle, Plus, Play, ArrowRight } from 'lucide-react';

export default function Documents() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedDocDetails, setSelectedDocDetails] = useState(null);
  const [message, setMessage] = useState(null);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);
    try {
      const res = await api.uploadDocument(file);
      setMessage({
        type: 'success',
        text: `Document "${file.name}" uploaded and indexed into ${res.document.chunkCount} chunks!`,
        docId: res.document._id,
        docName: res.document.filename
      });
      fetchDocuments();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to upload document' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSeedDocs = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.seedSampleDocuments();
      setMessage({ type: 'success', text: 'Sample documents seeded successfully! (refund_policy.txt, employee_policy.txt, leave_policy.txt)' });
      fetchDocuments();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to seed sample documents.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deleteDocument(id);
      setMessage({ type: 'success', text: `Deleted "${name}"` });
      fetchDocuments();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete document' });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <span>📄</span>
            <span>Document Repository</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload PDF or TXT files to chunk and index into the RAG vector database.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleSeedDocs}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Seed 3 Sample Docs</span>
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {message && (
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-2">
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              <span className="font-medium">{message.text}</span>
            </div>
            {message.docId && (
              <button
                onClick={() => navigate('/test', { state: { selectedDocId: message.docId, docName: message.docName } })}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
              >
                <span>Diagnose this Doc</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button onClick={() => setMessage(null)} className="font-bold text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      {/* File Upload Drop Area */}
      <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-300 text-center hover:border-sky-500 transition-colors">
        <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-800">Upload PDF or TXT Document</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">Supported files: .pdf, .txt (Max 15MB)</p>

        <label className="inline-flex items-center space-x-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-xs">
          <Plus className="w-4 h-4" />
          <span>{uploading ? 'Uploading & Chunking...' : 'Select Document File'}</span>
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Uploaded Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Indexed Documents ({documents.length})</h3>
          <span className="text-xs text-slate-400">Ready for vector retrieval</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">Loading document index...</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm text-slate-500 font-medium">No documents uploaded yet.</p>
            <button
              onClick={handleSeedDocs}
              className="px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-lg hover:bg-sky-500 transition"
            >
              Load Sample Demo Documents
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Document Name</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Upload Date</th>
                  <th className="px-5 py-3">Chunks</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3 font-bold text-slate-900 flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-sky-600" />
                      <span>{doc.filename}</span>
                      {doc.isSample && (
                        <span className="bg-sky-100 text-sky-800 text-[10px] px-1.5 py-0.5 rounded font-bold">Sample</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-mono font-semibold uppercase">{doc.fileType}</td>
                    <td className="px-5 py-3 text-slate-500">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 font-bold text-slate-800">{doc.chunkCount} chunks</td>
                    <td className="px-5 py-3 font-bold text-emerald-600">
                      <span className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px]">
                        🟢 Ready
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right space-x-2">
                      <button
                        onClick={() => navigate('/test', { state: { selectedDocId: doc._id, docName: doc.filename } })}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold rounded-lg border border-sky-200 transition"
                        title="Test RAG pipeline on this document"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Test RAG</span>
                      </button>
                      <button
                        onClick={() => handleViewChunks(doc._id)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Chunks</span>
                      </button>
                      <button
                        onClick={() => handleDelete(doc._id, doc.filename)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg transition"
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
